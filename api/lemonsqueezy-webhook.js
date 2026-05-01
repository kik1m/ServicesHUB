import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
    api: {
        bodyParser: true, // Lemon Squeezy sends JSON, but we need raw for signature verification
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 1. Verify Signature
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(JSON.stringify(req.body)).digest('hex'), 'utf8');
    const signature = Buffer.from(req.headers['x-signature'] || '', 'utf8');

    if (!crypto.timingSafeEqual(digest, signature)) {
        console.error('Invalid Lemon Squeezy signature');
        return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    const eventName = event.meta.event_name;
    const payload = event.data;

    console.log('Received Lemon Squeezy Event:', eventName);

    // 2. Process Order Created
    if (eventName === 'order_created') {
        const attributes = payload.attributes;
        const customData = event.meta.custom_data || {};
        
        const { userId, itemType, toolId, planName } = customData;

        console.log('Processing Lemon Squeezy payment:', { userId, itemType, toolId, planName });

        if (!userId || !itemType) {
            console.error('Missing metadata in custom_data:', customData);
            return res.status(400).json({ error: 'Missing metadata' });
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

            if (toolError) {
                console.error('Error updating tool promotion (LS):', toolError);
                return res.status(500).json({ error: 'Database update failed' });
            }
            console.log(`✅ Tool ${toolId} promoted via Lemon Squeezy`);

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

            if (profileError) {
                console.error('Error updating premium profile (LS):', profileError);
                return res.status(500).json({ error: 'Database update failed' });
            }
            console.log(`✅ User ${userId} upgraded to Premium via Lemon Squeezy`);
        }
    }

    res.status(200).json({ received: true });
}
