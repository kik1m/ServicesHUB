import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

async function deepDiagnostic() {
    const envPath = path.join(process.cwd(), '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=([^\s\n\r]+)/);
    
    if (!match) {
        console.error('❌ No API Keys found in .env');
        return;
    }

    const apiKeys = match[1].split(',').map(k => k.trim());
    console.log(`📡 Testing ${apiKeys.length} keys with dual-model fallback...\n`);

    const modelsToTest = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];

    for (let i = 0; i < apiKeys.length; i++) {
        const key = apiKeys[i];
        console.log(`--- 🔑 Key ${i + 1} (${key.substring(0, 10)}...) ---`);
        
        for (const modelName of modelsToTest) {
            try {
                const ai = new GoogleGenAI({ apiKey: key });
                const result = await ai.models.generateContent({
                    model: modelName,
                    contents: "Respond with only 'READY'"
                });
                
                let text = "";
                try {
                    text = typeof result.text === 'function' ? result.text() : (result.text || "No response text");
                } catch (e) { text = "API Accepted Request"; }
                
                console.log(`  ✅ ${modelName}: ${text.trim()}`);
            } catch (error) {
                const isQuota = error.message?.includes('429') || JSON.stringify(error).includes('429');
                console.log(`  ❌ ${modelName}: ${isQuota ? 'QUOTA EXHAUSTED (429)' : error.message.substring(0, 100)}`);
            }
        }
    }
}

deepDiagnostic();
