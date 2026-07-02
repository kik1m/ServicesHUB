import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export async function POST(request) {
    try {
        const body = await request.json();
        const { visitorId, pagePath } = body;

        if (!visitorId || !pagePath) {
            return NextResponse.json({ error: 'Missing visitorId or pagePath' }, { status: 400 });
        }

        // Determine the country on the server side
        // Try Vercel country header first (fastest and free)
        let country = request.headers.get('x-vercel-ip-country') || 'Unknown';

        // If country is Unknown (e.g. running locally or on other environments)
        // We can do a quick fetch to get.geojs.io from the server (which doesn't suffer from CORS or browser blockages)
        if (country === 'Unknown') {
            try {
                const geoRes = await fetch('https://get.geojs.io/v1/ip/geo.json', { signal: AbortSignal.timeout(3000) });
                if (geoRes.ok) {
                    const geoData = await geoRes.json();
                    country = geoData.country || 'Unknown';
                }
            } catch (geoErr) {
                // If geojs fails, try fallback ipapi.is
                try {
                    const fallbackRes = await fetch('https://ipapi.is/json/', { signal: AbortSignal.timeout(3000) });
                    if (fallbackRes.ok) {
                        const fallbackData = await fallbackRes.json();
                        country = fallbackData.location?.country || 'Unknown';
                    }
                } catch (e2) {
                    // Silently fail back to Unknown
                }
            }
        }

        // Insert into analytics using supabaseAdmin (which bypasses RLS checks and service role restriction)
        const { error } = await supabaseAdmin
            .from('analytics')
            .insert([{
                visitor_id: visitorId,
                page_path: pagePath,
                country: country,
                visit_date: new Date().toISOString().split('T')[0]
            }]);

        if (error) {
            console.error('❌ [Server Analytics Insert Error]:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, country });
    } catch (err) {
        console.error('❌ [Server Analytics Route Error]:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
