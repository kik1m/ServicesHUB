import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial session check
        const fetchProfile = async (userId) => {
            const { data } = await supabase.from('profiles').select('is_premium, role').eq('id', userId).single();
            return data || { is_premium: false, role: 'user' };
        };

        const initAuth = async () => {
            try {
                // EXTREME FALLBACK: Wrap getSession and fetchProfile in a 3s timeout.
                // If the user's browser is dropping the refresh_token request,
                // Supabase SDK infinitely freezes ALL queries. This shatters the lock.
                const authInitPromise = async () => {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.user) {
                        const profile = await fetchProfile(session.user.id);
                        return { session, profile };
                    }
                    return { session: null, profile: null };
                };

                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Auth init frozen (Timeout 8s)')), 8000)
                );

                const result = await Promise.race([authInitPromise(), timeoutPromise]);

                if (result.session?.user) {
                    setUser({ ...result.session.user, ...result.profile });
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth initialization corrupted or frozen. Forcing cache wipe.", error);
                
                // POISONED CACHE PURGE:
                let clearedAnything = false;
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('sb-')) {
                        localStorage.removeItem(key);
                        clearedAnything = true;
                    }
                });
                
                setUser(null);
                
                if (clearedAnything) {
                    // Only reload if we actually cleared corrupted tokens, to prevent infinite reload loops
                    window.location.reload();
                }
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const profile = await fetchProfile(session.user.id);
                setUser({ ...session.user, ...profile });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
