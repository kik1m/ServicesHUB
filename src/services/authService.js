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
                error.message = 'Invalid credentials. If you just created an account, please check your email to verify it first.';
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
                data: { full_name: fullName },
                emailRedirectTo: `${window.location.origin}/dashboard`
            }
        });
        
        if (error) throw error;

        // Trigger the secure server-side API to create the profile bypassing RLS
        if (data?.user) {
            try {
                const response = await fetch('/api/auth/create-profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: data.user.id,
                        email: email,
                        full_name: fullName
                    })
                });

                if (!response.ok) {
                    const errText = await response.text();
                    console.error("Critical: Server Profile Creation Failed:", errText);
                } else {
                    console.log("Server Profile successfully created bypassing RLS!");
                }
            } catch (err) {
                console.error("Critical: API call to create profile failed:", err);
            }
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
                redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined
            }
        });
        if (error) throw error;
        return data;
    }
};
