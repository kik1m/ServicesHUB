import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
    api: {
        bodyParser: false,
    },
};

const buffer = async (readable) => {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { userId, planName, itemType = 'membership', toolId = null } = session.metadata;

        if (itemType === 'tool_promotion' && toolId) {
            // Handle Tool Promotion (Featured/Enterprise)
            const durationDays = planName === 'Featured' ? 7 : 30;
            const featuredUntil = new Date();
            featuredUntil.setDate(featuredUntil.getDate() + durationDays);

            const { error: toolError } = await supabase
                .from('tools')
                .update({ 
                    is_featured: true,
                    featured_until: featuredUntil.toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', toolId);

            if (toolError) {
                console.error('Error updating tool status:', toolError);
                return res.status(500).json({ error: 'Failed to update tool status' });
            }
            console.log(`Tool ${toolId} promoted to ${planName} until ${featuredUntil.toISOString()}`);
        } else {
            // Handle User Membership (Premium)
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ 
                    membership: planName,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (profileError) {
                console.error('Error updating profile:', profileError);
                return res.status(500).json({ error: 'Failed to update profile' });
            }
            console.log(`User ${userId} upgraded to ${planName}`);
        }
    }

    res.status(200).json({ received: true });
}
