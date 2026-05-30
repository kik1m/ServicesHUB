import { GoogleGenAI } from '@google/genai';

export async function compressContext(formattedMessages, getApiKeys) {
    // 🧠 Persistent Context Compression
    if (formattedMessages.length > 10) {
        const recentMessages = formattedMessages.slice(-6);
        const olderMessages = formattedMessages.slice(0, -6);

        try {
            const keys = getApiKeys();
            let response = null;
            let attempt = 0;
            
            while (attempt < keys.length) {
                try {
                    const ai = new GoogleGenAI({ apiKey: keys[attempt] });
                    const summaryPrompt = `Summarize the following chat history into a concise context block. Preserve user preferences, constraints, and key facts. \n\nHistory:\n${JSON.stringify(olderMessages)}`;
                    
                    response = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: summaryPrompt
                    });
                    break; // Success!
                } catch (err) {
                    if (err.message?.includes('429') || err.message?.includes('quota')) {
                        console.warn(`[AI Engine] Context compression hit quota limit on key index ${attempt}. Trying next...`);
                        attempt++;
                    } else {
                        throw err;
                    }
                }
            }

            if (!response) {
                throw new Error("All keys exhausted during context compression.");
            }

            const summaryText = response.text;

            return [
                { role: 'user', parts: [{ text: `[PREVIOUS CONTEXT SUMMARY]\n${summaryText}` }] },
                { role: 'model', parts: [{ text: "Understood. I will use this context for our continued conversation." }] },
                ...recentMessages
            ];
        } catch (e) {
            console.error('[AI Engine] Context Compression failed:', e.message);
            return formattedMessages.slice(-10); // Fallback: just slice the array
        }
    }
    
    return formattedMessages;
}
