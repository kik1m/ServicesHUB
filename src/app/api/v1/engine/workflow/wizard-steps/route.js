import { authenticateAndCheckQuota } from '../../_lib/auth';
import { GoogleGenAI } from '@google/genai';

const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
};

export async function OPTIONS() {
    return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { projectName, ideaDescription } = body;

        if (!projectName || !ideaDescription) {
            return new Response(JSON.stringify({ error: 'BAD_REQUEST', message: 'Missing projectName or ideaDescription.' }), { status: 400, headers: corsHeaders });
        }

        // Authenticate the user
        const { verifiedUserId, error: authError, message: authMessage } = await authenticateAndCheckQuota(req, 'chat');
        if (authError) {
            return new Response(JSON.stringify({ error: authError, message: authMessage }), { status: 403, headers: corsHeaders });
        }

        const keys = process.env.GEMINI_API_KEY?.split(',') || [];
        if (keys.length === 0) {
            return new Response(JSON.stringify({ error: 'MISSING_API_KEY', message: 'Gemini API keys are not configured.' }), { status: 500, headers: corsHeaders });
        }

        const apiKey = keys[Math.floor(Math.random() * keys.length)];
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are a Project Architecture Designer. The user wants to build/create a project.
Project Name: "${projectName}"
Project Goal/Description: "${ideaDescription}"

Based on the project concept, dynamically generate exactly 2 custom questions/steps that you, as an AI, need to ask the user to tailor the ultimate plan. These questions must be extremely specific to the project type (e.g., if it's an AI movie/story, ask about voice narrations, plot styles, mood; if it's a SaaS coding project, ask about backend databases, auth providers; if it's a design portfolio, ask about visual aesthetic, page transitions).
Output ONLY a valid JSON array containing exactly 2 step objects. Do not wrap in markdown tags like \`\`\`json. Raw JSON string only.

Each step object in the array must look exactly like this:
{
  "title": "Short title of the step (e.g. Visual Style & Mood)",
  "desc": "Short description of what the user defines in this step",
  "fields": [
    {
      "id": "uniqueCamelCaseId (e.g. artStyle, DBType)",
      "label": "Human readable label (e.g. Select Art Style)",
      "type": "select" | "multiselect" | "text" | "textarea",
      "options": ["Option 1", "Option 2", "Option 3"], // Only include this array if type is 'select' or 'multiselect'
      "placeholder": "Helper placeholder text"
    }
  ]
}

Ensure the fields are highly relevant and creative. Limit fields per step to maximum 3.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const text = response.text.trim();
        const customSteps = JSON.parse(text);

        return new Response(JSON.stringify({ customSteps }), {
            status: 200,
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });

    } catch (err) {
        console.error('Wizard steps generation error:', err);
        return new Response(JSON.stringify({ error: 'SERVER_ERROR', message: err.message }), { status: 500, headers: corsHeaders });
    }
}
