require('dotenv').config();
const { supabaseAdmin } = require('./supabaseClient');
const { scrapeUrlToMarkdown } = require('./scraper');
const { processToolData } = require('./geminiProcessor');

/**
 * 👑 Elite Orchestrator (V3 - Manual/API Trigger)
 */
async function runDailyImport(urlsToProcess = []) {
    console.log("🚀 Starting Elite AI Agent (V3)...");
    
    // Support comma-separated string if passed from GitHub Actions
    if (typeof urlsToProcess === 'string') {
        urlsToProcess = urlsToProcess.split(',').map(u => u.trim()).filter(u => u.startsWith('http'));
    }

    console.log(`📋 Tools in queue: ${urlsToProcess.length}`);

    if (urlsToProcess.length === 0) {
        console.log("ℹ️ No URLs provided. Exiting.");
        return;
    }

    console.log("📂 Fetching existing categories...");
    const { data: categories, error: catError } = await supabaseAdmin.from('categories').select('id, name');
    
    if (catError || !categories) {
        console.error("❌ Failed to fetch categories.", catError);
        process.exit(1);
    }
    
    let activeCategories = [...categories];
    const systemBotId = process.env.SYSTEM_BOT_ID || '8ded6b0a-6982-495c-8ba8-fda45ac7e082'; // Hubly Team Default ID

    let stats = { added: 0, updated: 0, skipped: 0, failed: 0 };
    let logDetails = []; // Array to store precise details for the DB

    for (const url of urlsToProcess) {
        console.log(`\n-----------------------------------`);
        console.log(`⏳ Processing: ${url}`);
        
        try {
            // 1. Check if tool already exists
            let existingTool = null;
            const { data: existingData } = await supabaseAdmin.from('tools').select('*').eq('url', url).maybeSingle();
            
            if (existingData) {
                console.log(`⚠️ Tool exists. Preparing SEO Upgrade...`);
                existingTool = existingData;
            }

            // 2. Scrape
            const scrapedResult = await scrapeUrlToMarkdown(url);
            if (!scrapedResult || !scrapedResult.markdown) {
                console.log(`⏭️ SKIPPED: Could not extract useful data.`);
                stats.skipped++;
                logDetails.push({ url, status: 'SKIPPED', message: 'No usable data found on site' });
                continue;
            }

            // 3. AI Extraction
            const toolData = await processToolData(scrapedResult.markdown, activeCategories, url, existingTool);
            if (!toolData) {
                console.log(`❌ FAILED: Gemini failed to process data.`);
                stats.failed++;
                logDetails.push({ url, status: 'FAILED', message: 'AI Parsing failed' });
                continue;
            }

            // 4. Auto-Categorization
            if (toolData.category_action === 'CREATE_NEW' && toolData.new_category_name) {
                console.log(`✨ AI requested a NEW Category: [${toolData.new_category_name}]`);
                const { data: newCat, error: newCatErr } = await supabaseAdmin
                    .from('categories')
                    .insert({ name: toolData.new_category_name, slug: toolData.new_category_slug || toolData.new_category_name.toLowerCase().replace(/ /g, '-') })
                    .select()
                    .single();
                
                if (newCat && !newCatErr) {
                    toolData.category_id = newCat.id;
                    activeCategories.push(newCat);
                }
            }

            // 5. Final Payload
            const finalPayload = {
                name: toolData.name,
                slug: toolData.slug,
                short_description: toolData.short_description,
                description: toolData.description,
                pricing_type: toolData.pricing_type,
                pricing_details: toolData.pricing_details,
                features: toolData.features,
                category_id: toolData.category_id,
                url: url,
                image_url: scrapedResult.exactImageUrl || toolData.image_url || existingTool?.image_url,
                is_approved: true,
                is_verified: true,
                creator_id: systemBotId || existingTool?.creator_id,
                reviews_count: existingTool?.reviews_count || 0,
                rating: existingTool?.rating || 0
            };

            // 6. DB Action
            let data, error;
            if (existingTool) {
                const res = await supabaseAdmin.from('tools').update(finalPayload).eq('id', existingTool.id).select().single();
                data = res.data; error = res.error;
            } else {
                const res = await supabaseAdmin.from('tools').insert(finalPayload).select().single();
                data = res.data; error = res.error;
            }

            if (error) throw error;

            if (existingTool) {
                console.log(`🎉 SUCCESS: ${data.name} Upgraded!`);
                stats.updated++;
                logDetails.push({ url, name: data.name, status: 'UPDATED' });
            } else {
                console.log(`🎉 SUCCESS: ${data.name} Live!`);
                stats.added++;
                logDetails.push({ url, name: data.name, status: 'ADDED' });
            }

        } catch (globalErr) {
            // Global protective try/catch to ensure loop continues
            console.error(`❌ CRITICAL ERROR for ${url}:`, globalErr.message);
            stats.failed++;
            logDetails.push({ url, status: 'FAILED', message: globalErr.message });
        }

        // Delay to prevent rate limits
        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // 7. Save Log to Database
    console.log(`\n💾 Saving Run Log to Database...`);
    const logPayload = {
        total_processed: urlsToProcess.length,
        added_count: stats.added,
        updated_count: stats.updated,
        skipped_count: stats.skipped,
        failed_count: stats.failed,
        details: logDetails
    };
    
    const { error: logError } = await supabaseAdmin.from('ai_agent_logs').insert([logPayload]);
    if (logError) console.error("⚠️ Failed to save log to DB. (Is the table created?):", logError.message);

    // FINAL REPORT
    console.log(`\n===================================`);
    console.log(`📊 ELITE AGENT RUN REPORT`);
    console.log(`===================================`);
    console.log(`🆕 Added:   ${stats.added}`);
    console.log(`📈 Updated: ${stats.updated}`);
    console.log(`⏭️ Skipped: ${stats.skipped}`);
    console.log(`❌ Failed:  ${stats.failed}`);
    console.log(`===================================`);
}

const args = process.argv.slice(2);
if (args.length > 0) {
    // If running via CLI arguments (e.g., node index.js "url1,url2")
    runDailyImport(args[0]);
} else {
    // Local fallback: read from urls.txt
    const fs = require('fs');
    const path = require('path');
    const urlsFile = path.join(__dirname, 'urls.txt');
    
    if (fs.existsSync(urlsFile)) {
        const fileContent = fs.readFileSync(urlsFile, 'utf8');
        const urls = fileContent.split('\n').map(u => u.trim()).filter(u => u.startsWith('http'));
        runDailyImport(urls);
    } else {
        console.log("ℹ️ Provide URLs as arguments or create a 'urls.txt' file.");
    }
}
