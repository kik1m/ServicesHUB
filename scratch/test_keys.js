import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

async function testComparisonRotation() {
    const envPath = path.join(process.cwd(), '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=([^\s\n\r]+)/);
    
    if (!match) {
        console.error('❌ No API Keys found in .env');
        return;
    }

    const apiKeys = match[1].split(',').map(k => k.trim());
    console.log(`📡 Testing ${apiKeys.length} keys...\n`);

    for (let i = 0; i < apiKeys.length; i++) {
        const key = apiKeys[i];
        console.log(`Key ${i + 1} (${key.substring(0, 10)}...):`);
        
        try {
            const ai = new GoogleGenAI({ apiKey: key });
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: "Say 'OK'"
            });
            
            let text = "";
            try {
                text = typeof result.text === 'function' ? result.text() : (result.text || "No text");
            } catch (e) {
                text = "Success (Text extraction varies)";
            }
            console.log(`  ✅ ${text}`);
        } catch (error) {
            console.log(`  ❌ Failed: ${error.message}`);
        }
        console.log('---');
    }
}

testComparisonRotation();
