import { supabaseAdmin } from '../../../../../lib/supabaseAdmin';
import databaseDictionary from '../../../../../data/database_dictionary.json';

export async function executeToolCall(fnName, fnArgs, verifiedUserId, userRole) {
    let fnResult = { error: "Function not found" };

    if (fnName === 'search_articles') {
        const queryStr = fnArgs.query ? fnArgs.query.toLowerCase() : '';
        let q = supabaseAdmin.from('blog_posts').select('title, content, slug');

        const genericWords = ['articles', 'blogs', 'hubly', 'listed', 'in', 'about', 'any'];
        const keywords = queryStr.split(' ').filter(w => w.length > 2 && !genericWords.includes(w));

        if (keywords.length > 0) {
            const orConditions = keywords.map(kw => `title.ilike.%${kw}%,content.ilike.%${kw}%`).join(',');
            q = q.or(orConditions);
        }

        const { data } = await q.order('created_at', { ascending: false }).limit(3);
        fnResult = { results: data ? data.map(d => ({ ...d, content: d.content?.substring(0, 500) + '...' })) : [] };
    } else if (fnName === 'lookup_user') {
        if (!verifiedUserId && !userRole) {
            fnResult = { error: 'Authentication required for user lookup.' };
        } else {
            const { data } = await supabaseAdmin.from('profiles').select('id, full_name, bio').ilike('full_name', `%${fnArgs.name}%`).limit(1);
            if (data && data.length > 0) {
                const { data: userTools } = await supabaseAdmin.from('tools').select('name, slug').or(`creator_id.eq.${data[0].id},user_id.eq.${data[0].id}`);
                fnResult = { profile: data[0], published_tools: userTools || [] };
            } else {
                fnResult = { error: 'User not found' };
            }
        }
    } else if (fnName === 'search_comparisons') {
        const { data } = await supabaseAdmin.from('tool_comparisons').select('tool1:tools!tool1_id(name), tool2:tools!tool2_id(name)').limit(2);
        fnResult = { comparisons: data || [] };
    } else if (fnName === 'search_hubly_docs') {
        try {
            const fs = require('fs');
            const path = require('path');
            const docsPath = path.join(process.cwd(), 'src', 'data', 'docs_knowledge.json');
            if (fs.existsSync(docsPath)) {
                const docsData = JSON.parse(await fs.promises.readFile(docsPath, 'utf8'));
                const query = fnArgs.query.toLowerCase().trim();
                const matchedDocs = [];
                const availableSections = Object.values(docsData).map(d => d.title).join(' | ');

                const isIndexRequest = ['all', 'list', 'sections', 'index', 'فهرس', 'كل', 'اقسام', 'الكل'].includes(query);

                if (isIndexRequest) {
                    fnResult = { docs: [{ section: 'INDEX', content: `Available doc sections: ${availableSections}` }] };
                } else {
                    const keywords = query.split(/\s+/).filter(k => k.length > 2);
                    for (const [sectionSlug, sectionObj] of Object.entries(docsData)) {
                        const title = sectionObj.title || sectionSlug;
                        const textContent = sectionObj.content || '';

                        const slugLower = sectionSlug.toLowerCase();
                        const titleLower = title.toLowerCase();
                        const contentLower = textContent.toLowerCase();

                        let match = slugLower.includes(query) || titleLower.includes(query) || contentLower.includes(query);
                        if (!match && keywords.length > 0) {
                            match = keywords.some(kw => slugLower.includes(kw) || titleLower.includes(kw) || contentLower.includes(kw));
                        }

                        if (match) {
                            matchedDocs.push({ section: title, content: textContent.substring(0, 1500) + '...' });
                        }
                    }

                    if (matchedDocs.length > 0) {
                        fnResult = {
                            docs: matchedDocs.slice(0, 3),
                            _meta: `Other available sections you can search for: ${availableSections}`
                        };
                    } else {
                        fnResult = { error: `No docs found for "${query}". Try searching with a specific keyword. Available sections are: ${availableSections}` };
                    }
                }
            } else {
                fnResult = { error: 'docs_knowledge.json not found on server.' };
            }
        } catch (e) {
            fnResult = { error: 'Failed to read docs_knowledge.' };
        }
    } else if (fnName === 'get_tool_reviews') {
        const { data: toolRow } = await supabaseAdmin.from('tools').select('id').eq('slug', fnArgs.slug).single();
        if (toolRow) {
            const { data } = await supabaseAdmin.from('tool_reviews').select('rating, review_text, profiles(full_name)').eq('tool_id', toolRow.id).limit(3);
            fnResult = { reviews: data || [] };
        } else {
            fnResult = { error: 'Tool not found by slug.' };
        }
    } else if (fnName === 'get_tool_details') {
        const { data, error } = await supabaseAdmin.from('tools').select('*').ilike('slug', `%${fnArgs.slug}%`).single();
        if (error || !data) {
            fnResult = { error: 'Tool not found' };
        } else {
            const { data: pricingData } = await supabaseAdmin.from('tool_pricing').select('*').eq('tool_id', data.id);
            const { data: featureData } = await supabaseAdmin.from('tool_features').select('*').eq('tool_id', data.id);
            data.pricing = pricingData;
            data.features = featureData;
            fnResult = { tool: data };
        }
    } else if (fnName === 'compare_tools_detailed') {
        // Implementation for the new structured tool comparison
        const { data: tool1, error: err1 } = await supabaseAdmin.from('tools').select('id, name, slug, description, pricing_type').ilike('slug', `%${fnArgs.slug1}%`).single();
        const { data: tool2, error: err2 } = await supabaseAdmin.from('tools').select('id, name, slug, description, pricing_type').ilike('slug', `%${fnArgs.slug2}%`).single();
        
        if (tool1 && tool2) {
            const { data: features1 } = await supabaseAdmin.from('tool_features').select('name, is_pro').eq('tool_id', tool1.id);
            const { data: features2 } = await supabaseAdmin.from('tool_features').select('name, is_pro').eq('tool_id', tool2.id);
            
            fnResult = {
                comparison: {
                    tool1: { ...tool1, features: features1 || [] },
                    tool2: { ...tool2, features: features2 || [] }
                }
            };
        } else {
            fnResult = { error: `Could not find one or both tools. Error1: ${err1?.message}, Error2: ${err2?.message}` };
        }
    } else if (fnName === 'save_memory') {
        if (!verifiedUserId) {
            fnResult = { error: 'Authentication required to save memory' };
        } else {
            try {
                const { data: profileRow } = await supabaseAdmin.from('profiles').select('long_term_memory, id').eq('id', verifiedUserId).single();
                if (profileRow) {
                    let currentMemory = typeof profileRow.long_term_memory === 'string'
                        ? JSON.parse(profileRow.long_term_memory || '{}')
                        : (profileRow.long_term_memory || {});

                    currentMemory[fnArgs.key] = fnArgs.value;
                    await supabaseAdmin.from('profiles').update({ long_term_memory: currentMemory }).eq('id', profileRow.id);
                    fnResult = { success: true, message: `Memory saved: ${fnArgs.key}` };
                } else {
                    fnResult = { error: 'Profile not found' };
                }
            } catch (e) {
                fnResult = { error: 'Failed to parse or save memory' };
            }
        }
    } else if (fnName === 'delete_memory') {
        if (!verifiedUserId) {
            fnResult = { error: 'Authentication required to delete memory' };
        } else {
            try {
                const { data: profileRow } = await supabaseAdmin.from('profiles').select('long_term_memory, id').eq('id', verifiedUserId).single();
                if (profileRow) {
                    let currentMemory = typeof profileRow.long_term_memory === 'string'
                        ? JSON.parse(profileRow.long_term_memory || '{}')
                        : (profileRow.long_term_memory || {});

                    if (currentMemory[fnArgs.key]) {
                        delete currentMemory[fnArgs.key];
                        await supabaseAdmin.from('profiles').update({ long_term_memory: currentMemory }).eq('id', profileRow.id);
                        fnResult = { success: true, message: `Memory deleted: ${fnArgs.key}` };
                    } else {
                        fnResult = { error: 'Key not found in memory' };
                    }
                } else {
                    fnResult = { error: 'Profile not found' };
                }
            } catch (e) {
                fnResult = { error: 'Failed to parse or delete memory' };
            }
        }
    } else if (fnName === 'create_user_project') {
        if (!verifiedUserId) {
            fnResult = { error: 'Authentication required' };
        } else {
            try {
                const { data, error } = await supabaseAdmin.from('user_projects').insert([{
                    user_id: verifiedUserId,
                    name: fnArgs.name,
                    tech_stack: fnArgs.tech_stack || null,
                    budget: fnArgs.budget || null,
                    skill_level: fnArgs.skill_level || null
                }]).select();
                if (error) fnResult = { error: error.message };
                else fnResult = { success: true, project: data[0] };
            } catch (e) {
                fnResult = { error: e.message };
            }
        }
    } else if (fnName === 'get_user_projects') {
        if (!verifiedUserId) {
            fnResult = { error: 'Authentication required' };
        } else {
            const { data, error } = await supabaseAdmin.from('user_projects').select('*').eq('user_id', verifiedUserId);
            fnResult = { projects: data || [], error: error?.message };
        }
    } else if (fnName === 'execute_database_query' && userRole === 'admin') {
        try {
            const rawQuery = (fnArgs.query || '').trim();
            // ── Security Gate: read-only statements only ─────────────────
            const firstToken = rawQuery.replace(/\/\*.*?\*\//gs, '').trim().split(/\s+/)[0].toUpperCase();
            const ALLOWED_STATEMENTS = ['SELECT', 'WITH', 'EXPLAIN'];
            if (!ALLOWED_STATEMENTS.includes(firstToken)) {
                fnResult = { error: `Security Error: Only SELECT, WITH, and EXPLAIN queries are permitted. Received: ${firstToken}` };
            } else {
                // ── Sanitize: remove trailing semicolon ───────────────────
                let cleanQuery = rawQuery.replace(/;\s*$/, '');

                // ── Auto-fix: add AS alias to ALL bare aggregate functions ─
                // Covers COUNT, SUM, AVG, MIN, MAX, COUNT(DISTINCT ...) etc.
                cleanQuery = cleanQuery.replace(
                    /\b(COUNT|SUM|AVG|MIN|MAX)\s*\(([^)]*)\)(?!\s+AS\b)/gi,
                    (match, fn, args) => {
                        const alias = fn.toLowerCase() + '_' + args.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') + '_val';
                        return `${match} AS ${alias}`;
                    }
                );

                // ── Add a safety LIMIT if none exists (max 500 rows) ─────
                const hasLimit = /\bLIMIT\b/i.test(cleanQuery);
                const isCounting = /\bCOUNT\s*\(/i.test(cleanQuery);
                if (!hasLimit && !isCounting) {
                    cleanQuery = `${cleanQuery} LIMIT 500`;
                }

                const { data, error } = await supabaseAdmin.rpc('exec_sql', { query: cleanQuery });
                if (error) {
                    fnResult = { 
                        error: error.message,
                        hint: 'Check table/column names using get_database_schema first. Verify query syntax.'
                    };
                } else {
                    const rowCount = Array.isArray(data) ? data.length : 0;
                    fnResult = { 
                        success: true, 
                        row_count: rowCount,
                        note: rowCount === 500 ? 'Result was capped at 500 rows. Use WHERE/LIMIT for a more targeted query.' : null,
                        results: data 
                    };
                }
            }
        } catch (e) {
            fnResult = { error: e.message };
        }

    } else if (fnName === 'get_database_schema' && userRole === 'admin') {
        try {
            const query = `
                SELECT table_name, column_name, data_type 
                FROM information_schema.columns 
                WHERE table_schema = 'public'
                ORDER BY table_name, ordinal_position
            `;
            const { data, error } = await supabaseAdmin.rpc('exec_sql', { query });
            if (error) fnResult = { error: error.message };
            else fnResult = { schema: data };
        } catch (e) {
            fnResult = { error: e.message };
        }
    } else if (fnName === 'get_all_tools' && userRole === 'admin') {
        try {
            const { data, error } = await supabaseAdmin
                .from('tools')
                .select('id, name, slug, description, category_id');
            
            if (error) {
                fnResult = { error: error.message };
            } else {
                fnResult = { success: true, total_count: data?.length || 0, tools: data || [] };
            }
        } catch (e) {
            fnResult = { error: e.message };
        }
    } else if (fnName === 'get_database_dictionary' && userRole === 'admin') {
        try {
            fnResult = { dictionary: databaseDictionary };
        } catch (e) {
            fnResult = { error: 'Failed to read database dictionary: ' + e.message };
        }
    } else if (fnName === 'list_all_projects' && userRole === 'admin') {
        const { data, error } = await supabaseAdmin.from('projects').select('id, name, created_at, owner_id');
        fnResult = { projects: data || [], error: error?.message };
    } else if (fnName === 'analyze_platform_trends' && userRole === 'admin') {
        const { data } = await supabaseAdmin.from('tools').select('name, slug, review_count, rating').order('review_count', { ascending: false }).limit(5);
        fnResult = { trending_tools: data || [] };
    } else if (fnName === 'get_operational_status' && userRole === 'admin') {
        const { count: usersCount } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true });
        const { count: toolsCount } = await supabaseAdmin.from('tools').select('*', { count: 'exact', head: true });
        fnResult = {
            total_users: usersCount || 0,
            total_tools: toolsCount || 0,
            server_status: 'Online'
        };
    } else if (fnName === 'get_platform_schema') {
        try {
            const fs = require('fs');
            const path = require('path');
            const schemaPath = path.join(process.cwd(), 'src', 'data', 'platform_manifest.json');
            if (fs.existsSync(schemaPath)) {
                const manifestData = JSON.parse(await fs.promises.readFile(schemaPath, 'utf8'));
                if (fnArgs.page_id) {
                    const page = manifestData.find(p => p.page_id === fnArgs.page_id);
                    fnResult = page ? { page_schema: page } : { error: 'Page not found.' };
                } else {
                    fnResult = { available_pages: manifestData.map(p => ({ page_id: p.page_id, title: p.title })) };
                }
            } else {
                fnResult = { error: 'Platform manifest not found.' };
            }
        } catch (e) {
            fnResult = { error: 'Failed to read platform schema.' };
        }
    } else if (fnName === 'search_external_market') {
        const tavilyApiKey = process.env.TAVILY_API_KEY;
        if (!tavilyApiKey) {
            fnResult = { error: 'TAVILY_API_KEY is not configured.' };
        } else {
            const searchQuery = fnArgs.query + (fnArgs.market_type === 'ai_tools' ? ' AI tool' : '');
            try {
                const response = await fetch('https://api.tavily.com/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ api_key: tavilyApiKey, query: searchQuery, search_depth: 'basic', max_results: 3 })
                });
                const json = await response.json();
                fnResult = { results: json.results || [], error: json.error };
            } catch (e) {
                fnResult = { error: 'Failed to search external market' };
            }
        }
    } else if (fnName === 'get_market_trends') {
        const tavilyApiKey = process.env.TAVILY_API_KEY;
        if (!tavilyApiKey) {
            fnResult = { error: 'TAVILY_API_KEY is not configured.' };
        } else {
            const searchQuery = `Latest trends in ${fnArgs.industry} for ${fnArgs.topic}`;
            try {
                const response = await fetch('https://api.tavily.com/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ api_key: tavilyApiKey, query: searchQuery, search_depth: 'advanced', include_answer: true, max_results: 2 })
                });
                const json = await response.json();
                fnResult = { market_data: json.results || [], query_used: searchQuery };
            } catch (e) {
                fnResult = { error: 'Failed to fetch market trends' };
            }
        }
    } else if (fnName === 'get_granular_analytics' && userRole === 'admin') {
        fnResult = { error: "Not implemented. Requires Mixpanel/Posthog." };
    } else if (fnName === 'search_internal_strategy' && userRole === 'admin') {
        const { data } = await supabaseAdmin.from('internal_knowledge').select('title, content').ilike('title', `%${fnArgs.query}%`).limit(3);
        fnResult = { documents: data || [] };
    }

    return fnResult;
}
