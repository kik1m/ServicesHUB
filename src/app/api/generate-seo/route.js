import { NextResponse } from 'next/server';
import { generateAISeo } from '../utils/seoGenerator.js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
    try {
        const body = await request.json();
        const { entityId, entityType } = body;

        if (!entityId || !entityType) {
            return NextResponse.json({ error: 'Missing Entity ID or Type' }, { status: 400 });
        }

        console.log(`[SEO ENGINE] Generating for ${entityType}:${entityId}`);
        
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
        } else if (entityType === 'page') {
            data = body.data || { name: entityId };
        }

        if (!data) throw new Error('ENTITY_NOT_FOUND');

        const result = await generateAISeo(entityId, data, entityType);
        
        return NextResponse.json({ success: true, metadata: result });
    } catch (err) {
        console.error('[SEO ENGINE ERROR]:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
