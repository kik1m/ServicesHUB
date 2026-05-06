const { GoogleGenAI } = require('@google/genai');

/**
 * AI SEO Generator (CommonJS) - V10 Smart Quota Handling
 *
 * Throws QUOTA_EXHAUSTED error when Gemini free tier limit is hit,
 * so callers can stop immediately instead of wasting retries.
 */
async function generateAISeo(data, type = 'tool') {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are an elite SEO Strategist. Analyze the following AI tool and generate optimized SEO metadata.
Tool Name: ${data.name}
Tool Description: ${data.description}

Output ONLY a valid JSON object (no markdown, no code blocks) with these exact keys:
- "title": A compelling SEO title (max 65 characters)
- "description": A meta description focused on user intent (max 165 characters)  
- "keywords": An array of 5-8 relevant search keywords (strings)
    `;

    let responseText;
    let attempts = 0;

    while (attempts < 2) {
        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            responseText = result.text;
            if (responseText) break;
        } catch (err) {
            // Detect quota exhaustion (429 / RESOURCE_EXHAUSTED)
            const errStr = JSON.stringify(err);
            if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota')) {
                const quotaErr = new Error('QUOTA_EXHAUSTED');
                quotaErr.isQuotaError = true;
                throw quotaErr;
            }
            attempts++;
            if (attempts === 2) throw err;
        }
    }

    // Robust JSON parsing (strip markdown code blocks if present)
    const cleaned = responseText.replace(/```json|```/g, '').trim();
    const seoResult = JSON.parse(cleaned);

    return {
        title: (seoResult.title || '').slice(0, 65).trim(),
        description: (seoResult.description || '').slice(0, 165).trim(),
        keywords: Array.isArray(seoResult.keywords) ? seoResult.keywords : [],
        search_intent: 'transactional'
    };
}

module.exports = { generateAISeo };
