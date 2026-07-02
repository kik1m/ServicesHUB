import { GoogleGenAI } from '@google/genai';
import { executeToolCall } from '../toolExecutor';
import { initializeSession, initializeAssistantMessage, startPeriodicSave, finalizeAssistantMessage } from '../utils/sessionManager';
import { getOpenRouterStream } from './openRouter';
import { getRotator } from '../geminiKeyRotator';
import { StreamStateTracker } from '../streamStateTracker';

export function createGeminiStream(modelType, messages, toolsArray, systemInstruction, keys, verifiedUserId, userRole, initialSessionId, tool1Context, tool2Context, rawMessages, mode) {
    const keyRotator = getRotator(keys);
    let currentKeyObj = keyRotator.getNextKey();
    let aiModel = new GoogleGenAI({ apiKey: currentKeyObj.key }).models;
    
    let activeModelId = 'gemini-2.5-flash'; 
    if (modelType === 'gemini-pro') activeModelId = 'gemini-2.5-pro';

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


    const MAX_TOOL_CALLS = userRole === 'admin' ? 12 : 6;
    const MAX_CONTINUATIONS = 10;

    return new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            const send = (data) => {
                try {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
                } catch (e) {} 
            };

            const activeSessionId = await initializeSession({ initialSessionId, verifiedUserId, tool1Context, tool2Context, rawMessages, messages, send });
            let saveInterval = null;
            let assistantMessageId = await initializeAssistantMessage(activeSessionId);
            let fullResponse = '';

            try {
                let currentContents = [...messages];
                let toolCallDepth = 0;
                let continuationCount = 0;
                let lastToolCall = { name: null, argsStr: null };

                const stateTracker = new StreamStateTracker();

                saveInterval = startPeriodicSave(assistantMessageId, () => fullResponse);

                // ✅ FIX: Send thinking status ONCE before starting — not inside the loop.
                // Previously this was inside the while loop causing N thinking blocks for N iterations.
                send({ type: 'status', phase: 'thinking', model: activeModelId });

                while (toolCallDepth < MAX_TOOL_CALLS && continuationCount <= MAX_CONTINUATIONS) {
                    let currentStream = null;
                    let attempt = 0;
                    let openRouterFallbackTriggered = false;

                    while (attempt < keys.length) {
                        try {
                            currentStream = await aiModel.generateContentStream({
                                model: activeModelId,
                                contents: currentContents,
                                config: {
                                    systemInstruction: finalSystemInstruction,
                                    tools: toolsArray,
                                    maxOutputTokens: 12000,
                                    safetySettings: [
                                        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                                        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
                                        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                                        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" }
                                    ]
                                }
                            });
                            keyRotator.recordSuccess(currentKeyObj.key);
                            break; 
                        } catch (e) {
                            console.warn(`[AI Engine] Key index ${currentKeyObj.idx || 'unknown'} failed. Error: ${e.message || e}`);
                            keyRotator.recordFailure(currentKeyObj.key);
                            attempt++;
                            if (attempt >= keys.length) {
                                throw e; 
                            }
                            currentKeyObj = keyRotator.getNextKey();
                            aiModel = new GoogleGenAI({ apiKey: currentKeyObj.key }).models;
                        }
                    }

                    if (!currentStream) {
                        console.warn('[AI Engine] All 5 Gemini keys exhausted. Falling back to OpenRouter Gemini 2.5 Flash...');
                        openRouterFallbackTriggered = true;
                    }

                    let hasFunctionCall = false;
                    let functionCallData = null;
                    let iterationResponse = '';
                    let hitTokenLimit = false;

                    if (openRouterFallbackTriggered) {
                        const orModelStr = activeModelId === 'gemini-2.5-pro' ? 'google/gemini-2.5-pro' : 'google/gemini-2.5-flash';
                        try {
                            const fallbackOrKey = process.env.OPENROUTER_API_KEY;
                            let phaseSentBuilding = false;
                            let phaseSentCoding = false;
                            
                            for await (const chunk of getOpenRouterStream(orModelStr, currentContents, fallbackOrKey, toolsArray, 8192)) {
                                if (chunk.type === 'tool_call') {
                                    hasFunctionCall = true;
                                    functionCallData = chunk.functionCall;
                                    break; 
                                } else if (chunk.type === 'text') {
                                    fullResponse += chunk.text;
                                    iterationResponse += chunk.text;
                                    send({ type: 'chunk', text: chunk.text });

                                    // Phase detection for OpenRouter fallback
                                    if (!phaseSentBuilding && chunk.text.includes('<<<VISUAL_START>>>')) {
                                        send({ type: 'status', phase: 'building' });
                                        phaseSentBuilding = true;
                                    } else if (!phaseSentCoding && !phaseSentBuilding && chunk.text.includes('```')) {
                                        send({ type: 'status', phase: 'coding' });
                                        phaseSentCoding = true;
                                    }
                                } else if (chunk.type === 'control' && chunk.reason === 'length') {
                                    hitTokenLimit = true;
                                }
                            }
                        } catch (e) {
                            console.warn('[AI Engine] OpenRouter fallback also failed:', e.message);
                            throw new Error('429: All API keys have exhausted their free tier quota.');
                        }

                    } else {
                        // Gemini native stream reading
                        let phaseSentBuilding = false;
                        let phaseSentCoding = false;
                        for await (const chunk of currentStream) {
                            if (chunk.functionCalls && chunk.functionCalls.length > 0) {
                                hasFunctionCall = true;
                                functionCallData = chunk.functionCalls[0];
                                break; 
                            }
                            
                            const text = chunk.text;
                            if (text) {
                                fullResponse += text;
                                iterationResponse += text;
                                send({ type: 'chunk', text });

                                // Phase detection — emit status signals for UI indicator
                                if (!phaseSentBuilding && text.includes('<<<VISUAL_START>>>')) {
                                    send({ type: 'status', phase: 'building' });
                                    phaseSentBuilding = true;
                                } else if (!phaseSentCoding && !phaseSentBuilding && text.includes('```')) {
                                    send({ type: 'status', phase: 'coding' });
                                    phaseSentCoding = true;
                                }
                            }
                            
                            const finishReason = chunk.candidates?.[0]?.finishReason;
                            if (finishReason === 'MAX_TOKENS' || finishReason === 'RECITATION') {
                                hitTokenLimit = true;
                            }
                        }
                    }

                    if (fullResponse.includes('[ALL_DONE]')) {
                        fullResponse = fullResponse.replace(/\[ALL_DONE\]/g, '').trim();
                        send({ type: 'chunk', text: '' }); 
                        break;
                    }

                    stateTracker.analyzeFullResponse(fullResponse);
                    const qualityResult = stateTracker.scoreResponse(fullResponse);
                    const wasCutOff = hitTokenLimit || stateTracker.isCutOff || qualityResult.needsContinuation;

                    if (qualityResult.warnings.length > 0) {
                        console.warn('[AI Engine] Quality issues detected:', qualityResult.warnings.join(', '), `(score: ${qualityResult.score})`);
                    }

                    if (wasCutOff && iterationResponse.trim() !== '' && continuationCount < MAX_CONTINUATIONS) {
                        continuationCount++;
                        console.log(`[AI Engine] Cut-off detected (continuation ${continuationCount}/${MAX_CONTINUATIONS}). State: visualBlock=${stateTracker.openVisualBlock}, codeFence=${stateTracker.openCodeFence}`);

                        currentContents.push({
                            role: 'model',
                            parts: [{ text: iterationResponse }]
                        });
                        currentContents.push({
                            role: 'user',
                            parts: [{ text: stateTracker.buildContinuationPrompt() }]
                        });
                        continue;
                    }

                    if (wasCutOff && continuationCount >= MAX_CONTINUATIONS) {
                        const closingText = stateTracker.openVisualBlock 
                            ? '\n<<<VISUAL_END>>>\n\n[warn] Response was truncated due to length. The code above may be incomplete.'
                            : stateTracker.openCodeFence
                            ? '\n```\n\n[warn] Response was truncated due to length.'
                            : '\n\n[warn] Response was truncated due to length.';
                        
                        send({ type: 'chunk', text: closingText });
                        fullResponse += closingText;
                        break;
                    }

                    if (!hasFunctionCall) break; 
                    
                    if (toolCallDepth === MAX_TOOL_CALLS) {
                        const loopWarn = '\n\n[warn] I reached my research limit for this query.';
                        send({ type: 'chunk', text: loopWarn });
                        fullResponse += loopWarn;
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

                    toolCallDepth++;
                }

                if (fullResponse.trim() === '') {
                    const fallbackMsg = "\n\n[warn] I tried to process this but encountered an unexpected timeout. Please try rephrasing your request.";
                    send({ type: 'chunk', text: fallbackMsg });
                    fullResponse += fallbackMsg;
                }

                clearInterval(saveInterval);
                await finalizeAssistantMessage(activeSessionId, assistantMessageId, fullResponse);

                send({ type: 'done' });
                controller.close();
            } catch (error) {
                console.error('[AI Engine] Stream Error:', error);
                
                let errorMsg = (error?.message || error || 'An unknown error occurred.').toString();
                if (errorMsg.includes('429') || errorMsg.includes('exhausted') || errorMsg.includes('quota') || errorMsg.includes('Unauthorized')) {
                    errorMsg = "⏳ We are receiving too many requests right now! Please wait a few seconds and try again.";
                }
                
                send({ type: 'error', message: errorMsg, error: errorMsg });
                controller.close();
            } finally {
                if (saveInterval) clearInterval(saveInterval);
                await finalizeAssistantMessage(activeSessionId, assistantMessageId, fullResponse);
            }
        }
    });
}
