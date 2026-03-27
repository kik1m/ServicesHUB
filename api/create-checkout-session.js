import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('Received Checkout Request:', req.body);
    console.log('Stripe Key length:', process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.length : 0);

    try {
        const { userId, planName, priceAmount, itemType = 'membership', toolId = null } = req.body;

        if (!userId || !planName || !priceAmount) {
            console.error('Missing required fields:', { userId, planName, priceAmount });
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const productName = itemType === 'tool_promotion' 
            ? `Tool Promotion: ${planName}`
            : `ServicesHUB Premium: ${planName}`;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: productName,
                        },
                        unit_amount: priceAmount * 100, // Price in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: itemType === 'tool_promotion' ? `${req.headers.origin}/promote` : `${req.headers.origin}/profile`,
            metadata: {
                userId: userId,
                planName: planName,
                itemType: itemType,
                toolId: toolId
            },
        });

        res.status(200).json({ id: session.id, url: session.url });
    } catch (err) {
        console.error('Stripe Error:', err);
        res.status(500).json({ error: err.message });
    }
}
