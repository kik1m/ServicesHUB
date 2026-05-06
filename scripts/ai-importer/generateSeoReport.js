require('dotenv').config();
const { supabaseAdmin } = require('./supabaseClient');
const fs = require('fs');
const path = require('path');

/**
 * 👑 ELITE SEO AUDIT REPORT GENERATOR
 * Generates a clean markdown report of all current SEO metadata.
 */
async function generateSeoReport() {
    console.log('📊 Generating Elite SEO Audit Report...');

    // 1. Fetch Tools & SEO
    const { data: tools, error: toolsErr } = await supabaseAdmin
        .from('tools')
        .select('id, name, slug, is_approved');

    if (toolsErr) {
        console.error('❌ Failed to fetch tools:', toolsErr.message);
        return;
    }

    const { data: seoData, error: seoErr } = await supabaseAdmin
        .from('seo_metadata')
        .select('entity_id, title, description, ai_model')
        .eq('entity_type', 'tool');

    if (seoErr) {
        console.error('❌ Failed to fetch SEO metadata:', seoErr.message);
        return;
    }

    const seoMap = new Map(seoData.map(s => [s.entity_id, s]));

    // 2. Build Report Content
    let report = `# 👑 ServicesHUB Elite SEO Audit Report\n`;
    report += `Generated on: ${new Date().toLocaleString()}\n\n`;
    report += `| Tool Name | Status | AI Model | SEO Title | Description (Length) |\n`;
    report += `| :--- | :--- | :--- | :--- | :--- |\n`;

    tools.forEach(tool => {
        const seo = seoMap.get(tool.id);
        const title = seo?.title || '❌ MISSING (Fallback Used)';
        const desc = seo?.description || '❌ MISSING';
        const model = seo?.ai_model || 'N/A';
        const status = tool.is_approved ? '✅ Approved' : '⏳ Pending';

        report += `| **${tool.name}** | ${status} | \`${model}\` | ${title} | ${desc.length} chars |\n`;
    });

    // 3. Save Report
    const reportPath = path.join(__dirname, '../../PLATFORM_SEO_REPORT.md');
    fs.writeFileSync(reportPath, report);

    console.log(`\n🎉 Report generated successfully!`);
    console.log(`📁 Location: ${reportPath}`);
    console.log(`\nNext Steps:`);
    console.log(`1. Open PLATFORM_SEO_REPORT.md to verify titles.`);
    console.log(`2. Go to Google Search Console.`);
    console.log(`3. Submit sitemap.xml.`);
}

generateSeoReport();
