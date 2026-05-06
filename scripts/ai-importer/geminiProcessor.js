const { GoogleGenAI } = require('@google/genai');
const keyManager = require('./keyManager');

/**
 * 🧠 Elite Gemini Processor (V4 - Hybrid Hardened)
 * Restored original prompt while keeping technical stability fixes.
 */
async function processToolData(markdownContent, categories, toolUrl, existingData = null) {
    let currentKey = keyManager.getCurrentKey();
    if (!currentKey) {
        console.error("❌ CRITICAL ERROR: No Gemini API keys found.");
        return null;
    }

    const categoriesList = categories.map(c => `ID: ${c.id} | Name: ${c.name}`).join('\n');

    let contextAddition = "";
    if (existingData) {
        contextAddition = `
        UPDATE MODE ACTIVATED:
        This tool already exists in our database. Here is its current data:
        Name: ${existingData.name || 'N/A'}
        Description: ${existingData.description || 'N/A'}
        YOUR GOAL: Upgrade this data!
        `;
    }

    const prompt = `
    You are an elite, highly critical AI SaaS database curator. Your goal is to extract information in a RICH description but BALANCED features/cases.
    
    WEBSITE URL: ${toolUrl}.
    
    ${contextAddition}

    AVAILABLE CATEGORIES:
    ${categoriesList}

    STRICT FORMATTING RULES (ELITE PRECISION STYLE):
    1. "name": Official brand name.
    2. "short_description": One powerful, technical sentence (Max 15 words).
    3. "description": 3 deep, rich paragraphs (each 4-5 long sentences) using: Overview:, Innovation:, Impact:
    4. "pricing_type": Choose: Free, Freemium, Paid, Free Trial.
    5. "pricing_details": Single concise string (NO parentheses). Example: "Free tier available, paid plans from $9.99/month".
    6. "features": List 5-6 features as VERY SHORT phrases (Max 4 words each).
    7. "use_cases": List 3 to 5 scenarios as concise, meaningful phrases (6-10 words each). Example: "Rapid Prototyping for Product Managers and Startups".

    REQUIRED JSON SCHEMA:
    {
        "name": "String",
        "slug": "String",
        "short_description": "String",
        "description": "String",
        "pricing_type": "String",
        "pricing_details": "String",
        "use_cases": ["String"],
        "features": ["String"],
        "category_action": "String",
        "category_id": "String",
        "new_category_name": "String",
        "new_category_slug": "String"
    }

    WEBSITE CONTENT:
    ${markdownContent.substring(0, 15000)}
    `;

    const models = ['gemini-flash-latest', 'gemini-2.5-flash'];
    let modelIndex = 0;
    let totalAttempts = 0;
    const maxTotalAttempts = 6; 

    while (totalAttempts < maxTotalAttempts) {
        const currentModel = models[modelIndex];
        try {
            console.log(`🤖 [AI ENGINE] Processing with ${currentModel}... (Key [${keyManager.currentIndex + 1}])`);
            const ai = new GoogleGenAI({ apiKey: keyManager.getCurrentKey() });
            
            const result = await ai.models.generateContent({
                model: currentModel,
                contents: prompt,
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.1
                }
            });

            // Hardened Extraction
            let responseText = "";
            try {
                responseText = typeof result.text === 'function' ? result.text() : 
                               (result.response?.text ? result.response.text() : (result.text || ""));
            } catch (e) {
                responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            }

            if (!responseText) throw new Error('EMPTY_AI_RESPONSE');
            
            const startIdx = responseText.indexOf('{');
            const endIdx = responseText.lastIndexOf('}');
            
            if (startIdx === -1 || endIdx === -1) {
                throw new Error('NO_JSON_FOUND_IN_RESPONSE');
            }

            const jsonOnly = responseText.substring(startIdx, endIdx + 1);
            const parsedData = JSON.parse(jsonOnly);
            
            console.log(`✅ [AI ENGINE] Success! Data extracted for: ${parsedData.name} using ${currentModel}`);
            return parsedData;

        } catch (error) {
            const errStr = JSON.stringify(error);
            const isQuota = errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED');
            const isBusy = errStr.includes('503') || errStr.includes('UNAVAILABLE') || errStr.includes('500');
            const isNotFound = errStr.includes('404');
            const isJsonError = error instanceof SyntaxError || error.message.includes('JSON');

            if ((isBusy || isNotFound || isJsonError) && modelIndex < models.length - 1) {
                console.warn(`⚠️ ${currentModel} error. Falling back...`);
                modelIndex++;
                continue;
            }

            if (isQuota || isBusy) {
                console.warn(`⚠️ Key/Service pressure. Rotating...`);
                const hasNewKey = keyManager.rotateKey();
                if (hasNewKey) {
                    await new Promise(r => setTimeout(r, 10000));
                    totalAttempts++;
                    continue; 
                }
            }

            console.error(`❌ Gemini API Error:`, error.message);
            totalAttempts++;
            await new Promise(r => setTimeout(r, 5000));
        }
    }
    return null;
}

module.exports = { processToolData };
