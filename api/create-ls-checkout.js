import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId, itemType, planName, toolId, variantId } = req.body;

    if (!userId || !variantId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // 🚀 Create Lemon Squeezy Checkout
        // Ref: https://docs.lemonsqueezy.com/api/checkouts#create-a-checkout
        const response = await axios.post(
            'https://api.lemonsqueezy.com/v1/checkouts',
            {
                data: {
                    type: 'checkouts',
                    attributes: {
                        checkout_data: {
                            custom: {
                                userId: userId,
                                itemType: itemType,
                                toolId: toolId || '',
                                planName: planName
                            },
                        },
                    },
                    relationships: {
                        store: {
                            data: {
                                type: 'stores',
                                id: process.env.LEMON_SQUEEZY_STORE_ID,
                            },
                        },
                        variant: {
                            data: {
                                type: 'variants',
                                id: variantId.toString(),
                            },
                        },
                    },
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
                    'Content-Type': 'application/vnd.api+json',
                    Accept: 'application/vnd.api+json',
                },
            }
        );

        const checkoutUrl = response.data.data.attributes.url;
        res.status(200).json({ url: checkoutUrl });

    } catch (error) {
        console.error('Lemon Squeezy Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to create checkout' });
    }
}
