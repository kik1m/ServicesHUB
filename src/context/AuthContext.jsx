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
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Auth init timeout: Supabase connection is too slow or frozen.')), 8000)
                );

                const authTask = async () => {
                    const { data: { session }, error } = await supabase.auth.getSession();
                    if (error) console.error("Auth session fetch error:", error);

                    if (session?.user) {
                        const profile = await fetchProfile(session.user.id);
                        return { session, profile };
                    }
                    return null;
                };

                const result = await Promise.race([authTask(), timeoutPromise]);

                if (result) {
                    setUser({ ...result.session.user, ...result.profile });
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.warn("Auth check failed or timed out. Defaulting to logged-out state.", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            try {
                if (session?.user) {
                    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Profile fetch timeout')), 8000));
                    const profile = await Promise.race([fetchProfile(session.user.id), timeoutPromise]);
                    setUser({ ...session.user, ...profile });
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.warn("Auth state change error:", err);
                setUser(session?.user ? session.user : null);
            } finally {
                setLoading(false);
            }
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
