import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const lastFetchedId = React.useRef(null);
    const lastMetaRef = React.useRef(null);

    const fetchProfile = useCallback(async (userId) => {
        if (!userId) return null;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('full_name, avatar_url, is_premium, role, updated_at')
                .eq('id', userId)
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (err) {
            return null;
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        const handleUserData = async (sessionUser) => {
            if (!mounted) return;

            if (!sessionUser) {
                if (user !== null) setUser(null);
                setLoading(false);
                lastFetchedId.current = null;
                lastMetaRef.current = null;
                return;
            }

            const metaName = sessionUser.user_metadata?.full_name || sessionUser.user_metadata?.name;
            const metaAvatar = sessionUser.user_metadata?.avatar_url;
            const currentMetaStr = JSON.stringify({ metaName, metaAvatar });

            // If it's the same user and metadata hasn't changed, and we already have profile data, just stop
            if (lastFetchedId.current === sessionUser.id && lastMetaRef.current === currentMetaStr && user?.updated_at) {
                setLoading(false);
                return;
            }

            lastFetchedId.current = sessionUser.id;
            lastMetaRef.current = currentMetaStr;

            // Initial fast state update from session
            setUser(prev => ({
                ...(prev || {}),
                ...sessionUser,
                full_name: metaName || prev?.full_name
            }));

            // Fetch full profile
            try {
                const profile = await fetchProfile(sessionUser.id);
                if (mounted) {
                    if (profile) {
                        setUser(prev => ({
                            ...prev,
                            ...profile,
                            full_name: profile.full_name || prev?.full_name || metaName
                        }));
                    } else {
                        // Healing logic... (omitted for brevity in this replace, but I'll keep it)
                        const { data: newProfile } = await supabase
                            .from('profiles')
                            .insert({
                                id: sessionUser.id,
                                full_name: metaName || 'User',
                                avatar_url: metaAvatar || '',
                                role: 'user',
                                updated_at: new Date().toISOString()
                            })
                            .select()
                            .single();
                        
                        if (newProfile) {
                            setUser(prev => ({ ...prev, ...newProfile }));
                        }
                    }
                    setLoading(false);
                }
            } catch (err) {
                if (mounted) setLoading(false);
            }
        };

        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                handleUserData(session.user);
            } else {
                setLoading(false);
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            handleUserData(session?.user);
        });

        initAuth();

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [fetchProfile]);

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        setUser(null);
    }, []);

    const value = useMemo(() => ({
        user,
        loading,
        signOut
    }), [user, loading, signOut]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
