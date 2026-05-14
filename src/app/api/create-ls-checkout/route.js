import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, itemType, planName, toolId, variantId } = body;

        if (!userId || !variantId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!process.env.LEMON_SQUEEZY_API_KEY || !process.env.LEMON_SQUEEZY_STORE_ID) {
            console.error('Lemon Squeezy credentials missing in ENV');
            return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
        }

        // 🚀 Create Lemon Squeezy Checkout
        const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
                'Content-Type': 'application/vnd.api+json',
                'Accept': 'application/vnd.api+json',
            },
            body: JSON.stringify({
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
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Lemon Squeezy API Error:', data);
            return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
        }

        const checkoutUrl = data.data.attributes.url;
        return NextResponse.json({ url: checkoutUrl });

    } catch (error) {
        console.error('Checkout Route Error:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
