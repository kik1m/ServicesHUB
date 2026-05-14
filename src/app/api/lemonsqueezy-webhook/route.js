import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Use Service Role Key for backend operations
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
    try {
        const rawBody = await request.text();
        const hmacSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
        
        if (!hmacSecret) {
            console.error('LEMON_SQUEEZY_WEBHOOK_SECRET is missing');
            return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
        }

        // 1. Verify Signature
        const hmac = crypto.createHmac('sha256', hmacSecret);
        const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
        const signature = Buffer.from(request.headers.get('x-signature') || '', 'utf8');

        if (!crypto.timingSafeEqual(digest, signature)) {
            console.error('Invalid Lemon Squeezy signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(rawBody);
        const eventName = event.meta.event_name;
        const payload = event.data;

        console.log(`[LS Webhook] Received: ${eventName}`);

        // 2. Process Order Created
        if (eventName === 'order_created') {
            const customData = event.meta.custom_data || {};
            const { userId, itemType, toolId } = customData;

            if (!userId || !itemType) {
                console.error('Missing metadata in LS custom_data');
                return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
            }

            if (itemType === 'tool_promotion' && toolId) {
                // Handle Tool Promotion
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
                console.log(`✅ Tool ${toolId} promoted`);

            } else if (itemType === 'account_premium') {
                // Handle Account Premium
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({ 
                        is_premium: true,
                        premium_since: new Date().toISOString(),
                        membership: 'premium',
                    })
                    .eq('id', userId);

                if (profileError) throw profileError;
                console.log(`✅ User ${userId} upgraded to Premium`);
            }
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Webhook processing error:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
