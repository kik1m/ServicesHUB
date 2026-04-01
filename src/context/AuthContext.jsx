import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const fetchProfile = async (userId) => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('is_premium, role, full_name, avatar_url')
                    .eq('id', userId)
                    .single();
                if (error) throw error;
                return data;
            } catch (err) {
                console.error("Profile fetch error:", err);
                return { is_premium: false, role: 'user' };
            }
        };

        // Safety net: force loading=false after 6s if Supabase SDK never responds
        const safetyTimeout = setTimeout(() => {
            if (mounted) {
                console.warn('Auth timed out. Proceeding as guest.');
                setLoading(false);
            }
        }, 6000);

        // ✅ Supabase v2 best practice: use ONLY onAuthStateChange.
        // The INITIAL_SESSION event fires immediately with the stored session,
        // replacing the need for a separate getSession() call.
        // This eliminates the race condition that caused logout-on-refresh.
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return;

                clearTimeout(safetyTimeout);

                if (session?.user) {
                    const profile = await fetchProfile(session.user.id);
                    if (!mounted) return;
                    setUser({ ...session.user, ...profile });
                } else {
                    setUser(null);
                }

                setLoading(false);
            }
        );

        return () => {
            mounted = false;
            clearTimeout(safetyTimeout);
            subscription.unsubscribe();
        };
    }, []);

    const value = {
        user,
        loading,
        signOut: async () => {
            await supabase.auth.signOut();
        },
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
