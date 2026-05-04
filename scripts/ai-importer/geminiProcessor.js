ياrequire('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ CRITICAL ERROR: GEMINI_API_KEY is missing in .env");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: apiKey });

/**
 * 🧠 Elite Gemini Processor (V2)
 * Handles SEO Upgrades for existing tools and Auto-Categorization.
 */
async function processToolData(markdownContent, categories, toolUrl, existingData = null) {
    console.log(`🤖 Sending data to Gemini 2.5 Flash for processing...`);

    const categoriesList = categories.map(c => `ID: ${c.id} | Name: ${c.name}`).join('\n');

    let contextAddition = "";
    if (existingData) {
        contextAddition = `
        UPDATE MODE ACTIVATED:
        This tool already exists in our database. Here is its current data:
        Name: ${existingData.name || 'N/A'}
        Description: ${existingData.description || 'N/A'}
        YOUR GOAL: Upgrade this data! Make the description highly SEO-optimized, fix any outdated info based on the new markdown, but keep the core identity intact.
        `;
    }

    const prompt = `
    You are an elite, highly critical AI SaaS database curator and SEO expert.
    I will provide you with the markdown content scraped from an AI tool's website: ${toolUrl}.
    
    CRITICAL INSTRUCTION: The scraped content might be incomplete or promotional fluff. YOU MUST use your vast internal knowledge base and perform "mental research" to fill in every single field correctly. 
    - MISSING DATA IS UNACCEPTABLE. If a field isn't in the text but you know the answer (e.g., pricing, features), you MUST provide it.
    - SEO SUPREMACY: Descriptions must be rich with keywords, professional, and persuasive.
    - DATA DISTRIBUTION: Do not repeat the same facts across different fields. Use the 'description' to tell a story, 'features' to list technical capabilities, and 'pricing_details' for financial clarity.
    - PRICING PRECISION: Be extremely accurate with pricing_type and pricing_details. Summarize complex plans into a single, clean line.
    - VERIFICATION PROTOCOL: Before returning JSON, perform a "Self-Correction" pass. Ensure the name, pricing, and features perfectly match the website's current reality. ZERO TOLERANCE for hallucination or placeholder data.
    
    ${contextAddition}

    AVAILABLE CATEGORIES:
    ${categoriesList}

    CATEGORY INSTRUCTIONS:
    - You MUST assign the tool to the most relevant category.
    - If one of the available categories fits, set "category_action" to "USE_EXISTING".
    - If and ONLY if the tool is in a completely new niche not covered by the list, use "CREATE_NEW".

    REQUIRED JSON SCHEMA:
    Return a STRICT JSON object with these exact keys. DO NOT LEAVE ANY NULL:
    {
        "name": "String (PURE BRAND NAME ONLY)",
        "slug": "String (URL-friendly)",
        "short_description": "String (Max 120 chars)",
        "description": "String (3 sections: Overview, Innovation, Impact)",
        "pricing_type": "String",
        "pricing_details": "String (Max 8 words)",
        "use_cases": ["String", "String", "String"],
        "features": ["String", "String", "String", "String", "String"],
        "category_action": "String",
        "category_id": "String",
        "new_category_name": "String",
        "new_category_slug": "String"
    }
    
    FINAL RULE: Your output will be used in a premium production platform. Quality, accuracy, and completeness are your only metrics for success.

    WEBSITE CONTENT:
    ${markdownContent.substring(0, 15000)}
    `;

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                }
            });

            const jsonString = response.text;

            try {
                const parsedData = JSON.parse(jsonString);
                console.log(`✅ Gemini successfully processed data for: ${parsedData.name}`);
                return parsedData;
            } catch (parseError) {
                console.error(`❌ Gemini returned malformed JSON:`, jsonString);
                return null;
            }

        } catch (error) {
            attempts++;
            if (error.message.includes('503') && attempts < maxAttempts) {
                console.warn(`⚠️ Gemini is busy (503). Retrying in 5 seconds... (Attempt ${attempts}/${maxAttempts})`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            } else {
                console.error(`❌ Gemini API Error:`, error.message);
                return null;
            }
        }
    }
}

module.exports = { processToolData };
