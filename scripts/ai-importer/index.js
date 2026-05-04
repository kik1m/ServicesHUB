require('dotenv').config();
const { supabaseAdmin } = require('./supabaseClient');
const { scrapeUrlToMarkdown } = require('./scraper');
const { processToolData } = require('./geminiProcessor');
const { generateAISeo } = require('./seoGenerator');

/**
 * 👑 Elite Orchestrator (V4 - Decoupled AI SEO Engine)
 */
async function runDailyImport(urlsToProcess = []) {
    console.log("🚀 Starting Elite AI Agent (V4)...");
    
    // Support comma-separated string if passed from GitHub Actions
    if (typeof urlsToProcess === 'string') {
        urlsToProcess = urlsToProcess.split(',').map(u => u.trim()).filter(u => u.startsWith('http'));
    }

    console.log(`📋 Tools in queue: ${urlsToProcess.length}`);

    if (urlsToProcess.length === 0) {
        console.log("ℹ️ No URLs provided. Exiting.");
        return;
    }

    console.log("📂 Initializing Metadata...");
    const [catRes, adminRes] = await Promise.all([
        supabaseAdmin.from('categories').select('id, name'),
        supabaseAdmin.from('profiles').select('id').or('full_name.ilike.Hubly team,role.eq.admin').limit(1).maybeSingle()
    ]);

    if (catRes.error || !catRes.data) {
        console.error("❌ Failed to fetch categories.", catRes.error);
        process.exit(1);
    }

    let activeCategories = [...catRes.data];
    const systemBotId = adminRes.data?.id || process.env.SYSTEM_BOT_ID || '8ded6b0a-6982-495c-8ba8-fda45ac7e082';
    console.log(`👤 Using Publisher ID: ${systemBotId} (${adminRes.data ? 'Hubly Team Found' : 'Using Fallback'})`);

    let stats = { added: 0, updated: 0, skipped: 0, failed: 0 };
    let logDetails = []; // Array to store precise details for the DB

    for (const url of urlsToProcess) {
        console.log(`\n-----------------------------------`);
        console.log(`⏳ Processing: ${url}`);
        
        try {
            // 1. Check if tool already exists (Smart Check)
            let existingTool = null;
            const normalizedUrl = url.replace(/\/$/, ""); // Remove trailing slash
            
            // Check by exact URL or Normalized URL
            const { data: existingByUrl } = await supabaseAdmin
                .from('tools')
                .select('*')
                .or(`url.eq.${url},url.eq.${normalizedUrl}`)
                .maybeSingle();

            if (existingByUrl) {
                existingTool = existingByUrl;
                console.log(`⚠️ Tool exists (URL Match). Preparing Upgrade...`);
            } else {
                // Potential Name Match
                const potentialName = url.split('.').slice(-2, -1)[0]; 
                const { data: existingByName } = await supabaseAdmin
                    .from('tools')
                    .select('*')
                    .ilike('name', `%${potentialName}%`)
                    .maybeSingle();
                
                if (existingByName) {
                    existingTool = existingByName;
                    console.log(`⚠️ Potential match found by Name: [${existingByName.name}]. Upgrading existing.`);
                }
            }

            // 2. Scrape
            const scrapedResult = await scrapeUrlToMarkdown(url);
            if (!scrapedResult || !scrapedResult.markdown) {
                console.log(`⏭️ SKIPPED: Could not extract useful data.`);
                stats.skipped++;
                logDetails.push({ url, status: 'SKIPPED', message: 'No usable data found on site' });
                continue;
            }

            // 3. AI Extraction (CORE ONLY)
            const toolData = await processToolData(scrapedResult.markdown, activeCategories, url, existingTool);
            if (!toolData) {
                console.log(`❌ FAILED: AI failed to process data.`);
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
                user_id: existingTool?.user_id || systemBotId,
                reviews_count: existingTool?.reviews_count || 0,
                rating: existingTool?.rating || 0
            };

            if (toolData.use_cases) {
                finalPayload.use_cases = toolData.use_cases;
            }

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

            // 🚀 7. DECOUPLED AI SEO ENGINE: Run Independently
            try {
                console.log(`✨ Triggering Decoupled SEO Engine for ${data.name}...`);
                const seoData = await generateAISeo({
                    name: data.name,
                    description: data.short_description
                }, 'tool');

                if (seoData) {
                    await supabaseAdmin.from('seo_metadata').upsert({
                        entity_id: data.id,
                        entity_type: 'tool',
                        title: seoData.title,
                        description: seoData.description,
                        keywords: seoData.keywords,
                        search_intent: seoData.search_intent,
                        schema_markup: {
                            "@context": "https://schema.org",
                            "@type": seoData.schema_type || "SoftwareApplication",
                            "name": data.name,
                            "description": data.short_description
                        },
                        ai_model: 'gemini-2.5-flash'
                    }, { onConflict: 'entity_id,entity_type' });
                    console.log(`✅ SEO Engine: Metadata optimized.`);
                }
            } catch (seoErr) {
                console.warn(`⚠️ SEO Engine failed for ${data.name}:`, seoErr.message);
            }

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
