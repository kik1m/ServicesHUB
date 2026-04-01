import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        // Flag to prevent onAuthStateChange from overriding the getSession() call
        let initializing = true;

        const fetchProfile = async (userId) => {
            try {
                const { data } = await supabase
                    .from('profiles')
                    .select('is_premium, role, full_name, avatar_url')
                    .eq('id', userId)
                    .single();
                return data || { is_premium: false, role: 'user' };
            } catch {
                return { is_premium: false, role: 'user' };
            }
        };

        // Step 1: Fast init via getSession() - runs immediately on page load
        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!mounted) return;
                if (session?.user) {
                    const profile = await fetchProfile(session.user.id);
                    if (mounted) setUser({ ...session.user, ...profile });
                } else {
                    if (mounted) setUser(null);
                }
            } catch (err) {
                console.error('Auth init error:', err);
                if (mounted) setUser(null);
            } finally {
                initializing = false;
                if (mounted) setLoading(false);
            }
        };

        // Step 2: Listen for real-time auth changes (login, logout, token refresh)
        // Skip INITIAL_SESSION since getSession() already handled it
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                // Skip the initial event to avoid overriding getSession() result
                if (initializing) return;
                if (!mounted) return;

                if (session?.user) {
                    const profile = await fetchProfile(session.user.id);
                    if (mounted) setUser({ ...session.user, ...profile });
                } else {
                    if (mounted) setUser(null);
                }
                if (mounted) setLoading(false);
            }
        );

        // Safety net: if getSession() hangs for 8s, force loading=false
        const safetyTimeout = setTimeout(() => {
            if (mounted && loading) {
                initializing = false;
                setLoading(false);
            }
        }, 8000);

        initAuth().finally(() => clearTimeout(safetyTimeout));

        return () => {
            mounted = false;
            clearTimeout(safetyTimeout);
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, signOut: () => supabase.auth.signOut() }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
