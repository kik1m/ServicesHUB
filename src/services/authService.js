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
        if (error) {
            // Provide a hint if they try to login before verifying email
            if (error.message === 'Invalid login credentials') {
                error.message = "Invalid credentials. If you originally signed up using Google, please use the 'Continue with Google' button. Otherwise, make sure to check your email to verify your standard account first.";
            }
            throw error;
        }
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
                data: {
                    full_name: fullName,
                    name: fullName
                }
            }
        });

        if (error) throw error;
        
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
        const redirectUrl = typeof window !== 'undefined' 
            ? `${window.location.origin}/auth/callback`
            : undefined;

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: redirectUrl,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            }
        });
        if (error) throw error;
        return data;
    }
};
