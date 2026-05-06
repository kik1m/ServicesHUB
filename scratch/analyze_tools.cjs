const { supabaseAdmin } = require('../scripts/ai-importer/supabaseClient');

async function analyzeExistingTools() {
    console.log('🔍 Analyzing existing elite tools in DB...');
    const { data: tools, error } = await supabaseAdmin
        .from('tools')
        .select('name, short_description, description, pricing_details, features')
        .limit(3);

    if (error) {
        console.error('Error fetching tools:', error);
        return;
    }

    tools.forEach(tool => {
        console.log(`\n--- TOOL: ${tool.name} ---`);
        console.log(`SHORT DESC: [${tool.short_description}]`);
        console.log(`PRICING: [${tool.pricing_details}]`);
        console.log(`FEATURES: (Count: ${tool.features?.length})`, tool.features?.slice(0, 3));
        console.log(`DESC PREVIEW: ${tool.description?.substring(0, 100)}...`);
    });
}

analyzeExistingTools();
