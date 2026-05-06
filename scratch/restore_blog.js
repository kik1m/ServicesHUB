import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env.local', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val) acc[key.trim()] = val.join('=').trim().replace(/['"]/g, '');
  return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data: blog } = await supabase.from('blog_posts').select('*').eq('slug', 'the-best-ai-tools').single();
  
  if (!blog) {
      console.log('Blog not found!');
      return;
  }
  
  // Fetch some tools to embed
  const { data: tools } = await supabase.from('tools').select('id, name, slug').limit(3);
  
  const tool1 = tools[0];
  const tool2 = tools[1];
  const tool3 = tools[2];
  
  const originalContent = `
<h2>The Best AI Tools in 2026: Accelerate Your Workflow</h2>

Artificial Intelligence is the ultimate driving force behind modern productivity. In this guide, we explore the elite echelon of AI applications across various domains, offering you a strategic blueprint to stay ahead of the curve.

<br/>

<h3>1. Generative AI for Writing and Content Creation</h3>

Today's AI writing assistants go far beyond simple grammar correction; they act as your strategic co-authors. Here is one of our top recommended tools for this category:

<br/>

[tool id="${tool1?.id}"]

<br/>

<h3>2. Elite Code Assistants for Developers</h3>

Software development is experiencing a renaissance. The barrier to entry is lowering, while the ceiling for what a single developer can build is skyrocketing.

<br/>

[tool id="${tool2?.id}"]

<br/>

<h3>3. Visual and Audio Generation (The Creative Revolution)</h3>

The creative industry has been entirely disrupted by text-to-image and text-to-video models. What used to take days of rendering and styling now takes seconds.

<br/>

[tool id="${tool3?.id}"]

<br/>

<h3>Compare Before You Buy</h3>

Not sure which tool fits your needs? Use our AI Comparison Engine to make the perfect choice!

<br/>

[compare slug1="${tool1?.slug}" slug2="${tool2?.slug}"]

<br/>

<h3>The Strategic Advantage</h3>

Adopting AI is not about replacing human creativity; it is about eliminating the friction between a brilliant idea and its execution. By integrating these tools into your daily operations, you free up the mental bandwidth required for deep, strategic thinking.
  `;

  const { error } = await supabase
    .from('blog_posts')
    .update({ content: originalContent.trim() })
    .eq('id', blog.id);

  if (error) {
      console.error('Error updating:', error);
  } else {
      console.log('✅ Successfully restored the UI structure!');
  }
}

main();
