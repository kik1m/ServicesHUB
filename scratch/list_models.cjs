const fs = require('fs');
const path = require('path');

async function listModels() {
    const envPath = path.join(process.cwd(), '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=([^\s\n\r]+)/);
    
    if (!match) {
        console.error('❌ No API Key found in .env');
        return;
    }

    // Get the first key from the comma-separated list
    const firstKey = match[1].split(',')[0].trim();
    console.log(`🔑 Using Key: ${firstKey.substring(0, 10)}...`);

    try {
        console.log('\n--- FETCHING AVAILABLE MODELS ---');
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${firstKey}`);
        const data = await response.json();
        
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`✅ ${m.name.replace('models/', '')}`);
                }
            });
        } else {
            console.log('No models found. Response:', JSON.stringify(data));
        }
        console.log('------------------------------------\n');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

listModels();
