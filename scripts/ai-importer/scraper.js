const axios = require('axios');
const cheerio = require('cheerio');

/**
 * 🚀 Elite Scraper Module (V3)
 * Aggressive Logo/Image extraction + Jina Markdown parsing.
 */
async function scrapeUrlToMarkdown(url) {
    let exactImageUrl = null;
    let markdown = null;

    try {
        console.log(`🔍 Scraping URL: ${url}`);
        
        // 1. AGGRESSIVE IMAGE EXTRACTION & LINK DISCOVERY (Raw HTML)
        let subPagesToScrape = [];
        try {
            const rawRes = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                timeout: 10000
            });
            const $ = cheerio.load(rawRes.data);
            
            exactImageUrl = $('meta[property="og:image"]').attr('content') || 
                            $('meta[name="twitter:image"]').attr('content') || 
                            $('meta[itemprop="image"]').attr('content') || 
                            $('link[rel="apple-touch-icon"]').attr('href') || 
                            $('link[rel="icon"]').attr('href') || 
                            $('link[rel="shortcut icon"]').attr('href') || 
                            $('img').filter((i, el) => $(el).attr('src')?.toLowerCase().includes('logo')).first().attr('src') || 
                            null;

            const urlObj = new URL(url);
            if (exactImageUrl && !exactImageUrl.startsWith('http')) {
                exactImageUrl = new URL(exactImageUrl, urlObj.origin).toString();
            }

            // 🕷️ DEEP SCRAPE: Find Pricing and Features links
            $('a').each((i, el) => {
                const href = $(el).attr('href');
                if (!href) return;
                
                const lowerHref = href.toLowerCase();
                if ((lowerHref.includes('pricing') || lowerHref.includes('features')) && subPagesToScrape.length < 2) {
                    try {
                        const fullUrl = new URL(href, urlObj.origin).toString();
                        if (fullUrl.startsWith(urlObj.origin) && !subPagesToScrape.includes(fullUrl) && fullUrl !== urlObj.toString()) {
                            subPagesToScrape.push(fullUrl);
                        }
                    } catch(e) {}
                }
            });

        } catch (imgErr) {
            console.log(`⚠️ Raw HTML extraction failed: ${imgErr.message}`);
        }

        // 2. TEXT EXTRACTION (Jina API - Sequential to avoid rate limits)
        const urlsToScrape = [url, ...subPagesToScrape];
        let combinedMarkdown = "";
        
        console.log(`🕷️ Deep Scrape mode: Found ${urlsToScrape.length} pages to analyze.`);

        for (const targetUrl of urlsToScrape) {
            try {
                console.log(`  -> Reading: ${targetUrl}`);
                const jinaUrl = `https://r.jina.ai/${targetUrl}`;
                const response = await axios.get(jinaUrl, {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (compatible; ServicesHUB/2.0; +http://hubly.com)'
                    },
                    timeout: 20000
                });

                if (response.data && response.data.data) {
                    combinedMarkdown += `\n\n--- CONTENT FROM: ${targetUrl} ---\n\n` + response.data.data.content;
                    if (!exactImageUrl && targetUrl === url) exactImageUrl = response.data.data.image || null;
                }
                
                // Add a small delay between Jina calls
                await new Promise(res => setTimeout(res, 1000));
            } catch (err) {
                console.log(`  ⚠️ Skipped ${targetUrl}: ${err.message}`);
            }
        }
        
        markdown = combinedMarkdown.substring(0, 25000); // Increased limit to 25k chars for deeper context
        
        if (!markdown || markdown.trim() === '') {
            throw new Error("Extracted markdown is empty.");
        }

        if (!exactImageUrl) {
            console.log(`⚠️ No image found on website! Falling back to Google/Clearbit Logo API...`);
            try {
                const urlObj = new URL(url);
                const domain = urlObj.hostname;
                // Google's hidden high-res favicon API is an incredible fallback for logos!
                exactImageUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
            } catch(e) {}
        }

        console.log(`✅ Scraped ${markdown.length} characters.`);
        if (exactImageUrl) console.log(`🖼️ Extracted Logo/Image: ${exactImageUrl}`);
        
        return { markdown, exactImageUrl };

    } catch (error) {
        console.error(`❌ Scraping Error for ${url}:`, error.message);
        return null;
    }
}

module.exports = { scrapeUrlToMarkdown };
