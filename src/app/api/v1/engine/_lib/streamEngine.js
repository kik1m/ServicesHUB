import { GoogleGenAI } from '@google/genai';
import { executeToolCall } from './toolExecutor';
import { buildToolsArray } from './toolsRegistry';
import { supabaseAdmin } from '../../../../../lib/supabaseAdmin';

// Global Round-Robin index for Gemini Keys
let currentGeminiKeyIndex = 0;

export async function createStream(modelType, messages, toolsArray, systemInstruction, keys, openRouterKey, verifiedUserId, userRole, initialSessionId, tool1Context, tool2Context, rawMessages) {
    let aiModel;
    let streamOpts = {};
    const MAX_RAG_DEPTH = 6;

    const isOpenRouterDirect = modelType === 'claude-sonnet-4-6' || modelType === 'gpt-4o' || modelType === 'o1-preview';
    // Admin can use OpenRouter for Gemini Pro if requested
    const isGeminiPro = modelType === 'gemini-pro';

    const getOpenRouterStream = async function* (orModel, orContents, orToolsArray = null) {
        const orMessages = orContents.map(m => {
            if (m.parts && m.parts[0].functionCall) {
                return { role: 'assistant', content: null, tool_calls: [{ id: 'call_fallback', type: 'function', function: { name: m.parts[0].functionCall.name, arguments: JSON.stringify(m.parts[0].functionCall.args) } }] };
            }
            if (m.parts && m.parts[0].functionResponse) {
                return { role: 'tool', tool_call_id: 'call_fallback', content: JSON.stringify(m.parts[0].functionResponse.response) };
            }
            return { 
                role: m.role === 'model' ? 'assistant' : m.role, 
                content: m.parts[0].text 
            };
        });
        
        if (systemInstruction) {
            orMessages.unshift({ role: 'system', content: systemInstruction });
        }

        // Normalize parameter types to lowercase (JSON Schema standard).
        // Gemini accepts UPPERCASE but OpenRouter (Claude/GPT) strictly requires lowercase.
        const normalizeParams = (params) => {
            if (!params || typeof params !== 'object') return params;
            const result = { ...params };
            if (result.type) result.type = result.type.toLowerCase();
            if (result.properties) {
                result.properties = Object.fromEntries(
                    Object.entries(result.properties).map(([k, v]) => [k, normalizeParams(v)])
                );
            }
            if (result.items) result.items = normalizeParams(result.items);
            return result;
        };

        const openRouterTools = orToolsArray && orToolsArray.length > 0 ? orToolsArray.flatMap(t => 
            t.functionDeclarations.map(fn => ({
                type: 'function',
                function: {
                    name: fn.name,
                    description: fn.description,
                    parameters: normalizeParams(fn.parameters)
                }
            }))
        ) : undefined;

        const bodyPayload = {
            model: orModel,
            messages: orMessages,
            stream: true
        };
        
        if (openRouterTools) {
            bodyPayload.tools = openRouterTools;
        }

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openRouterKey}`,
                'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
                'X-Title': 'HUBly AI Engine',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyPayload)
        });

        if (!res.ok) throw new Error(`OpenRouter Error: ${res.statusText}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let toolCallsBuffer = {};

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                    try {
                        const data = JSON.parse(line.slice(6));
                        const delta = data.choices[0].delta;
                        
                        if (delta?.content) {
                            yield { type: 'text', text: delta.content };
                        }
                        
                        if (delta?.tool_calls) {
                            for (const tc of delta.tool_calls) {
                                if (!toolCallsBuffer[tc.index]) {
                                    toolCallsBuffer[tc.index] = { name: tc.function?.name || '', arguments: tc.function?.arguments || '' };
                                } else {
                                    if (tc.function?.arguments) {
                                        toolCallsBuffer[tc.index].arguments += tc.function.arguments;
                                    }
                                }
                            }
                        }
                        
                        if (data.choices[0].finish_reason === 'tool_calls') {
                            for (const key in toolCallsBuffer) {
                                try {
                                    const argsObj = JSON.parse(toolCallsBuffer[key].arguments || '{}');
                                    yield { type: 'tool_call', functionCall: { name: toolCallsBuffer[key].name, args: argsObj } };
                                } catch (e) {
                                    console.error('Failed to parse OpenRouter tool arguments', e);
                                }
                            }
                        }
                    } catch (e) {}
                }
            }
        }
    };

    if (isOpenRouterDirect) {
        let orModelId = 'openai/gpt-4o';
        if (modelType === 'claude-sonnet-4-6') orModelId = 'anthropic/claude-sonnet-4-6';
        if (modelType === 'o1-preview') orModelId = 'openai/o1-preview';
        
        return new ReadableStream({
            async start(controller) {
                const send = (data) => {
                    try {
                        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
                    } catch (e) {}
                };

                let activeSessionId = initialSessionId;
                let isNewSession = false;

                // ── Session Handling ──────────────────────────────────────
                try {
                    const lastUserMsgRaw = rawMessages && rawMessages.length > 0
                        ? rawMessages[rawMessages.length - 1].content
                        : messages[messages.length - 1]?.parts[0]?.text || '';

                    if (!activeSessionId) {
                        isNewSession = true;
                        const { data, error } = await supabaseAdmin
                            .from('ai_sessions')
                            .insert({ tool1_id: tool1Context?.id || null, tool2_id: tool2Context?.id || null, user_id: verifiedUserId || null, is_public: false })
                            .select('id').single();
                        if (!error && data) activeSessionId = data.id;
                    }

                    if (activeSessionId) {
                        if (isNewSession) send({ type: 'session_id', id: activeSessionId });
                        if (lastUserMsgRaw) {
                            await supabaseAdmin.from('ai_messages').insert({ session_id: activeSessionId, role: 'user', content: lastUserMsgRaw });
                        }
                    }
                } catch (dbErr) {
                    console.error('[AI Engine] OpenRouter Direct - Error saving session:', dbErr);
                }

                // ── Full RAG Loop for OpenRouter ──────────────────────────
                try {
                    let currentContents = [...messages];
                    let ragDepth = 0;
                    let fullResponse = '';

                    while (ragDepth < MAX_RAG_DEPTH) {
                        let hasFunctionCall = false;
                        let functionCallData = null;

                        for await (const chunk of getOpenRouterStream(orModelId, currentContents, toolsArray)) {
                            if (chunk.type === 'tool_call') {
                                hasFunctionCall = true;
                                functionCallData = chunk.functionCall;
                            } else if (chunk.type === 'text') {
                                fullResponse += chunk.text;
                                send({ type: 'chunk', text: chunk.text });
                            }
                        }

                        if (!hasFunctionCall) break; // Done — no more tool calls

                        if (ragDepth === MAX_RAG_DEPTH - 1) {
                            send({ type: 'chunk', text: '\n\n[warn] I reached my research limit for this query.' });
                            break;
                        }

                        // Execute the requested tool
                        const fnName = functionCallData.name;
                        const fnArgs = functionCallData.args || {};
                        send({ type: 'tool_call', toolName: fnName, args: fnArgs });
                        const fnResult = await executeToolCall(fnName, fnArgs, verifiedUserId, userRole);

                        // Feed result back into conversation for next iteration
                        currentContents.push({ role: 'model', parts: [{ functionCall: functionCallData }] });
                        currentContents.push({ role: 'user', parts: [{ functionResponse: { name: fnName, response: fnResult } }] });
                        ragDepth++;
                    }

                    if (fullResponse.trim() === '') {
                        const fallbackMsg = '\n\n[warn] I tried to process this but encountered an unexpected timeout. Please rephrase your request.';
                        send({ type: 'chunk', text: fallbackMsg });
                        fullResponse += fallbackMsg;
                    }

                    // Save the assistant reply
                    if (activeSessionId && fullResponse.trim()) {
                        try {
                            await supabaseAdmin.from('ai_messages').insert({ session_id: activeSessionId, role: 'assistant', content: fullResponse });
                        } catch (dbErr) {
                            console.error('[AI Engine] OpenRouter Direct - Error saving assistant message:', dbErr);
                        }
                    }

                    send({ type: 'full_response', text: fullResponse });
                    send({ type: 'done' });
                    controller.close();
                } catch (error) {
                    console.error('[AI Engine] OpenRouter Direct Stream Error:', error.message);
                    let errorMsg = error.message || 'An unknown error occurred.';
                    if (errorMsg.includes('429') || errorMsg.includes('exhausted') || errorMsg.includes('quota') || errorMsg.includes('Unauthorized')) {
                        errorMsg = '⏳ We are receiving too many requests right now! Please wait a few seconds and try again.';
                    }
                    send({ type: 'error', message: errorMsg, error: errorMsg });
                    controller.close();
                }
            }
        });
    } else {
        // --- Gemini Routing ---
        const geminiKey = keys[currentGeminiKeyIndex];
        currentGeminiKeyIndex = (currentGeminiKeyIndex + 1) % keys.length;
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        
        let activeModelId = 'gemini-2.5-flash'; // default — safe, always available
        if (modelType === 'gemini-pro') activeModelId = 'gemini-2.5-pro';
        // Note: gemini-flash-thinking is DEPRECATED. Map to gemini-2.5-flash.

        aiModel = ai.models;
        streamOpts = {
            model: activeModelId,
            contents: messages,
            config: {
                systemInstruction: systemInstruction,
                tools: toolsArray
            }
        };

        return new ReadableStream({
            async start(controller) {
                const send = (data) => {
                    try {
                        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
                    } catch (e) {} // ignore write after close
                };

                let activeSessionId = initialSessionId;
                let isNewSession = false;

                try {
                    const lastUserMsgRaw = rawMessages && rawMessages.length > 0 
                        ? rawMessages[rawMessages.length - 1].content 
                        : messages[messages.length - 1]?.parts[0]?.text || '';

                    if (!activeSessionId) {
                        isNewSession = true;
                        const { data, error } = await supabaseAdmin
                            .from('ai_sessions')
                            .insert({
                                tool1_id: tool1Context?.id || null,
                                tool2_id: tool2Context?.id || null,
                                user_id: verifiedUserId || null,
                                is_public: false
                            })
                            .select('id')
                            .single();
                        
                        if (!error && data) {
                            activeSessionId = data.id;
                        }
                    }

                    if (activeSessionId) {
                        if (isNewSession) {
                            send({ type: 'session_id', id: activeSessionId });
                        }
                        if (lastUserMsgRaw) {
                            await supabaseAdmin.from('ai_messages').insert({
                                session_id: activeSessionId,
                                role: 'user',
                                content: lastUserMsgRaw
                            });
                        }
                    }
                } catch (dbErr) {
                    console.error('[AI Engine] Error saving session/user message:', dbErr);
                }

                try {
                    let currentContents = [...messages];
                    let ragDepth = 0;
                    let fullResponse = '';

                    while (ragDepth < MAX_RAG_DEPTH) {
                        let currentStream = null;
                        let attempt = 0;
                        
                        // Smart Fallback: Try all 5 keys. If they fail, fallback to OpenRouter Gemini!
                        let openRouterFallbackTriggered = false;
                        
                        while (attempt < keys.length) {
                            try {
                                currentStream = await aiModel.generateContentStream({
                                    model: activeModelId,
                                    contents: currentContents,
                                    config: {
                                        systemInstruction: systemInstruction,
                                        tools: toolsArray
                                    }
                                });
                                break; // Success!
                            } catch (e) {
                                if (e.message?.includes('429') || e.message?.includes('quota') || e.message?.includes('exhausted')) {
                                    console.warn(`[AI Engine] Key ${currentGeminiKeyIndex} exhausted. Trying next key...`);
                                    currentGeminiKeyIndex = (currentGeminiKeyIndex + 1) % keys.length;
                                    aiModel = new GoogleGenAI({ apiKey: keys[currentGeminiKeyIndex] }).models;
                                    attempt++;
                                } else {
                                    throw e; // Real error, throw it!
                                }
                            }
                        }

                        if (!currentStream) {
                            console.warn('[AI Engine] All 5 Gemini keys exhausted. Falling back to OpenRouter Gemini 2.5 Flash...');
                            openRouterFallbackTriggered = true;
                        }

                        if (openRouterFallbackTriggered) {
                            // Run the fallback via OpenRouter stream
                            const orModelStr = activeModelId === 'gemini-2.5-pro' ? 'google/gemini-2.5-pro' : 'google/gemini-2.5-flash';
                            try {
                                let hasFunctionCall = false;
                                let functionCallData = null;
                                
                                for await (const chunk of getOpenRouterStream(orModelStr, currentContents, toolsArray)) {
                                    if (chunk.type === 'tool_call') {
                                        hasFunctionCall = true;
                                        functionCallData = chunk.functionCall;
                                        break; // Stop text yield if function called
                                    } else if (chunk.type === 'text') {
                                        fullResponse += chunk.text;
                                        send({ type: 'chunk', text: chunk.text });
                                    }
                                }
                                
                                if (!hasFunctionCall) break; // Finished completely
                                
                                if (ragDepth === MAX_RAG_DEPTH) {
                                    send({ type: 'chunk', text: '\n\n[warn] I reached my research limit for this query.' });
                                    break;
                                }

                                // Execute Tool
                                const fnName = functionCallData.name;
                                const fnArgs = functionCallData.args || {};
                                send({ type: 'tool_call', toolName: fnName, args: fnArgs });
                                const fnResult = await executeToolCall(fnName, fnArgs, verifiedUserId, userRole);

                                currentContents.push({ role: 'model', parts: [{ functionCall: functionCallData }] });
                                currentContents.push({ role: 'user', parts: [{ functionResponse: { name: fnName, response: fnResult } }] });
                                ragDepth++;
                                continue; // Loop again for the next RAG iteration
                            } catch (e) {
                                console.warn('[AI Engine] OpenRouter fallback also failed:', e.message);
                                throw new Error('429: All API keys have exhausted their free tier quota.');
                            }
                        }

                        let hasFunctionCall = false;
                        let functionCallData = null;

                        for await (const chunk of currentStream) {
                            if (chunk.functionCalls && chunk.functionCalls.length > 0) {
                                hasFunctionCall = true;
                                functionCallData = chunk.functionCalls[0];
                                break; // Stop yielding text if a function is invoked
                            }
                            const text = chunk.text;
                            if (text) {
                                fullResponse += text;
                                send({ type: 'chunk', text });
                            }
                        }

                        if (!hasFunctionCall) break; // Final response complete!

                        if (ragDepth === MAX_RAG_DEPTH) {
                            send({ type: 'chunk', text: '\n\n[warn] I reached my research limit for this query.' });
                            break;
                        }

                        // 🔍 Execute RAG Function
                        const fnName = functionCallData.name;
                        const fnArgs = functionCallData.args || {};
                        
                        send({ type: 'tool_call', toolName: fnName, args: fnArgs });

                        const fnResult = await executeToolCall(fnName, fnArgs, verifiedUserId, userRole);

                        // Inform the model of the result
                        currentContents.push({
                            role: 'model',
                            parts: [{ functionCall: functionCallData }]
                        });

                        currentContents.push({
                            role: 'user',
                            parts: [{
                                functionResponse: {
                                    name: fnName,
                                    response: fnResult
                                }
                            }]
                        });

                        ragDepth++;
                    }

                    if (fullResponse.trim() === '') {
                        // Edge Case: Gemini outputted NOTHING (or only reasoning block without finishing)
                        const fallbackMsg = "\n\n[warn] I tried to process this but encountered an unexpected timeout. Please try rephrasing your request.";
                        send({ type: 'chunk', text: fallbackMsg });
                        fullResponse += fallbackMsg;
                    }

                    if (activeSessionId && fullResponse.trim()) {
                        try {
                            await supabaseAdmin.from('ai_messages').insert({
                                session_id: activeSessionId,
                                role: 'assistant',
                                content: fullResponse
                            });
                        } catch (dbErr) {
                            console.error('[AI Engine] Error saving AI message:', dbErr);
                        }
                    }

                    send({ type: 'full_response', text: fullResponse });
                    send({ type: 'done' });
                    controller.close();
                } catch (error) {
                    console.error('[AI Engine] Stream Error:', error.message);
                    
                    let errorMsg = error.message || 'An unknown error occurred.';
                    if (errorMsg.includes('429') || errorMsg.includes('exhausted') || errorMsg.includes('quota') || errorMsg.includes('Unauthorized')) {
                        errorMsg = "⏳ We are receiving too many requests right now! Please wait a few seconds and try again.";
                    }
                    
                    send({ type: 'error', message: errorMsg, error: errorMsg });
                    controller.close();
                }
            }
        });
    }
}
