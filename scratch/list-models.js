import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

async function listModels() {
    try {
        console.log("🔍 Checking available models for your API Key...");
        const models = await ai.models.list();
        console.log(JSON.stringify(models, null, 2));
    } catch (err) {
        console.error("❌ Error listing models:", err.message);
    }
}

listModels();
