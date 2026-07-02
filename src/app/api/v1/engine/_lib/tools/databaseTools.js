import { supabaseAdmin } from '../../../../../../lib/supabaseAdmin';

export async function search_articles(fnArgs) {
    const queryStr = fnArgs.query ? fnArgs.query.toLowerCase() : '';
    let q = supabaseAdmin.from('blog_posts').select('title, content, slug');

    const genericWords = ['articles', 'blogs', 'hubly', 'listed', 'in', 'about', 'any'];
    const keywords = queryStr.split(' ').filter(w => w.length > 2 && !genericWords.includes(w));

    if (keywords.length > 0) {
        const tsQuery = keywords.join(' | ');
        q = q.textSearch('content', tsQuery);
    }

    const { data } = await q.order('created_at', { ascending: false }).limit(3);
    return { results: data ? data.map(d => ({ ...d, content: d.content?.substring(0, 500) + '...' })) : [] };
}

export async function lookup_user(fnArgs, verifiedUserId, userRole) {
    if (!verifiedUserId) {
        return { error: 'Authentication required for user lookup.' };
    }
    const { data } = await supabaseAdmin.from('profiles').select('id, full_name, bio').ilike('full_name', `%${fnArgs.name}%`).limit(1);
    if (data && data.length > 0) {
        const { data: userTools } = await supabaseAdmin.from('tools').select('name, slug').or(`creator_id.eq.${data[0].id},user_id.eq.${data[0].id}`);
        return { profile: data[0], published_tools: userTools || [] };
    }
    return { error: 'User not found' };
}

export async function search_comparisons() {
    const { data } = await supabaseAdmin.from('tool_comparisons').select('tool1:tools!tool1_id(name), tool2:tools!tool2_id(name)').limit(2);
    return { comparisons: data || [] };
}

export async function get_tool_reviews(fnArgs) {
    try {
        const { data: toolRow, error: toolErr } = await supabaseAdmin.from('tools').select('id').eq('slug', fnArgs.slug).single();
        if (toolErr || !toolRow) return { error: 'Tool not found by slug.' };
        const { data, error } = await supabaseAdmin.from('reviews').select('rating, comment, profiles(full_name)').eq('tool_id', toolRow.id).limit(3);
        if (error) return { error: error.message };
        return { reviews: data || [] };
    } catch (e) {
        return { error: e.message };
    }
}

export async function get_tool_details(fnArgs) {
    const { data, error } = await supabaseAdmin.from('tools').select('*').ilike('slug', `%${fnArgs.slug}%`).single();
    if (error || !data) {
        return { error: 'Tool not found' };
    }
    return { 
        tool: { 
            name: data.name, 
            description: data.description, 
            pricing_type: data.pricing_type, 
            url: data.url,
            logo: data.image_url,
            image_url: data.image_url
        } 
    };
}

export async function compare_tools_detailed(fnArgs) {
    const { slug1, slug2 } = fnArgs;
    if (!slug1 || !slug2) return { error: 'Both slug1 and slug2 are required.' };
    
    const [res1, res2] = await Promise.all([
        supabaseAdmin.from('tools').select('name, description, pricing_type, url, category_id, rating, reviews_count').ilike('slug', `%${slug1}%`).single(),
        supabaseAdmin.from('tools').select('name, description, pricing_type, url, category_id, rating, reviews_count').ilike('slug', `%${slug2}%`).single(),
    ]);
    
    if (res1.error || !res1.data) return { error: `Tool '${slug1}' not found.` };
    if (res2.error || !res2.data) return { error: `Tool '${slug2}' not found.` };
    
    return {
        tool_a: res1.data,
        tool_b: res2.data,
        comparison_summary: {
            pricing_match: res1.data.pricing_type === res2.data.pricing_type,
            rating_winner: (res1.data.rating ?? 0) >= (res2.data.rating ?? 0) ? res1.data.name : res2.data.name,
            review_volume_winner: (res1.data.reviews_count ?? 0) >= (res2.data.reviews_count ?? 0) ? res1.data.name : res2.data.name,
        }
    };
}

export async function explore_database_schema(fnArgs, databaseDictionary) {
    const { tables_or_keywords } = fnArgs;
    const allTables = Object.entries(databaseDictionary.tables || {}).map(([tableName, tableObj]) => ({
        table_name: tableName,
        description: tableObj.description || '',
        fields: tableObj.fields || {}
    }));
    
    let matchedTables = [];
    if (tables_or_keywords && tables_or_keywords.length > 0) {
        matchedTables = allTables.filter(t => 
            tables_or_keywords.some(kw => 
                t.table_name.toLowerCase().includes(kw.toLowerCase()) || 
                t.description.toLowerCase().includes(kw.toLowerCase())
            )
        );
    } else {
        matchedTables = allTables;
    }

    const schemaSummary = matchedTables.map(t => ({
        table_name: t.table_name,
        description: t.description,
        columns: Object.entries(t.fields).map(([fieldName, fieldDesc]) => `${fieldName} (${fieldDesc})`).join(', ')
    }));

    return { 
        schema: schemaSummary, 
        message: schemaSummary.length > 0 ? "Schema retrieved." : "No matching tables found." 
    };
}
