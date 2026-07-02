import { supabaseAdmin } from '../../../../../../lib/supabaseAdmin';

export async function initializeSession({ initialSessionId, verifiedUserId, tool1Context, tool2Context, rawMessages, messages, send }) {
    let activeSessionId = initialSessionId;
    let isNewSession = false;

    try {
        const lastUserMsgRaw = rawMessages && rawMessages.length > 0
            ? rawMessages[rawMessages.length - 1].content
            : messages[messages.length - 1]?.parts[0]?.text || '';

        if (!activeSessionId) {
            isNewSession = true;
            const { data, error } = await supabaseAdmin
                .from('ai_sessions')
                .insert({
                    tool1_id: tool1Context?.id || null,
                    tool2_id: tool2Context?.id || null,
                    user_id: verifiedUserId || null,
                    is_public: false
                })
                .select('id').single();
            if (!error && data) activeSessionId = data.id;
        }

        if (activeSessionId) {
            if (isNewSession) send({ type: 'session_id', id: activeSessionId });
            if (lastUserMsgRaw) {
                await supabaseAdmin.from('ai_messages').insert({
                    session_id: activeSessionId,
                    role: 'user',
                    content: lastUserMsgRaw
                });
            }
        }
    } catch (dbErr) {
        console.error('[AI Engine] Error initializing session:', dbErr);
    }

    return activeSessionId;
}

export async function initializeAssistantMessage(activeSessionId) {
    if (!activeSessionId) return null;
    try {
        const { data } = await supabaseAdmin
            .from('ai_messages')
            .insert({ session_id: activeSessionId, role: 'assistant', content: '' })
            .select('id').single();
        return data?.id || null;
    } catch (e) {
        return null;
    }
}

export function startPeriodicSave(assistantMessageId, getFullResponse) {
    let lastSavedLength = 0;
    return setInterval(async () => {
        const fullResponse = getFullResponse();
        if (assistantMessageId && fullResponse.length > lastSavedLength + 20) {
            lastSavedLength = fullResponse.length;
            try {
                await supabaseAdmin.from('ai_messages').update({ content: fullResponse }).eq('id', assistantMessageId);
            } catch (e) {}
        }
    }, 3000);
}

export async function finalizeAssistantMessage(activeSessionId, assistantMessageId, fullResponse) {
    if (assistantMessageId && fullResponse.trim()) {
        try {
            await supabaseAdmin.from('ai_messages').update({ content: fullResponse }).eq('id', assistantMessageId);
        } catch (e) {}
    } else if (activeSessionId && fullResponse.trim()) {
        try {
            await supabaseAdmin.from('ai_messages').insert({
                session_id: activeSessionId,
                role: 'assistant',
                content: fullResponse
            });
        } catch (dbErr) {
            console.error('[AI Engine] Error finalizing assistant message:', dbErr);
        }
    }
}
