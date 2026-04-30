require('dotenv').config();
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
    
    CRITICAL INSTRUCTION: The scraped content might be incomplete. YOU MUST use your vast internal knowledge base about this tool to fill in any missing gaps (especially pricing, true features, or specific use-cases). Do not rely solely on the provided text if you know more about this tool!
    
    ${contextAddition}

    AVAILABLE CATEGORIES:
    ${categoriesList}

    CATEGORY INSTRUCTIONS:
    If one of the available categories fits perfectly, set "category_action" to "USE_EXISTING" and provide its "category_id".
    If this tool represents a completely new niche and NONE of the categories fit, set "category_action" to "CREATE_NEW", and provide a "new_category_name" and "new_category_slug".

    REQUIRED JSON SCHEMA:
    Return a STRICT JSON object with these exact keys:
    {
        "name": "String (Exact tool name, capitalized correctly)",
        "slug": "String (URL-friendly version of the name, lowercase, hyphens)",
        "short_description": "String (Max 120 characters, highly descriptive pitch)",
        "description": "String (A 2-3 paragraph detailed SEO-optimized explanation of features and use-cases)",
        "pricing_type": "String (MUST be exactly one of: 'Free', 'Freemium', 'Paid', 'Contact for Pricing'. PRICING DEDUCTION LOGIC: If no exact price is seen, look for buttons like 'Book Demo', 'Waitlist', 'Request Access', or 'Talk to Sales' and output 'Contact for Pricing'. Default to 'Paid' only if you are absolutely unsure.)",
        "pricing_details": "String (Short sentence explaining the price, e.g., 'Starts at $10/month'. If it's a waitlist or demo, write 'Contact for early access' or 'Book demo for pricing'.)",
        "features": ["String", "String", "String"], // An array of 3 to 6 key features
        "category_action": "String ('USE_EXISTING' or 'CREATE_NEW')",
        "category_id": "String (UUID if USE_EXISTING, else null)",
        "new_category_name": "String (Name of new category if CREATE_NEW, else null)",
        "new_category_slug": "String (Slug of new category if CREATE_NEW, else null)"
    }
    
    RULES:
    1. Output ONLY the raw JSON object. Do NOT wrap it in markdown.
    2. Do not hallucinate. Be extremely objective.

    WEBSITE CONTENT:
    ${markdownContent.substring(0, 15000)}
    `;

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
        console.error(`❌ Gemini API Error:`, error.message);
        return null;
    }
}

module.exports = { processToolData };
