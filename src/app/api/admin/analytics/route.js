import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized: Missing or malformed token' }, { status: 401 });
        }

        const token = authHeader.slice(7);
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
        }

        // Verify the user is an admin
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();

        if (profileError || profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        // Fetch data bypass RLS using supabaseAdmin
        const { data: allData, error: dbError } = await supabaseAdmin
            .from('analytics')
            .select('visitor_id, page_path, country');

        if (dbError) {
            console.error('ظإî [Admin Analytics DB Error]:', dbError.message);
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json(allData || []);
    } catch (err) {
        console.error('ظإî [Admin Analytics Route Error]:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
