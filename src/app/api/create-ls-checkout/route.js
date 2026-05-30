import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, itemType, planName, toolId, variantId, tierId } = body;

        if (!userId || !variantId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!process.env.LEMON_SQUEEZY_API_KEY || !process.env.LEMON_SQUEEZY_STORE_ID) {
            console.error('Lemon Squeezy credentials missing in ENV');
            return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
        }

        // Build custom data dynamically to avoid sending empty strings
        const customData = {
            user_id: userId,
            item_type: itemType,
            tier_id: tierId || 'pro'
        };
        if (toolId) {
            customData.tool_id = toolId;
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
                            custom: customData
                        },
                        product_options: {
                            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?type=${itemType}&toolId=${toolId || ''}&tierId=${tierId || 'pro'}&sync=true`,
                        },
                        test_mode: true,
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
            console.error('Lemon Squeezy API Error Detail:', JSON.stringify(data, null, 2));
            return NextResponse.json({ 
                error: 'Failed to create checkout', 
                detail: data.errors?.[0]?.detail || JSON.stringify(data.errors) || 'Unknown LS Error' 
            }, { status: response.status });
        }

        const checkoutUrl = data.data.attributes.url;
        return NextResponse.json({ url: checkoutUrl });

    } catch (error) {
        console.error('Checkout Route Error:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
