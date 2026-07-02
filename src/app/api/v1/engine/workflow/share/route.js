import { supabaseAdmin } from '@/lib/supabaseAdmin';

const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
};

export async function OPTIONS() {
    return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const projectId = searchParams.get('id');

        if (!projectId) {
            return new Response(JSON.stringify({ error: 'BAD_REQUEST', message: 'Missing project ID.' }), { status: 400, headers: corsHeaders });
        }

        // Fetch project metadata (publicly accessible if share token/link is active)
        const { data: project, error: projectErr } = await supabaseAdmin
            .from('ai_workflow_projects')
            .select('id, title, description, created_at')
            .eq('id', projectId)
            .single();

        if (projectErr || !project) {
            return new Response(JSON.stringify({ error: 'NOT_FOUND', message: 'Shared project not found.' }), { status: 404, headers: corsHeaders });
        }

        // Fetch state blueprint
        const { data: state } = await supabaseAdmin
            .from('ai_workflow_states')
            .select('blueprint_json')
            .eq('project_id', projectId)
            .single();

        return new Response(JSON.stringify({
            project,
            blueprint: state?.blueprint_json || {}
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (err) {
        console.error('Workflow Share GET error:', err);
        return new Response(JSON.stringify({ error: 'SERVER_ERROR', message: err.message }), { status: 500, headers: corsHeaders });
    }
}
