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

        const prompt = `You are a senior Project Architecture Consultant. A user wants to build the following project and needs your expert guidance to create a truly comprehensive plan.

Project Name: "${projectName}"
Project Goal/Description: "${ideaDescription}"

Your task: Analyze the project deeply and generate as many question-steps as needed (minimum 3, maximum 8) to fully understand every dimension of this project. The number of steps should be determined by the complexity and nature of the project — a simple landing page needs fewer steps than a complex SaaS platform or AI system.

Each step should cover a distinct, critical dimension of the project. Do NOT generate generic or redundant questions. Every question must be highly specific to THIS exact project type.

Examples of dimensions to consider (use only those relevant to this project):
- For a SaaS app: Tech stack, auth system, database schema, subscription model, user roles
- For an AI project: AI models used, data pipeline, training approach, output format, evaluation metrics
- For a mobile app: Target platform (iOS/Android/both), offline support, push notifications, app store strategy
- For a creative project (film/music): Style, genre, target audience, distribution platform, production tools
- For an e-commerce project: Product catalog, payment gateway, shipping logic, inventory management
- For any project: Target audience, success metrics, MVP scope vs full scope, team size/resources

Output ONLY a valid JSON array. Do not wrap in markdown tags. Raw JSON string only.

Each step object must follow this exact schema:
{
  "title": "Concise step title (max 5 words)",
  "desc": "One sentence explaining what this step clarifies about the project",
  "fields": [
    {
      "id": "uniqueCamelCaseId",
      "label": "Human readable question label",
      "type": "select" | "multiselect" | "text" | "textarea",
      "options": ["Option A", "Option B", "Option C"],
      "placeholder": "Helpful hint text for the user"
    }
  ]
}

Rules:
- Each step must have 2 to 4 fields (not more, not less)
- Use "select" for single-choice questions, "multiselect" for multi-choice, "textarea" for open-ended long answers, "text" for short inputs
- Only include "options" array for "select" and "multiselect" field types
- Make options specific and relevant — no generic "Option A/B" placeholders
- Generate between 3 and 8 steps based on project complexity`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const text = response.text.trim();
        const customSteps = JSON.parse(text);

        if (!Array.isArray(customSteps) || customSteps.length === 0) {
            throw new Error('AI returned invalid steps array');
        }

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
