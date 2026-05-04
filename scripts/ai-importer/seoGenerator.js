const { GoogleGenAI } = require('@google/genai');

/**
 * AI SEO Generator (CommonJS) - V8 Ultimate Elite Final (Surgical Fixes)
 */
async function generateAISeo(data, type = 'tool') {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    try {
        const ai = new GoogleGenAI({ apiKey });
        const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

        let context = `Name: ${data.name}\nDescription: ${data.description}`;
        
        const prompt = `
        You are an elite SEO Strategist. 
        Focus on CLARITY and USER INTENT.
        Context: ${context}
        Output ONLY raw JSON.
        `;

        // Retry Logic (Max 2 attempts)
        let responseText;
        let attempts = 0;
        while (attempts < 2) {
            try {
                const result = await model.generateContent({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }]
                });
                responseText = result.response.text();
                if (responseText) break;
            } catch (err) {
                attempts++;
                if (attempts === 2) throw err;
            }
        }

        // Robust JSON Validation
        let seoResult;
        try {
            seoResult = JSON.parse(responseText);
        } catch (e) {
            throw new Error('INVALID_AI_JSON');
        }

        return {
            title: (seoResult.title || '').slice(0, 65).trim(),
            description: (seoResult.description || '').slice(0, 165).trim(),
            keywords: Array.isArray(seoResult.keywords) ? seoResult.keywords : [],
            search_intent: 'transactional'
        };

    } catch (error) {
        console.error('[SEO SCRIPT ERROR]:', error.message);
        return {
            title: `${data.name} - Review, Features & Pricing`,
            description: (data.description || '').slice(0, 155),
            keywords: [],
            search_intent: 'transactional'
        };
    }
}

module.exports = { generateAISeo };
