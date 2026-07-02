import { authenticateAndCheckQuota } from '@/app/api/v1/engine/_lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { GoogleGenAI } from '@google/genai';

const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
};

const getApiKeys = () => process.env.GEMINI_API_KEY?.split(',') || [];

export async function OPTIONS() {
    return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { planText, title, description } = body;

        if (!planText || typeof planText !== 'string' || planText.trim().length < 20) {
            return new Response(JSON.stringify({ error: 'BAD_REQUEST', message: 'Missing or invalid plan text.' }), { status: 400, headers: corsHeaders });
        }

        // Authenticate the user
        const { verifiedUserId, error: authError, message: authMessage } = await authenticateAndCheckQuota(req, 'chat');
        if (authError) {
            return new Response(JSON.stringify({ error: authError, message: authMessage }), { status: 403, headers: corsHeaders });
        }

        const keys = getApiKeys();
        if (keys.length === 0) {
            return new Response(JSON.stringify({ error: 'MISSING_API_KEY', message: 'API keys are not configured.' }), { status: 500, headers: corsHeaders });
        }

        // Call Gemini to parse plan text into a structured JSON Blueprint
        const ai = new GoogleGenAI({ apiKey: keys[Math.floor(Math.random() * keys.length)] });
        
        const conversionPrompt = `You are a professional project architect. Translate the following project plan/steps into a structured JSON workflow blueprint.

Plan Text:
${planText}

Target JSON Schema:
{
  "projectName": "Clean title of the project",
  "description": "General description of the project goal",
  "phases": [
    {
      "id": "phase-1",
      "title": "Phase Title",
      "description": "Summary of this phase's goals",
      "status": "active", // First phase should be "active", others "pending"
      "tasks": [
        {
          "id": "task-1-1",
          "title": "Task Title",
          "status": "pending",
          "description": "Detailed checklist description of this task",
          "tool": {
            "name": "Name of the tool used (e.g. Supabase)",
            "slug": "slug of the tool (e.g. supabase)",
            "url": "website url (e.g. https://supabase.com)",
            "guide": "Detailed step-by-step developer instructions on how to use this tool, what configurations to set, and how to export its results to the next steps."
          }
        }
      ]
    }
  ],
  "connections": [
    { "from": "phase-1", "to": "phase-2" }
  ]
}

Instructions:
1. Ensure all task ids are unique strings (e.g., "task-1-1", "task-1-2").
2. Connect phases sequentially in the "connections" array.
3. Keep the output ONLY as a valid, parsable JSON string. DO NOT include markdown formatting like \`\`\`json or preambles. Output raw JSON.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: conversionPrompt
        });

        const rawText = response.text || '';
        const cleanText = rawText.trim().replace(/^```json\s*|```$/gi, '').trim();

        let blueprint;
        try {
            blueprint = JSON.parse(cleanText);
        } catch (parseErr) {
            console.error('Failed to parse Gemini workflow output:', cleanText);
            return new Response(JSON.stringify({ error: 'PARSE_FAILED', message: 'Failed to generate a valid workflow blueprint structure.' }), { status: 500, headers: corsHeaders });
        }

        // Create the project in the database
        const { data: project, error: projectErr } = await supabaseAdmin.from('ai_workflow_projects').insert({
            user_id: verifiedUserId,
            title: title || blueprint.projectName || 'New Project Workflow',
            description: description || blueprint.description || 'Interactive project workflow'
        }).select('id').single();

        if (projectErr) {
            console.error('Database project insert error:', projectErr.message);
            return new Response(JSON.stringify({ error: 'DB_ERROR', message: 'Failed to create project.' }), { status: 500, headers: corsHeaders });
        }

        // Insert the workflow state
        const { error: stateErr } = await supabaseAdmin.from('ai_workflow_states').insert({
            project_id: project.id,
            blueprint_json: blueprint
        });

        if (stateErr) {
            console.error('Database state insert error:', stateErr.message);
            // Rollback project creation
            await supabaseAdmin.from('ai_workflow_projects').delete().eq('id', project.id);
            return new Response(JSON.stringify({ error: 'DB_ERROR', message: 'Failed to save workflow state.' }), { status: 500, headers: corsHeaders });
        }

        return new Response(JSON.stringify({ 
            success: true, 
            projectId: project.id,
            projectName: blueprint.projectName
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (err) {
        console.error('Workflow export error:', err);
        return new Response(JSON.stringify({ error: 'SERVER_ERROR', message: err.message }), { status: 500, headers: corsHeaders });
    }
}
