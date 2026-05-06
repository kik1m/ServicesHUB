const { GoogleGenAI } = require('@google/genai');
const keyManager = require('./keyManager');

/**
 * AI SEO Generator - V11 (Multi-Key Rotation)
 */
async function generateAISeo(data, type = 'tool') {
    let currentKey = keyManager.getCurrentKey();
    if (!currentKey) return null;

    const prompt = `
You are an elite SEO Strategist. Analyze the following AI tool and generate optimized SEO metadata.
Tool Name: ${data.name}
Tool Description: ${data.description}

Output ONLY a valid JSON object with these exact keys:
- "title": A compelling SEO title (max 65 characters)
- "description": A meta description focused on user intent (max 165 characters)  
- "keywords": An array of 5-8 relevant search keywords (strings)
    `;

    let attempts = 0;
    while (attempts < 5) { // Increased attempts to allow for multiple key rotations
        try {
            // Re-initialize client with current key (essential after rotation)
            const ai = new GoogleGenAI({ apiKey: keyManager.getCurrentKey() });
            const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];

            const result = await ai.models.generateContent({
                model: models[Math.floor(Math.random() * models.length)],
                contents: prompt,
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.1
                }
            });

            const responseText = result.text;
            if (!responseText) throw new Error('EMPTY_AI_RESPONSE');

            const cleaned = responseText.replace(/```json|```/g, '').trim();
            const seoResult = JSON.parse(cleaned);

            return {
                title: (seoResult.title || '').slice(0, 65).trim(),
                description: (seoResult.description || '').slice(0, 165).trim(),
                keywords: Array.isArray(seoResult.keywords) ? seoResult.keywords : [],
                search_intent: 'transactional'
            };

        } catch (err) {
            const errStr = JSON.stringify(err);
            const isQuota = errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED');
            const isServiceBusy = errStr.includes('503') || errStr.includes('UNAVAILABLE');

            if (isQuota || isServiceBusy) {
                if (isServiceBusy) console.warn(`  ⚠️ Model busy (503). Trying another key...`);

                // Try to rotate to a new key
                const hasNewKey = keyManager.rotateKey();
                if (hasNewKey) {
                    attempts++;
                    continue; // Retry with new key immediately
                } else {
                    if (isQuota) {
                        const quotaErr = new Error('ALL_KEYS_EXHAUSTED');
                        quotaErr.isQuotaError = true;
                        throw quotaErr;
                    }
                    throw err; // No keys left for 503
                }
            }

            attempts++;
            if (attempts >= 3) throw err;
            await new Promise(r => setTimeout(r, 2000));
        }
    }
}

module.exports = { generateAISeo };
