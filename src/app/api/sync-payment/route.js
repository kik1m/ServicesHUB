import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, itemType, toolId, tierId } = body;

        if (!userId || !itemType) {
            return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
        }

        // Logic parity with Webhook
        if (itemType === 'tool_promotion' && toolId) {
            const durationDays = 30;
            const featuredUntil = new Date();
            featuredUntil.setDate(featuredUntil.getDate() + durationDays);

            const { error: toolError } = await supabase
                .from('tools')
                .update({ 
                    is_featured: true,
                    featured_until: featuredUntil.toISOString(),
                    is_verified: true
                })
                .eq('id', toolId);

            if (toolError) throw toolError;
            console.log(`✅ [Local Sync] Tool ${toolId} promoted`);

        } else if (itemType === 'account_premium') {
            const tier = tierId || 'pro';
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ 
                    is_premium: true,
                    subscription_tier: tier
                })
                .eq('id', userId);

            if (profileError) throw profileError;
            console.log(`✅ [Local Sync] User ${userId} upgraded to Premium`);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Local Sync Error:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
