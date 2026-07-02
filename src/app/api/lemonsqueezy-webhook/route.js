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
            const { user_id, item_type, tool_id, tier_id } = customData;

            if (!user_id || !item_type) {
                console.error('Missing metadata in LS custom_data');
                return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
            }

            if (item_type === 'tool_promotion' && tool_id) {
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
                    .eq('id', tool_id);

                if (toolError) throw toolError;
                console.log(`✅ Tool ${tool_id} promoted`);

            } else if (item_type === 'account_premium') {
                // Handle Account Premium
                const tier = tier_id || 'pro';
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({ 
                        is_premium: true,
                        subscription_tier: tier
                    })
                    .eq('id', user_id);

                if (profileError) throw profileError;
                console.log(`✅ User ${user_id} upgraded to Premium (${tier})`);
            }
        }
        // 3. Process Refunds & Cancellations
        if (eventName === 'order_refunded' || eventName === 'subscription_expired') {
            const customData = event.meta.custom_data || {};
            const { user_id, item_type, tool_id } = customData;

            if (!user_id || !item_type) {
                console.error('Missing metadata in LS custom_data for refund/expiration');
                return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
            }

            if (item_type === 'tool_promotion' && tool_id) {
                // Revoke Tool Promotion
                const { error: toolError } = await supabase
                    .from('tools')
                    .update({ 
                        is_featured: false,
                        featured_until: null,
                        is_verified: false
                    })
                    .eq('id', tool_id);

                if (toolError) throw toolError;
                console.log(`❌ Tool ${tool_id} promotion revoked due to ${eventName}`);

            } else if (item_type === 'account_premium') {
                // Downgrade Account Premium
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({ 
                        is_premium: false,
                        subscription_tier: 'free'
                    })
                    .eq('id', user_id);

                if (profileError) throw profileError;
                console.log(`❌ User ${user_id} downgraded to Free due to ${eventName}`);
            }
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Webhook processing error:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
