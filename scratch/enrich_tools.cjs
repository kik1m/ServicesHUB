const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://uwyidshwfvjlzfgbtmac.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3eWlkc2h3ZnZqbHpmZ2J0bWFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDUxNDY1MiwiZXhwIjoyMDkwMDkwNjUyfQ.ru-aDzLc90gS67LS9NeVOABQOCTzj6EQ3ELe3X93SzQ');

const updates = [
    { 
        slug: 'sora-ultra', 
        description: `Sora Ultra is OpenAI's flagship cinematic AI video generator for 2026. It introduces "Fluid Motion v4" and "Neural Physics v2," allowing for hyper-realistic interactions between objects and environments. Beyond simple generation, it offers a "Director's Console" where users can adjust lighting, camera angles, and character expressions in real-time. 
        
Pricing:
• Basic Plan: $49/mo (1080p generation, 30s clips)
• Pro Plan: $129/mo (4K resolution, Commercial rights, 60s clips)
• Enterprise: Custom pricing for 8K studio production.`,
        pricing_details: '$49 - $129/mo' 
    },
    { 
        slug: 'claude-4-opus', 
        description: `Claude 4 Opus by Anthropic is the industry-leading model for high-stakes reasoning and multi-step complex tasks. It features a revolutionary 10-million token context window, allowing it to process entire codebases or legal libraries in a single prompt. Its "Constitutional AI" framework has been upgraded for zero-bias output while maintaining human-like creative nuance.
        
Pricing:
• Free Tier: Limited daily usage on Opus models.
• Pro Tier: $20/mo (5x more usage, priority access during peak times).
• Team Tier: $40/user/mo (Minimum 5 users, shared workspaces).`,
        pricing_details: 'Free / $20 - $40/mo' 
    },
    { 
        slug: 'devin-pro', 
        description: `Devin Pro is the autonomous AI software engineer designed to work alongside human teams. Unlike basic coding assistants, Devin Pro can plan complex migrations, fix architectural debt, and learn niche frameworks by reading their documentation on the fly. It comes with a secure cloud-based environment for testing and deployment.
        
Pricing:
• Individual Pro: $50/mo (Standard autonomous coding).
• Team License: $500/mo (Up to 12 seats, collaborative coding).
• Enterprise: Custom security and dedicated compute power.`,
        pricing_details: '$50 - $500/mo' 
    },
    { 
        slug: 'flux-2-realistic', 
        description: `Flux.2 Realistic represents the next frontier in generative imagery. Developed by Black Forest Labs, this model uses a hybrid diffusion-transformer architecture to achieve unmatched detail in human anatomy, particularly hands and eyes. It supports direct 4K output and multi-aspect ratio generation without distortion.
        
Pricing:
• Community Edition: Free for non-commercial personal use.
• Pro API: Starts at $0.05 per 4K high-quality image.
• Studio License: $99/mo for unlimited high-priority 4K generation.`,
        pricing_details: 'Free / $99/mo' 
    }
];

async function run() {
    for (const u of updates) {
        const { error } = await supabase.from('tools').update({ 
            description: u.description, 
            pricing_details: u.pricing_details, 
            rating: 0,
            reviews_count: 0
        }).eq('slug', u.slug);
        
        if (error) console.error(`Error updating ${u.slug}:`, error);
        else console.log(`Updated ${u.slug} successfully`);
    }
}

run();
