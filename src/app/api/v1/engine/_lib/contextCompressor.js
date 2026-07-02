import { GoogleGenAI } from '@google/genai';
import { supabaseAdmin } from '../../../../../lib/supabaseAdmin';

/**
 * contextCompressor.js — HUBly AI Engine v2.0
 *
 * Improvements:
 * 1. Strips old [REASONING] blocks from context before compression (saves tokens)
 * 2. Preserves tool calls + their results (important for continuity)
 * 3. Always keeps the last 3 messages uncompressed for coherent flow
 * 4. Smarter threshold — compresses every 5 messages after the first 10
 */
export async function compressContext(formattedMessages, getApiKeys, sessionId, dbContextSummary) {
    if (formattedMessages.length > 10) {
        const COMPRESS_EVERY_N = 5;
        const shouldCompress = (formattedMessages.length - 10) % COMPRESS_EVERY_N === 0;

        if (shouldCompress) {
            // Keep last 3 messages intact — rest goes for compression
            const recentMessages = formattedMessages.slice(-3);
            const olderMessages = formattedMessages.slice(0, -3);

            // Strip [REASONING] blocks from older messages to save tokens
            const cleanedOlderMessages = olderMessages.map(msg => {
                if (msg.role !== 'model') return msg;
                const cleanedParts = msg.parts.map(part => {
                    if (typeof part.text !== 'string') return part;
                    // Remove [REASONING]...[/REASONING] blocks
                    const cleaned = part.text
                        .replace(/\[REASONING\][\s\S]*?\[\/REASONING\]/gi, '')
                        .replace(/🧠 AI Thought Process:[\s\S]*?(?:---|$)/gi, '')
                        .trim();
                    return { ...part, text: cleaned };
                });
                return { ...msg, parts: cleanedParts };
            });

            // Separate tool interactions (preserve them — critical for context continuity)
            const toolMessages = cleanedOlderMessages.filter(m =>
                m.parts?.some(p => p.functionCall || p.functionResponse)
            );
            const textMessages = cleanedOlderMessages.filter(m =>
                !m.parts?.some(p => p.functionCall || p.functionResponse)
            );

            const backgroundCompression = async () => {
                try {
                    const keys = getApiKeys();
                    let response = null;
                    let attempt = 0;
                    
                    while (attempt < keys.length) {
                        try {
                            const ai = new GoogleGenAI({ apiKey: keys[attempt] });
                            const prevSummaryText = dbContextSummary ? `\n\nPrevious Summary:\n${dbContextSummary}` : '';
                            const summaryPrompt = `Summarize the following chat history into a concise context block. 
Rules:
- Preserve user preferences, constraints, project details, and key facts
- Mention any important tool results (e.g. database fetches, search results)  
- Integrate with Previous Summary if provided
- Keep under 500 words
- Do NOT include [REASONING] blocks in output

History:\n${JSON.stringify(textMessages)}${prevSummaryText}`;
                            
                            response = await ai.models.generateContent({
                                model: 'gemini-2.5-flash',
                                contents: summaryPrompt
                            });
                            break;
                        } catch (err) {
                            if (err.message?.includes('429') || err.message?.includes('quota')) {
                                console.warn(`[AI Engine] Context compression quota hit on key ${attempt}. Trying next...`);
                                attempt++;
                            } else {
                                throw err;
                            }
                        }
                    }

                    if (!response) throw new Error('All keys exhausted during context compression.');

                    const newSummaryText = response.text;

                    if (sessionId && newSummaryText && typeof newSummaryText === 'string' && newSummaryText.trim().length > 100) {
                        await supabaseAdmin.from('ai_sessions')
                            .update({ context_summary: newSummaryText.trim() })
                            .eq('id', sessionId);
                    }
                } catch (e) {
                    console.error('[AI Engine] Background Context Compression failed:', e.message);
                }
            };

            backgroundCompression();
        }

        // Build the returned context:
        // [summary] + [recent tool interactions if any] + [last 3 messages]
        const recentMessages = formattedMessages.slice(-3);
        const recentToolMessages = formattedMessages.slice(-10, -3).filter(m =>
            m.parts?.some(p => p.functionCall || p.functionResponse)
        );

        if (dbContextSummary) {
            return [
                { role: 'user', parts: [{ text: `[PREVIOUS CONTEXT SUMMARY]\n${dbContextSummary}` }] },
                { role: 'model', parts: [{ text: 'Understood. I will use this context for our continued conversation.' }] },
                ...recentToolMessages,
                ...recentMessages,
            ];
        }
        return [...recentToolMessages, ...recentMessages];
    }
    
    if (dbContextSummary) {
        return [
            { role: 'user', parts: [{ text: `[PREVIOUS CONTEXT SUMMARY]\n${dbContextSummary}` }] },
            { role: 'model', parts: [{ text: 'Understood. I will use this context for our continued conversation.' }] },
            ...formattedMessages,
        ];
    }
    
    return formattedMessages;
}
