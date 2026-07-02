import { executeToolCall } from '../toolExecutor';
import { initializeSession, initializeAssistantMessage, startPeriodicSave, finalizeAssistantMessage } from '../utils/sessionManager';
import { StreamStateTracker } from '../streamStateTracker';

export const getOpenRouterStream = async function* (orModel, orContents, openRouterKey, orToolsArray = null, maxTokens = 8192) {
    let orMessages = [];
    for (const m of orContents) {
        let role = m.role === 'model' ? 'assistant' : m.role;
        let content = null;
        let tool_calls = undefined;
        let tool_call_id = undefined;

        if (m.parts && m.parts[0].functionCall) {
            role = 'assistant';
            tool_calls = [{ id: 'call_fallback', type: 'function', function: { name: m.parts[0].functionCall.name, arguments: JSON.stringify(m.parts[0].functionCall.args) } }];
        } else if (m.parts && m.parts[0].functionResponse) {
            role = 'tool';
            tool_call_id = 'call_fallback';
            content = JSON.stringify(m.parts[0].functionResponse.response);
        } else {
            content = m.parts[0].text;
        }

        const lastMsg = orMessages[orMessages.length - 1];
        if (lastMsg && lastMsg.role === 'assistant' && role === 'assistant' && !tool_calls && !lastMsg.tool_calls) {
            lastMsg.content = (lastMsg.content || '') + (content || '');
            if (lastMsg.content.length > 4000) {
                lastMsg.content = "..." + lastMsg.content.slice(-4000);
            }
        } else {
            orMessages.push({ role, content, tool_calls, tool_call_id });
        }
    }

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
        stream: true,
        max_tokens: maxTokens
    };
    
    if (openRouterTools) {
        bodyPayload.tools = openRouterTools;
    }

    const MAX_RETRIES = 3;
    let lastError = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); 
        
        try {
            const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                signal: controller.signal,
                headers: {
                    'Authorization': `Bearer ${openRouterKey}`,
                    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
                    'X-Title': 'HUBly AI Engine',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyPayload)
            });
            clearTimeout(timeoutId);

            if (res.status === 529 || res.status === 503 || res.status === 500) {
                lastError = new Error(`OpenRouter ${res.status}: ${res.statusText}`);
                const wait = attempt * 2000;
                console.warn(`[AI Engine] OpenRouter overloaded (${res.status}). Retry ${attempt}/${MAX_RETRIES} in ${wait}ms...`);
                await new Promise(r => setTimeout(r, wait));
                continue;
            }

            if (!res.ok) throw new Error(`OpenRouter Error: ${res.status} ${res.statusText}`);

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let toolCallsBuffer = {};
            let streamError = null;
            let lastFinishReason = null;
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                
                // Keep the last partial line in the buffer
                buffer = lines.pop() || '';
                
                for (let line of lines) {
                    line = line.trim();
                    if (!line) continue;
                    
                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.error) {
                                const errMsg = data.error?.message || data.error?.toString() || '';
                                const isOverload = data.error?.type === 'overloaded_error' || 
                                    errMsg.toLowerCase().includes('high demand') ||
                                    errMsg.toLowerCase().includes('overloaded') ||
                                    errMsg.toLowerCase().includes('capacity');
                                streamError = { message: errMsg, retryable: isOverload };
                                break;
                            }

                            const delta = data.choices?.[0]?.delta;
                            if (delta) {
                                if (delta.content) {
                                    yield { type: 'text', text: delta.content };
                                }
                                
                                if (delta.tool_calls) {
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
                            }
                            
                            const finishReason = data.choices?.[0]?.finish_reason;
                            if (finishReason) {
                                lastFinishReason = finishReason;
                                if (finishReason === 'length' || finishReason === 'max_tokens') {
                                    yield { type: 'control', reason: 'length' };
                                } else if (finishReason === 'tool_calls') {
                                    for (const key in toolCallsBuffer) {
                                        try {
                                            const argsObj = JSON.parse(toolCallsBuffer[key].arguments || '{}');
                                            yield { type: 'tool_call', functionCall: { name: toolCallsBuffer[key].name, args: argsObj } };
                                        } catch (e) {
                                            console.warn('[AI Engine] Failed to parse tool call args', toolCallsBuffer[key].arguments);
                                        }
                                    }
                                }
                            }
                        } catch (e) {
                            console.warn('[AI Engine] OpenRouter Stream JSON Parse Error:', e.message, 'Raw line:', line);
                        }
                    }
                }
                if (streamError) break;
            }

            if (!streamError && !['stop', 'end_turn', 'tool_calls', 'length', 'max_tokens'].includes(lastFinishReason)) {
                console.warn('[AI Engine] Stream ended abruptly without a clean finish_reason. Assuming cutoff.');
                yield { type: 'control', reason: 'length' };
            }

            if (streamError) {
                lastError = new Error(streamError.message);
                if (streamError.retryable && attempt < MAX_RETRIES) {
                    const wait = attempt * 3000;
                    console.warn(`[AI Engine] Stream-level overload error. Retry ${attempt}/${MAX_RETRIES} in ${wait}ms...`);
                    await new Promise(r => setTimeout(r, wait));
                    continue; 
                }
                throw lastError;
            }

            return; 
            
        } catch (err) {
            clearTimeout(timeoutId);
            lastError = err;
            if (err.name === 'AbortError') {
                console.warn(`[AI Engine] OpenRouter fetch timed out after 120s.`);
            }
            if (attempt < MAX_RETRIES) {
                const wait = attempt * 2000;
                await new Promise(r => setTimeout(r, wait));
                continue;
            }
        }
    }

    throw lastError || new Error('OpenRouter: All retries exhausted due to high demand.');
};

export function createOpenRouterStream(modelType, messages, toolsArray, systemInstruction, openRouterKey, verifiedUserId, userRole, initialSessionId, tool1Context, tool2Context, rawMessages, mode) {
    let orModelId = 'openai/gpt-4o';
    let maxTokens = 16384;
    // Admins need more depth to fetch multiple tables in one response
    let MAX_RAG_DEPTH = userRole === 'admin' ? 12 : 6;
    
    if (modelType === 'claude-sonnet-4-6') {
        orModelId = 'anthropic/claude-sonnet-4-6';
        maxTokens = 16000; // ✅ FIX: Raised from 12000 — Claude's long admin responses were hitting limit
    }
    if (modelType === 'o1-preview') {
        orModelId = 'openai/o1-preview';
        maxTokens = 32768;
    }

    return new ReadableStream({
        async start(controller) {
            const send = (data) => {
                try {
                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
                } catch (e) {}
            };

            const activeSessionId = await initializeSession({ initialSessionId, verifiedUserId, tool1Context, tool2Context, rawMessages, messages, send });
            let fullResponse = '';
            let saveInterval = null;
            let assistantMessageId = await initializeAssistantMessage(activeSessionId);

            try {
                let currentContents = [...messages];
                if (systemInstruction) {
                    const formatProtocol = mode === 'workflow'
                        ? `<CRITICAL_FORMAT_PROTOCOL>
You are operating in WORKFLOW MODE. For all plans, roadmaps, timelines, architecture structures, tool listings, database schemas, and project phases, you MUST output a structured JSON Blueprint payload wrapped EXACTLY inside <<<VISUAL_START>>> and <<<VISUAL_END>>> tags.
You MUST NEVER generate raw HTML, CSS, or Tailwind markup inside <<<VISUAL_START>>> and <<<VISUAL_END>>> tags. Standalone HTML visual blocks in the chat are strictly prohibited in this mode because they bypass the interactive zoomable canvas and cannot be dragged, organized, or manipulated by the user.
</CRITICAL_FORMAT_PROTOCOL>`
                        : `<CRITICAL_FORMAT_PROTOCOL>
For all plans, roadmaps, timelines, architecture diagrams, database schemas, and comparison tables, you MUST use raw HTML/Tailwind CSS wrapped in <<<VISUAL_START>>> and <<<VISUAL_END>>> tags as specified in the UI/UX Guidelines. DO NOT output plain text lists or markdown tables for these elements.

CRITICAL SEPARATION RULE: If generating multiple components, sections, tables, or steps, you MUST wrap EACH one inside its own separate <<<VISUAL_START>>> and <<<VISUAL_END>>> block. NEVER combine multiple components or sections into a single visual block or card container. Write normal text/markdown between separate blocks.
</CRITICAL_FORMAT_PROTOCOL>`;

                    const finalSystemInstruction = systemInstruction + `\n\n<CRITICAL_ANTI_LAZINESS_PROTOCOL>\nIf the user requests multiple items, components, or artifacts (e.g. 10 visual components), you MUST generate ALL of them. DO NOT stop early, DO NOT summarize, and DO NOT skip any items. Your response must be 100% complete regardless of length.\nWhen you have completely finished all your thoughts and generated every single requested component, you MUST output the exact string "[ALL_DONE]" on a new line at the very end of your response. If you do not output [ALL_DONE], I will assume you were cut off and force you to continue.\n</CRITICAL_ANTI_LAZINESS_PROTOCOL>\n${formatProtocol}`;
                    currentContents.unshift({ role: 'system', parts: [{ text: finalSystemInstruction }] });
                }

                let ragDepth = 0;
                let lastToolCall = { name: null, argsStr: null };

                saveInterval = startPeriodicSave(assistantMessageId, () => fullResponse);

                let isContinuationLoop = false;
                let continuationCount = 0;
                const MAX_CONTINUATIONS = 10;
                
                // ✅ FIX: Send thinking status ONCE before the loop (not inside it).
                // When inside the loop, Claude's multi-tool responses caused N thinking blocks on the UI.
                send({ type: 'status', phase: 'thinking', model: orModelId });

                while (ragDepth < MAX_RAG_DEPTH) {
                    let hasFunctionCall = false;
                    let functionCallData = null;
                    let wasCutOff = false;
                    let iterationResponse = '';

                    for await (const chunk of getOpenRouterStream(orModelId, currentContents, openRouterKey, toolsArray, maxTokens)) {
                        if (chunk.type === 'tool_call') {
                            hasFunctionCall = true;
                            functionCallData = chunk.functionCall;
                        } else if (chunk.type === 'text') {
                            let text = chunk.text;
                            fullResponse += text;
                            iterationResponse += text;
                            send({ type: 'chunk', text: text });
                        } else if (chunk.type === 'control' && chunk.reason === 'length') {
                            wasCutOff = true;
                        }
                    } 

                    if (fullResponse.includes('[ALL_DONE]')) {
                        fullResponse = fullResponse.replace(/\[ALL_DONE\]/g, '').trim();
                        send({ type: 'chunk', text: '' });
                        break;
                    }

                    const iterBackticks = (iterationResponse.match(/```/g) || []).length;
                    const hasUnclosedCodeBlock = iterBackticks % 2 !== 0;
                    if (hasUnclosedCodeBlock && !wasCutOff) {
                        console.warn('[AI Engine] Detected unclosed code block in chunk. Forcing continuation loop.');
                        wasCutOff = true;
                    }

                    const stateTracker = new StreamStateTracker();
                    stateTracker.analyzeFullResponse(fullResponse);
                    
                    if (stateTracker.isCutOff) {
                        wasCutOff = true;
                    }

                    if (wasCutOff && iterationResponse.trim() !== '') {
                        if (continuationCount >= MAX_CONTINUATIONS) {
                            console.warn(`[AI Engine] Reached max continuations (${MAX_CONTINUATIONS}). Breaking to avoid infinite loop.`);
                        } else {
                            continuationCount++;
                            let truncatedResponse = iterationResponse;
                            currentContents.push({ role: 'assistant', parts: [{ text: iterationResponse }] });
                            currentContents.push({ role: 'user', parts: [{ text: stateTracker.buildContinuationPrompt() }] });
                            
                            isContinuationLoop = true;
                            continue; 
                        }
                    }

                    if (!hasFunctionCall) break; 

                    if (ragDepth === MAX_RAG_DEPTH - 1) {
                        send({ type: 'chunk', text: '\n\n[warn] I reached my research limit for this query.' });
                        break;
                    }

                    const fnName = functionCallData.name;
                    const fnArgs = functionCallData.args || {};
                    const argsStr = JSON.stringify(fnArgs);
                    
                    if (lastToolCall.name === fnName && lastToolCall.argsStr === argsStr) {
                        const loopWarn = '\n\n[warn] I am stuck in a loop trying to fetch this data. Let me answer based on what I know.';
                        send({ type: 'chunk', text: loopWarn });
                        fullResponse += loopWarn;
                        break;
                    }
                    lastToolCall = { name: fnName, argsStr };

                    send({ type: 'tool_call', toolName: fnName, args: fnArgs });
                    const fnResult = await executeToolCall(fnName, fnArgs, verifiedUserId, userRole);

                    currentContents.push({ role: 'model', parts: [{ functionCall: functionCallData }] });
                    currentContents.push({ role: 'user', parts: [{ functionResponse: { name: fnName, response: fnResult } }] });
                    ragDepth++;
                }

                if (fullResponse.trim() === '') {
                    const fallbackMsg = '\n\n[warn] I tried to process this but encountered an unexpected timeout. Please rephrase your request.';
                    send({ type: 'chunk', text: fallbackMsg });
                    fullResponse += fallbackMsg;
                }

                clearInterval(saveInterval);
                await finalizeAssistantMessage(activeSessionId, assistantMessageId, fullResponse);

                send({ type: 'done' });
                controller.close();
            } catch (error) {
                if (saveInterval) clearInterval(saveInterval);
                console.error('[AI Engine] OpenRouter Direct Stream Error:', error);
                let errorMsg = (error?.message || error || 'An unknown error occurred.').toString();
                if (errorMsg.includes('429') || errorMsg.includes('exhausted') || errorMsg.includes('quota') || errorMsg.includes('Unauthorized')) {
                    errorMsg = '⏳ We are receiving too many requests right now! Please wait a few seconds and try again.';
                }
                send({ type: 'error', message: errorMsg, error: errorMsg });
                controller.close();
            }
        }
    });
}
