import { authenticateAndCheckQuota } from '@/app/api/v1/engine/_lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

        // Authenticate the user
        const { verifiedUserId, error: authError, message: authMessage } = await authenticateAndCheckQuota(req, 'chat');
        if (authError) {
            return new Response(JSON.stringify({ error: authError, message: authMessage }), { status: 403, headers: corsHeaders });
        }

        if (projectId) {
            // Fetch single project and verify ownership
            const { data: project, error: projectErr } = await supabaseAdmin
                .from('ai_workflow_projects')
                .select('*')
                .eq('id', projectId)
                .eq('user_id', verifiedUserId)
                .single();

            if (projectErr || !project) {
                return new Response(JSON.stringify({ error: 'NOT_FOUND', message: 'Project not found or access denied.' }), { status: 404, headers: corsHeaders });
            }

            // Fetch state
            const { data: state } = await supabaseAdmin
                .from('ai_workflow_states')
                .select('blueprint_json')
                .eq('project_id', projectId)
                .single();

            // Fetch messages
            const { data: messages } = await supabaseAdmin
                .from('ai_workflow_messages')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: true });

            return new Response(JSON.stringify({
                project,
                blueprint: state?.blueprint_json || {},
                messages: messages || []
            }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        } else {
            // Fetch all projects for the user
            const { data: projects, error: projectsErr } = await supabaseAdmin
                .from('ai_workflow_projects')
                .select('*')
                .eq('user_id', verifiedUserId)
                .order('updated_at', { ascending: false });

            if (projectsErr) {
                return new Response(JSON.stringify({ error: 'DB_ERROR', message: 'Failed to fetch projects.' }), { status: 500, headers: corsHeaders });
            }

            return new Response(JSON.stringify({ projects }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
    } catch (err) {
        console.error('Workflow GET error:', err);
        return new Response(JSON.stringify({ error: 'SERVER_ERROR', message: err.message }), { status: 500, headers: corsHeaders });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { projectId, blueprint_json } = body;

        if (!projectId || !blueprint_json) {
            return new Response(JSON.stringify({ error: 'BAD_REQUEST', message: 'Missing project ID or blueprint JSON.' }), { status: 400, headers: corsHeaders });
        }

        // Authenticate the user
        const { verifiedUserId, error: authError, message: authMessage } = await authenticateAndCheckQuota(req, 'chat');
        if (authError) {
            return new Response(JSON.stringify({ error: authError, message: authMessage }), { status: 403, headers: corsHeaders });
        }

        // Verify project ownership
        const { data: project, error: projectErr } = await supabaseAdmin
            .from('ai_workflow_projects')
            .select('id')
            .eq('id', projectId)
            .eq('user_id', verifiedUserId)
            .single();

        if (projectErr || !project) {
            return new Response(JSON.stringify({ error: 'UNAUTHORIZED', message: 'You do not own this project.' }), { status: 401, headers: corsHeaders });
        }

        // Update workflow state blueprint
        const { error: stateErr } = await supabaseAdmin
            .from('ai_workflow_states')
            .upsert({
                project_id: projectId,
                blueprint_json: blueprint_json,
                updated_at: new Date().toISOString()
            }, { onConflict: 'project_id' });

        if (stateErr) {
            console.error('Database state update error:', stateErr.message);
            return new Response(JSON.stringify({ error: 'DB_ERROR', message: 'Failed to sync workflow state.' }), { status: 500, headers: corsHeaders });
        }

        // Touch the project's updated_at timestamp
        await supabaseAdmin
            .from('ai_workflow_projects')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', projectId);

        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (err) {
        console.error('Workflow POST sync error:', err);
        return new Response(JSON.stringify({ error: 'SERVER_ERROR', message: err.message }), { status: 500, headers: corsHeaders });
    }
}
