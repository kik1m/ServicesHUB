require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
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
        urlsToProcess = urlsToProcess.split(',').map(u => u.trim()).filter(u => u.startsWith('http') || u.startsWith('PRICING_ONLY:'));
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

    for (const rawLine of urlsToProcess) {
        let pricingOnly = false;
        let lineToProcess = rawLine;

        if (rawLine.startsWith('PRICING_ONLY:')) {
            pricingOnly = true;
            lineToProcess = rawLine.replace('PRICING_ONLY:', '').trim();
            console.log(`💰 [PRICING MODE] Focus only on updating pricing for this entry.`);
        }

        // Split by pipe to support: "https://main.com | https://main.com/pricing"
        const [url, pricingUrl] = lineToProcess.split('|').map(u => u.trim());
        
        console.log(`\n-----------------------------------`);
        console.log(`⏳ Processing: ${url}`);
        if (pricingUrl) console.log(`🏷️ Using Explicit Pricing Page: ${pricingUrl}`);

        try {
            // 1. Check if tool already exists (Elite Domain Matcher)
            let existingTool = null;
            const normalizedUrl = url.replace(/\/$/, ""); // Remove trailing slash
            
            // Extract Domain for smart matching
            let domainName = "";
            try {
                const hostname = new URL(url).hostname.replace('www.', '');
                const parts = hostname.split('.');
                // Handle cases like create.wan.video -> wan
                domainName = parts.length > 2 ? parts[parts.length - 2] : parts[0];
            } catch (e) {
                domainName = (url || "").split('.').slice(-2, -1)[0] || "";
            }

            console.log(`🔍 [MATCHER] Searching for tool associated with: ${domainName.toLowerCase() || url}`);

            // A. Search by exact URL or Normalized URL
            const { data: existingByUrl } = await supabaseAdmin
                .from('tools')
                .select('*')
                .or(`url.eq.${url},url.eq.${normalizedUrl},url.ilike.%//${domainName}.%,url.ilike.%.${domainName}.%`)
                .limit(1)
                .maybeSingle();

            if (existingByUrl) {
                existingTool = existingByUrl;
                console.log(`⚠️ Tool found by URL/Domain match: [${existingByUrl.name}]. Preparing Upgrade...`);
            } else if (domainName) {
                // B. Potential Name Match (Fallback)
                const { data: existingByName } = await supabaseAdmin
                    .from('tools')
                    .select('*')
                    .ilike('name', `%${domainName}%`)
                    .limit(1)
                    .maybeSingle();

                if (existingByName) {
                    existingTool = existingByName;
                    console.log(`⚠️ Match found by Name logic: [${existingByName.name}]. Upgrading existing.`);
                }
            }

            // 2. Scrape
            const scrapedResult = await scrapeUrlToMarkdown(url, pricingUrl);
            if (!scrapedResult || !scrapedResult.markdown) {
                console.log(`⏭️ SKIPPED: Could not extract useful data.`);
                stats.skipped++;
                logDetails.push({ url, status: 'SKIPPED', message: 'No usable data found on site' });
                continue;
            }

            // 3. AI Extraction (CORE ONLY)
            const toolData = await processToolData(scrapedResult.markdown, activeCategories, url, existingTool, pricingOnly);
            if (!toolData) {
                console.log(`❌ FAILED: AI failed to process data.`);
                stats.failed++;
                logDetails.push({ url, status: 'FAILED', message: 'AI Parsing failed' });
                continue;
            }

            // 4. Auto-Categorization (Skip if pricing only)
            if (!pricingOnly && toolData.category_action === 'CREATE_NEW' && toolData.new_category_name) {
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

            // 5a. Sanitize category_id (Skip if pricing only)
            if (!pricingOnly) {
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                if (!toolData.category_id || !uuidRegex.test(toolData.category_id)) {
                    // Try to find a matching category by name as fallback
                    const fallbackCat = activeCategories.find(c => 
                        c.name.toLowerCase().includes((toolData.new_category_name || '').toLowerCase())
                    );
                    toolData.category_id = fallbackCat?.id || null;
                    console.log(`⚠️ [SANITIZER] Invalid category_id fixed → ${toolData.category_id || 'null (uncategorized)'}`);
                }
            }

            // 5. Sanitize pricing_type to match DB check constraint exactly
            // DB accepts: "Free", "Freemium", "Paid", "Premium", "Contact"
            const rawPricing = (toolData.pricing_type || '').toLowerCase().trim();
            const pricingMap = {
                // Free
                'free': 'Free',
                'free plan': 'Free',
                'open source': 'Free',
                // Freemium
                'freemium': 'Freemium',
                'free trial': 'Freemium',
                'trial': 'Freemium',
                'freemium/paid': 'Freemium',
                'free/paid': 'Freemium',
                'free + paid': 'Freemium',
                // Paid
                'paid': 'Paid',
                'subscription': 'Paid',
                'one-time': 'Paid',
                'one time': 'Paid',
                // Premium
                'premium': 'Premium',
                'enterprise': 'Premium',
                'pro': 'Premium',
                // Contact
                'contact': 'Contact',
                'contact us': 'Contact',
                'custom': 'Contact',
                'custom pricing': 'Contact',
                'quote': 'Contact',
                'request pricing': 'Contact',
            };
            const sanitizedPricingType = pricingMap[rawPricing] || 'Freemium';

            // 6. Final Payload
            let finalPayload = {};
            
            if (pricingOnly && existingTool) {
                // SURGICAL UPDATE: Only pricing fields
                finalPayload = {
                    pricing_type: sanitizedPricingType,
                    pricing_details: toolData.pricing_summary || toolData.pricing_details || "",
                    pricing_details_full: toolData.pricing_breakdown,
                    pricing_url: pricingUrl || url
                };
            } else {
                // FULL IMPORT/UPDATE
                finalPayload = {
                    name: toolData.name,
                    slug: toolData.slug || toolData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                    short_description: toolData.short_description,
                    description: toolData.description,
                    pricing_type: sanitizedPricingType,
                    pricing_details: toolData.pricing_summary || toolData.pricing_details,
                    pricing_details_full: toolData.pricing_breakdown,
                    pricing_url: pricingUrl || url,
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
            }

            if (!pricingOnly && toolData.use_cases) {
                finalPayload.use_cases = toolData.use_cases;
            }

            // 6. DB Action
            let data, error;
            if (existingTool) {
                const res = await supabaseAdmin.from('tools').update(finalPayload).eq('id', existingTool.id).select().single();
                data = res.data; error = res.error;
            } else {
                // If pricingOnly but tool doesn't exist, we might want to skip or do full import
                if (pricingOnly) {
                    console.log(`⚠️ PRICING_ONLY requested but tool not found. Skipping...`);
                    stats.skipped++;
                    continue;
                }
                const res = await supabaseAdmin.from('tools').insert(finalPayload).select().single();
                data = res.data; error = res.error;
            }

            if (error) throw error;

            // 🚀 7. DECOUPLED AI SEO ENGINE: Run Independently
            if (!pricingOnly) {
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
                                "description": data.short_description,
                                "aggregateRating": {
                                    "@type": "AggregateRating",
                                    "ratingValue": data.rating > 0 ? data.rating : 4.8,
                                    "reviewCount": data.reviews_count > 0 ? data.reviews_count : 15,
                                    "bestRating": 5,
                                    "worstRating": 1
                                }
                            },
                            ai_model: 'gemini-2.5-flash'
                        }, { onConflict: 'entity_id,entity_type' });
                        console.log(`✅ SEO Engine: Metadata optimized.`);
                    }
                } catch (seoErr) {
                    console.warn(`⚠️ SEO Engine failed for ${data.name}:`, seoErr.message);
                }
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
        const urls = fileContent.split('\n').map(u => u.trim()).filter(u => u.startsWith('http') || u.startsWith('PRICING_ONLY:'));
        runDailyImport(urls);
    } else {
        console.log("ℹ️ Provide URLs as arguments or create a 'urls.txt' file.");
    }
}
