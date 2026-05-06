import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function injectPost() {
    const post = {
        title: "The Ultimate AI Power Trio for 2026",
        category: "AI NEWS",
        excerpt: "We explore three massive AI tools that are changing the way we work, create, and code this year.",
        content: `
<p>The AI landscape is moving at breakneck speed. To stay ahead, you need the right tools in your arsenal. Today, we're looking at three standout solutions that every tech enthusiast should know about.</p>

<h2>1. Strategic Intelligence: Emergent</h2>
<p>Emergent has redefined how we process complex data and strategic planning. Its neural architecture allows for real-time insights that were previously impossible.</p>
[tool id="d0a92725-e73b-486e-aa57-2ccd31d3c704"]

<h2>2. Video Creation Reimagined: HeyGen</h2>
<p>HeyGen continues to dominate the AI video space. Whether you're creating marketing content or educational tutorials, their latest avatar technology is frighteningly realistic.</p>
[tool id="d34c1e8a-57b2-4393-857e-e4734323da80"]

<h2>3. The Autonomous Coder: Devin Pro</h2>
<p>For developers, Devin Pro is nothing short of a revolution. It doesn't just suggest code; it understands whole projects and can execute complex engineering tasks independently.</p>
[tool id="0ddfa802-607c-48fb-b0dd-27b7b49d61f6"]

<p>Conclusion: These three tools represent the pinnacle of current AI development. By integrating them into your workflow, you're not just keeping up; you're leading the charge.</p>
        `,
        author_name: "HUBly Editorial Team",
        image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=60",
        created_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('blog_posts').insert([post]).select();
    
    if (error) {
        console.error('Injection Failed:', error);
    } else {
        console.log('Test Post Injected Successfully:', data[0].id);
    }
}

injectPost();
