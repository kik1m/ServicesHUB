import { supabase } from '../lib/supabaseClient';

/**
 * authService - Abstraction for Supabase Authentication operations
 */
export const authService = {
    /**
     * Sign in with email and password
     */
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    },

    /**
     * Sign up with email, password and full name
     */
    async signUp(email, password, fullName) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName },
                emailRedirectTo: `${window.location.origin}/dashboard`
            }
        });
        
        if (error) throw error;

        // Note: AuthContext handles profile creation via "healing logic" 
        // but we can also do a proactive upsert if needed.
        if (data?.user) {
            await supabase.from('profiles').upsert({
                id: data.user.id,
                full_name: fullName,
                email: email, // Store email for admin notifications & cross-referencing
                role: 'user',
                updated_at: new Date().toISOString()
            });
        }
        
        return data;
    },

    /**
     * Sign out
     */
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    /**
     * Reset password for email
     */
    async resetPassword(email) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        return data;
    },

    /**
     * Update password (used in ResetPassword flow)
     */
    async updatePassword(newPassword) {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });
        if (error) throw error;
        return data;
    },

    /**
     * Sign in with OAuth provider
     */
    async signInWithSocial(provider) {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin + '/dashboard'
            }
        });
        if (error) throw error;
        return data;
    }
};
