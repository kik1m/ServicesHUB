const { supabaseAdmin } = require('../scripts/ai-importer/supabaseClient');

async function analyzeComparisons() {
    console.log('🔍 Analyzing existing AI comparisons in DB...');
    const { data: comparisons, error } = await supabaseAdmin
        .from('tool_comparisons')
        .select('ai_report_json')
        .limit(2);

    if (error) {
        console.error('Error fetching comparisons:', error);
        return;
    }

    comparisons.forEach((comp, idx) => {
        console.log(`\n--- COMPARISON SAMPLE ${idx + 1} ---`);
        const report = comp.ai_report_json;
        console.log(`VERDICT: ${report.verdict?.winner}`);
        console.log(`STRATEGIC OVERVIEW: ${report.strategic_overview?.substring(0, 100)}...`);
        console.log(`MATRIX ROWS: ${report.comparison_matrix?.length}`);
        console.log(`PRICING ANALYSIS: ${report.pricing_analysis?.substring(0, 100)}...`);
    });
}

analyzeComparisons();
