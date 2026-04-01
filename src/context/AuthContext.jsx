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
                const { data, error } = await supabase.from('profiles').select('is_premium, role').eq('id', userId).single();
                if (error) throw error;
                return data;
            } catch (err) {
                console.error("Profile fetch error:", err);
                return { is_premium: false, role: 'user' };
            }
        };

        // Safety net: if Supabase SDK hangs for any reason (network/browser), 
        // force loading to false after 5 seconds so pages don't get stuck.
        const safetyTimeout = setTimeout(() => {
            if (mounted && loading) {
                console.warn('Auth init timed out, proceeding without session.');
                setLoading(false);
            }
        }, 5000);

        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!mounted) return;
                if (session?.user) {
                    const profile = await fetchProfile(session.user.id);
                    if (!mounted) return;
                    setUser({ ...session.user, ...profile });
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth init error:", error);
                if (mounted) setUser(null);
            } finally {
                clearTimeout(safetyTimeout);
                if (mounted) setLoading(false);
            }
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!mounted) return;
            try {
                if (session?.user) {
                    const profile = await fetchProfile(session.user.id);
                    if (!mounted) return;
                    setUser({ ...session.user, ...profile });
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth state change error:", error);
                if (mounted) setUser(null);
            } finally {
                clearTimeout(safetyTimeout);
                if (mounted) setLoading(false);
            }
        });

        return () => {
            mounted = false;
            clearTimeout(safetyTimeout);
            subscription.unsubscribe();
        };
    }, []);

    const value = {
        user,
        loading,
        signOut: () => supabase.auth.signOut(),
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
