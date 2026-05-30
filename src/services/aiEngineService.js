import { supabase } from '../lib/supabaseClient';

export const aiEngineService = {
    /**
     * Creates a new AI comparison session.
     */
    async createSession(tool1Id, tool2Id, userId = null) {
        try {
            const { data, error } = await supabase
                .from('ai_sessions')
                .insert({
                    tool1_id: tool1Id,
                    tool2_id: tool2Id,
                    user_id: userId,
                    is_public: false
                })
                .select('id')
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('[AI Engine] Error creating session:', error);
            return { data: null, error };
        }
    },

    /**
     * Fetches all sessions for a specific user.
     */
    async getUserSessions(userId) {
        if (!userId) return { data: [], error: 'User ID required' };
        try {
            const { data, error } = await supabase
                .from('ai_sessions')
                .select(`
                    id, 
                    title,
                    created_at,
                    tool1:tools!tool1_id(name, image_url, slug),
                    tool2:tools!tool2_id(name, image_url, slug)
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { data: data || [], error: null };
        } catch (error) {
            console.error('[AI Engine] Error fetching user sessions:', error);
            return { data: [], error };
        }
    },

    /**
     * Fetches a session by ID, including the related tool data.
     */
    async getSession(sessionId) {
        try {
            const { data, error } = await supabase
                .from('ai_sessions')
                .select(`
                    id, 
                    user_id, 
                    is_public, 
                    created_at,
                    tool1:tools!tool1_id(id, name, slug, image_url),
                    tool2:tools!tool2_id(id, name, slug, image_url)
                `)
                .eq('id', sessionId)
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('[AI Engine] Error fetching session:', error);
            return { data: null, error };
        }
    },

    /**
     * Appends a new message to the session.
     */
    async addMessage(sessionId, role, content) {
        try {
            const { data, error } = await supabase
                .from('ai_messages')
                .insert({
                    session_id: sessionId,
                    role,
                    content
                })
                .select('id, role, content, created_at')
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('[AI Engine] Error adding message:', error);
            return { data: null, error };
        }
    },

    /**
     * Fetches all messages for a session, ordered chronologically.
     */
    async getMessages(sessionId) {
        try {
            const { data, error } = await supabase
                .from('ai_messages')
                .select('id, role, content, created_at')
                .eq('session_id', sessionId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('[AI Engine] Error fetching messages:', error);
            return { data: null, error };
        }
    },

    /**
     * Toggles the public visibility of a session.
     */
    async toggleSessionVisibility(sessionId, isPublic) {
        try {
            const { data, error } = await supabase
                .from('ai_sessions')
                .update({ is_public: isPublic })
                .eq('id', sessionId)
                .select('id, is_public')
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('[AI Engine] Error updating visibility:', error);
            return { data: null, error };
        }
    },

    /**
     * Renames an AI session
     */
    async renameSession(sessionId, newTitle) {
        try {
            const { error } = await supabase
                .from('ai_sessions')
                .update({ title: newTitle })
                .eq('id', sessionId);
            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('[AI Engine] Error renaming session:', error);
            return { error };
        }
    },

    /**
     * Deletes an AI session and all its messages (handled by cascading delete usually, but we delete session here)
     */
    async deleteSession(sessionId) {
        try {
            const { error } = await supabase
                .from('ai_sessions')
                .delete()
                .eq('id', sessionId);
            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('[AI Engine] Error deleting session:', error);
            return { error };
        }
    }
};
