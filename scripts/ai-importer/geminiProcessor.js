const { GoogleGenAI } = require('@google/genai');
const keyManager = require('./keyManager');

/**
 * 🧠 Elite Gemini Processor (V4 - Hybrid Hardened)
 * Restored original prompt while keeping technical stability fixes.
 */
async function processToolData(markdownContent, categories, toolUrl, existingData = null, isPricingOnly = false) {
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
        ${isPricingOnly ? 'CRITICAL: FOCUS ONLY ON PRICING DATA.' : ''}
        `;
    }

    const pricingOnlyPrompt = `
    You are a high-level SaaS Data Architect. 
    TASK: Extract structured pricing metadata for: ${existingData?.name || toolUrl}.
    
    WEBSITE CONTEXT:
    ${markdownContent.substring(0, 18000)}

    STRICT JSON OUTPUT RULES:
    1. "pricing_type": EXACTLY: Free, Freemium, Paid, Premium, Contact.
    2. "pricing_summary": Top 3 plans with prices. (e.g. Hobby: $0 | Pro: $20 | Business: $40).
    3. "pricing_breakdown": MUST use this EXACT format:
       [PlanName - Price] Feature 1 | Feature 2 | [NextPlan - Price] Feature 1 | Feature 2
       
    STRICT RULES:
    - PLAN DENSITY RULE: If the tool has MORE than 5 pricing plans, DO NOT create separate cards for each. Instead, create ONE card named [Multiple Plans Available] with the feature: "This tool offers a complex pricing structure with more than 5 plans. Please visit the official pricing page for a full comparison."
    - If plans count is 5 or less, extract ALL of them following the FIDELITY RULE below.
    - FIDELITY RULE: Use EXACT prices, currency symbols, and units shown on the site. DO NOT convert currencies and DO NOT transform units.
    - MAX 5 features per plan. Pick ONLY the top 5 high-impact features.
    - IGNORE deep comparison tables/matrices. Only extract features shown in the main website cards.
    - USAGE-BASED / API PRICING RULE: If pricing consists of many models with micro-prices (e.g. $0.05 per image) or complex "Pay-as-you-go" rates, DO NOT create cards for each. Instead, create ONE card named [Usage-based Pricing] with the feature: "Please visit the official pricing page for detailed rates per model."
    - Features MUST be separated by the pipe character "|".
    - Do not use newlines, bullets, or asterisks. Only text and pipes.
    - MISSING PRICING RULE: If NO pricing information is found on the page, DO NOT leave fields empty and DO NOT write long explanations. Instead, create ONE card named [Pricing Information] with the feature: "Pricing details are not publicly listed on this page. Please visit the official website for current rates."
    
    OUTPUT FORMAT (JSON):
    {
        "pricing_type": "String",
        "pricing_summary": "String",
        "pricing_breakdown": "String"
    }
    `;

    const fullPrompt = `
    You are an elite, highly critical AI SaaS database curator. Your goal is to extract information in a RICH description but BALANCED features/cases.
    
    WEBSITE URL: ${toolUrl}.
    
    ${contextAddition}

    AVAILABLE CATEGORIES:
    ${categoriesList}

    STRICT FORMATTING RULES (ELITE PRECISION STYLE):
    1. "name": Official brand name.
    2. "short_description": One powerful, technical sentence (Max 15 words).
    3. "description": 3 deep, rich paragraphs (each 4-5 long sentences) using: Overview:, Innovation:, Impact:
    4. "pricing_type": EXACTLY: Free, Freemium, Paid, Premium, Contact.
    5. "pricing_summary": Top 6 plans with prices (e.g. Free: $0 | Pro: $15 | Business: $30).
    6. "pricing_breakdown": MUST use: [PlanName - Price] Feature 1 | Feature 2 | [NextPlan - Price] Feature 1 | Feature 2. (Use pipes, NO newlines).
    - PLAN DENSITY RULE: If the tool has MORE than 5 pricing plans, DO NOT create separate cards for each. Instead, create ONE card named [Multiple Plans Available] with the feature: "This tool offers a complex pricing structure with more than 5 plans. Please visit the official pricing page for a full comparison."
    - If plans count is 5 or less, extract ALL of them following the FIDELITY RULE below.
    - FIDELITY RULE: Use EXACT prices, currency symbols, and units shown on the site. DO NOT convert currencies (e.g. keep € if shown) and DO NOT transform units (e.g. keep monthly credits, do not convert to yearly).
    - MAX 5 features per plan. Pick ONLY the top 5 high-impact features.
    - IGNORE deep comparison tables/matrices. Focus only on features shown in the main cards.
    - MISSING PRICING RULE: If NO pricing information is found on the page, DO NOT leave fields empty and DO NOT write long explanations. Instead, create ONE card named [Pricing Information] with the feature: "Pricing details are not publicly listed on this page. Please visit the official website for current rates."
    7. "features": List 5-6 features as VERY SHORT phrases (Max 4 words each).
    8. "use_cases": List 3 to 5 scenarios as concise phrases (6-10 words each).
    9. "category_action": CRITICAL FIELD. Choose ONE of two values:
       - "USE_EXISTING": If you found a suitable category from the AVAILABLE CATEGORIES list above. Then set "category_id" to that category's exact ID.
       - "CREATE_NEW": If NO existing category fits this tool well. Then set "new_category_name" (e.g. "CRM Tools") and "new_category_slug" (e.g. "crm-tools"). Leave "category_id" empty.

    REQUIRED JSON SCHEMA:
    {
        "name": "String",
        "slug": "String",
        "short_description": "String",
        "description": "String",
        "pricing_type": "String",
        "pricing_summary": "String",
        "pricing_breakdown": "String",
        "use_cases": ["String"],
        "features": ["String"],
        "category_action": "USE_EXISTING or CREATE_NEW",
        "category_id": "UUID from list above (only if USE_EXISTING)",
        "new_category_name": "String (only if CREATE_NEW)",
        "new_category_slug": "String (only if CREATE_NEW)"
    }

    WEBSITE CONTENT:
    ${markdownContent.substring(0, 15000)}
    `;

    const prompt = isPricingOnly ? pricingOnlyPrompt : fullPrompt;

    const models = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.0-flash'];
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
            
            console.log(`✅ [AI ENGINE] Success! Data extracted for: ${parsedData.name || toolUrl} using ${currentModel}`);
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
