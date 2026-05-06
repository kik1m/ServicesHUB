const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

async function testComparisonRotation() {
    const envPath = path.join(process.cwd(), '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=([^\s\n\r]+)/);
    
    if (!match) {
        console.error('❌ No API Keys found in .env');
        return;
    }

    const apiKeys = match[1].split(',').map(k => k.trim());
    console.log(`📡 Found ${apiKeys.length} keys. Testing each one with gemini-2.5-flash...\n`);

    for (let i = 0; i < apiKeys.length; i++) {
        const key = apiKeys[i];
        console.log(`Testing Key ${i + 1} (${key.substring(0, 10)}...):`);
        
        try {
            const genAI = new GoogleGenAI(key);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
            
            // Simple prompt to test
            const result = await model.generateContent("Say 'Key OK'");
            const response = await result.response;
            console.log(`  ✅ Success: ${response.text()}`);
        } catch (error) {
            console.log(`  ❌ Failed: ${error.message}`);
        }
        console.log('---');
    }
}

testComparisonRotation();
