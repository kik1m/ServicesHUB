import { supabaseAdmin } from '../../../../../../lib/supabaseAdmin';

export async function admin_get_table_data(fnArgs, userRole) {
    if (userRole !== 'admin') return { error: 'Unauthorized' };
    try {
        const tableName = fnArgs.table_name;
        
        // Analytics Mode: Unlimited Read-Only Access
        // We allow querying any table, assuming the AI uses the provided read-only schema.
        // DANGER: We are using supabaseAdmin which bypasses RLS. However, this tool ONLY performs SELECT queries.
        // In the future, you can swap supabaseAdmin with an analytics-specific Supabase client.
        
        let columns = fnArgs.select_columns || '*';
        if (tableName === 'profiles' && columns.includes('*')) {
            columns = 'id, full_name, role, is_premium, subscription_tier, ai_messages_today, job_title';
        }
        
        // Ensure columns only contain word characters, commas, and asterisks
        if (!/^[a-zA-Z0-9_,\* ]+$/.test(columns)) {
            return { error: 'Invalid column syntax detected.' };
        }

        const limit = Math.min(parseInt(fnArgs.limit || 500, 10), 500); 
        
        const { data, error } = await supabaseAdmin
            .from(tableName)
            .select(columns)
            .limit(limit);
            
        if (error) return { error: error.message };
        return { success: true, row_count: data?.length || 0, data: data || [] };
    } catch (e) {
        return { error: e.message };
    }
}

export async function get_all_tools(userRole) {
    if (userRole !== 'admin') return { error: 'Unauthorized' };
    try {
        const { data, error } = await supabaseAdmin
            .from('tools')
            .select('id, name, slug, description, category_id');
        if (error) return { error: error.message };
        return { success: true, total_count: data?.length || 0, tools: data || [] };
    } catch (e) {
        return { error: e.message };
    }
}

export async function get_database_dictionary(databaseDictionary, userRole) {
    if (userRole !== 'admin') return { error: 'Unauthorized' };
    return { dictionary: databaseDictionary };
}

export async function analyze_platform_trends(userRole) {
    if (userRole !== 'admin') return { error: 'Unauthorized' };
    try {
        const { data, error } = await supabaseAdmin
            .from('tools')
            .select('name, slug, reviews_count, rating')
            .order('reviews_count', { ascending: false })
            .limit(5);
        if (error) return { error: error.message };
        return { trending_tools: data || [] };
    } catch (e) {
        return { error: e.message };
    }
}

export async function get_operational_status(userRole) {
    if (userRole !== 'admin') return { error: 'Unauthorized' };
    try {
        // Fetch all counts in parallel for maximum speed
        const [usersRes, toolsRes, articlesRes, catsRes, sessionsRes, comparisonsRes] = await Promise.all([
            supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('tools').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('blog_posts').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('categories').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('ai_sessions').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('tool_comparisons').select('*', { count: 'exact', head: true })
        ]);
        return {
            total_users:       usersRes.count        ?? 0,
            total_tools:       toolsRes.count        ?? 0,
            total_articles:    articlesRes.count     ?? 0,
            total_categories:  catsRes.count         ?? 0,
            total_ai_sessions: sessionsRes.count     ?? 0,
            total_comparisons: comparisonsRes.count  ?? 0,
            server_status:     'Online',
            fetched_at:        new Date().toISOString()
        };
    } catch (e) {
        return { error: e.message, server_status: 'Degraded' };
    }
}

export async function get_granular_analytics(userRole) {
    if (userRole !== 'admin') return { error: 'Unauthorized' };
    return { error: "Not implemented. Requires Mixpanel/Posthog." };
}

export async function search_internal_strategy(fnArgs, userRole) {
    if (userRole !== 'admin') return { error: 'Unauthorized' };
    const { data } = await supabaseAdmin.from('internal_knowledge').select('title, content').ilike('title', `%${fnArgs.query}%`).limit(3);
    return { documents: data || [] };
}
