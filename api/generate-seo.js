import { generateAISeo } from './utils/seoGenerator.js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Rule #30: Security - Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { entityId, entityType } = req.body;

  if (!entityId || !entityType) {
    return res.status(400).json({ error: 'Missing Entity ID or Type' });
  }

  try {
    console.log(`[PRE-EMPTIVE SEO] Triggering for ${entityType}:${entityId}`);
    
    // Fetch data based on type
    let data;
    if (entityType === 'tool') {
      const { data: tool } = await supabase.from('tools').select('*').eq('id', entityId).single();
      data = tool;
    } else if (entityType === 'blog') {
      const { data: blog } = await supabase.from('blog_posts').select('*').eq('id', entityId).single();
      data = blog;
    } else if (entityType === 'category') {
      const { data: cat } = await supabase.from('categories').select('*').eq('id', entityId).single();
      data = cat;
    }

    if (!data) throw new Error('ENTITY_NOT_FOUND');

    const result = await generateAISeo(entityId, data, entityType);
    
    return res.status(200).json({ success: true, metadata: result });
  } catch (err) {
    console.error('[PRE-EMPTIVE SEO ERROR]:', err);
    return res.status(500).json({ error: err.message });
  }
}
