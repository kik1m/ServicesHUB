import { supabaseAdmin } from '../../../../../../lib/supabaseAdmin';

export async function POST(req) {
    try {
        const { sessionId, userMessage } = await req.json();

        if (!sessionId || !userMessage) {
            return new Response(JSON.stringify({ error: 'sessionId and userMessage are required' }), { status: 400 });
        }

        // 🛡️ SECURITY: Verify the caller owns this session via JWT
        const authHeader = req.headers.get('Authorization');
        let verifiedUserId = null;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.slice(7);
            try {
                const { data: { user } } = await supabaseAdmin.auth.getUser(token);
                if (user) verifiedUserId = user.id;
            } catch (e) { /* Invalid token — will be rejected below */ }
        }

        if (!verifiedUserId) {
            return new Response(JSON.stringify({ error: 'UNAUTHORIZED', message: 'Authentication required.' }), { status: 401 });
        }

        // Verify session belongs to this user
        const { data: session, error: sessionError } = await supabaseAdmin
            .from('ai_sessions')
            .select('id, user_id')
            .eq('id', sessionId)
            .eq('user_id', verifiedUserId)
            .maybeSingle();

        if (sessionError || !session) {
            return new Response(JSON.stringify({ error: 'FORBIDDEN', message: 'Session not found or access denied.' }), { status: 403 });
        }

        // --- Fast Title Generation ---
        // Use the exact first question/message from the user.
        // If it's too long, truncate it nicely.
        let title = userMessage.trim();
        if (title.length > 35) {
            // Truncate to ~35 characters without cutting words in half
            const truncated = title.slice(0, 35);
            const lastSpace = truncated.lastIndexOf(' ');
            if (lastSpace > 10) {
                title = truncated.slice(0, lastSpace) + '...';
            } else {
                title = truncated + '...';
            }
        }

        // Update database
        const { error } = await supabaseAdmin
            .from('ai_sessions')
            .update({ title })
            .eq('id', sessionId);

        if (error) {
            console.error('[AI Engine Title] Supabase error:', error.message);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify({ title }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('[AI Engine Title] Exception:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
