import { supabaseAdmin } from '../../../../../../lib/supabaseAdmin';

export async function save_memory(fnArgs, verifiedUserId) {
    if (!verifiedUserId) {
        return { error: 'Authentication required to save memory' };
    }
    try {
        const { data: profileRow } = await supabaseAdmin.from('profiles').select('long_term_memory, id').eq('id', verifiedUserId).single();
        if (profileRow) {
            let currentMemory = typeof profileRow.long_term_memory === 'string'
                ? JSON.parse(profileRow.long_term_memory || '{}')
                : (profileRow.long_term_memory || {});

            currentMemory[fnArgs.key] = fnArgs.value;
            await supabaseAdmin.from('profiles').update({ long_term_memory: currentMemory }).eq('id', profileRow.id);
            return { success: true, message: `Memory saved: ${fnArgs.key}` };
        }
        return { error: 'Profile not found' };
    } catch (e) {
        return { error: 'Failed to parse or save memory' };
    }
}

export async function delete_memory(fnArgs, verifiedUserId) {
    if (!verifiedUserId) {
        return { error: 'Authentication required to delete memory' };
    }
    try {
        const { data: profileRow } = await supabaseAdmin.from('profiles').select('long_term_memory, id').eq('id', verifiedUserId).single();
        if (profileRow) {
            let currentMemory = typeof profileRow.long_term_memory === 'string'
                ? JSON.parse(profileRow.long_term_memory || '{}')
                : (profileRow.long_term_memory || {});

            if (currentMemory[fnArgs.key]) {
                delete currentMemory[fnArgs.key];
                await supabaseAdmin.from('profiles').update({ long_term_memory: currentMemory }).eq('id', profileRow.id);
                return { success: true, message: `Memory deleted: ${fnArgs.key}` };
            }
            return { error: 'Key not found in memory' };
        }
        return { error: 'Profile not found' };
    } catch (e) {
        return { error: 'Failed to parse or delete memory' };
    }
}

export async function create_user_project(fnArgs, verifiedUserId) {
    if (!verifiedUserId) {
        return { error: 'Authentication required' };
    }
    try {
        const { data, error } = await supabaseAdmin.from('user_projects').insert([{
            user_id: verifiedUserId,
            name: fnArgs.name,
            tech_stack: fnArgs.tech_stack || null,
            budget: fnArgs.budget || null,
            skill_level: fnArgs.skill_level || null
        }]).select();
        if (error) return { error: error.message };
        return { success: true, project: data[0] };
    } catch (e) {
        return { error: e.message };
    }
}

export async function get_user_projects(fnArgs, verifiedUserId) {
    if (!verifiedUserId) {
        return { error: 'Authentication required' };
    }
    const { data, error } = await supabaseAdmin.from('user_projects').select('*').eq('user_id', verifiedUserId);
    return { projects: data || [], error: error?.message };
}

export async function list_all_projects(userRole) {
    if (userRole !== 'admin') return { error: 'Unauthorized' };
    const { data, error } = await supabaseAdmin.from('user_projects').select('id, name, created_at, user_id');
    return { projects: data || [], error: error?.message };
}

export async function search_external_market(fnArgs) {
    const tavilyApiKey = process.env.TAVILY_API_KEY;
    if (!tavilyApiKey) {
        return { error: 'TAVILY_API_KEY is not configured.' };
    }
    const searchQuery = fnArgs.query + (fnArgs.market_type === 'ai_tools' ? ' AI tool' : '');
    try {
        const response = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ api_key: tavilyApiKey, query: searchQuery, search_depth: 'basic', max_results: 3 })
        });
        const json = await response.json();
        return { results: json.results || [], error: json.error };
    } catch (e) {
        return { error: 'Failed to search external market' };
    }
}

export async function get_market_trends(fnArgs) {
    const tavilyApiKey = process.env.TAVILY_API_KEY;
    if (!tavilyApiKey) {
        return { error: 'TAVILY_API_KEY is not configured.' };
    }
    const searchQuery = `Latest trends in ${fnArgs.industry} for ${fnArgs.topic}`;
    try {
        const response = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ api_key: tavilyApiKey, query: searchQuery, search_depth: 'advanced', include_answer: true, max_results: 2 })
        });
        const json = await response.json();
        return { market_data: json.results || [], query_used: searchQuery };
    } catch (e) {
        return { error: 'Failed to fetch market trends' };
    }
}
