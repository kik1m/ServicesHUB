const { GoogleGenAI } = require('@google/genai');
const keyManager = require('./keyManager');

/**
 * 🧠 Elite Gemini Processor (V3 - Multi-Key Rotation)
 * Handles tool processing with automatic API key switching on quota exhaustion.
 */
async function processToolData(markdownContent, categories, toolUrl, existingData = null) {
    let currentKey = keyManager.getCurrentKey();
    if (!currentKey) {
        console.error("❌ CRITICAL ERROR: No Gemini API keys found.");
        return null;
    }

    console.log(`🤖 Sending data to Gemini 2.5 Flash for processing... (Key [${keyManager.currentIndex + 1}])`);

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
    You are an elite, highly critical AI SaaS database curator and SEO expert.
    I will provide you with the markdown content scraped from an AI tool's website: ${toolUrl}.
    
    ${contextAddition}

    AVAILABLE CATEGORIES:
    ${categoriesList}

    REQUIRED JSON SCHEMA:
    Return a STRICT JSON object with these exact keys:
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

    let totalAttempts = 0;
    const maxTotalAttempts = 5; 

    while (totalAttempts < maxTotalAttempts) {
        try {
            const ai = new GoogleGenAI({ apiKey: keyManager.getCurrentKey() });
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                }
            });

            const jsonString = response.text;
            const parsedData = JSON.parse(jsonString);
            console.log(`✅ Gemini successfully processed data for: ${parsedData.name}`);
            return parsedData;

        } catch (error) {
            const errStr = JSON.stringify(error);
            const isQuota = errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED');
            const isBusy = error.message.includes('503');

            if (isQuota) {
                const hasNewKey = keyManager.rotateKey();
                if (hasNewKey) {
                    totalAttempts++;
                    continue; // Retry immediately with new key
                }
            }

            if (isBusy && totalAttempts < maxTotalAttempts) {
                console.warn(`⚠️ Gemini is busy (503). Retrying in 5 seconds...`);
                await new Promise(r => setTimeout(r, 5000));
                totalAttempts++;
                continue;
            }

            console.error(`❌ Gemini API Error:`, error.message);
            return null;
        }
    }
    return null;
}

module.exports = { processToolData };
