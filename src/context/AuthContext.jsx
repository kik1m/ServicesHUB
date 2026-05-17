import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { emailTriggers } from '../utils/emailService';
import { notificationsService } from '../services/notificationsService';

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

            // --- ELITE WELCOME LOGIC (Email & Notification) ---
            try {
                if (sessionUser.created_at && typeof window !== 'undefined') {
                    const createdTime = new Date(sessionUser.created_at).getTime();
                    const nowTime = new Date().getTime();
                    const isNewUser = (nowTime - createdTime) < 60000; // 60 seconds
                    const welcomeFlagKey = `hubly_welcome_${sessionUser.id}`;
                    
                    if (isNewUser && !localStorage.getItem(welcomeFlagKey)) {
                        localStorage.setItem(welcomeFlagKey, 'true');
                        console.log("New user detected! Triggering Welcome Protocol...");
                        
                        // Fire Welcome Email (non-blocking)
                        if (sessionUser.email) {
                            emailTriggers.sendWelcome(sessionUser.email, metaName || 'Explorer').catch(console.error);
                        }
                        
                        // Fire Welcome Notification
                        notificationsService.createNotification({
                            userId: sessionUser.id,
                            title: 'Welcome to HUBly! 🎉',
                            message: 'Your elite journey starts here. Explore our premium AI directory.',
                            type: 'system',
                            link: '/dashboard'
                        }).catch(console.error);
                    }
                }
            } catch (err) {
                console.error("Welcome logic failed:", err);
            }
            // ------------------------------------------------

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
            // Check for PKCE ?code= parameter in URL (Next.js default for Supabase OAuth)
            if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                const code = url.searchParams.get('code');
                if (code) {
                    await supabase.auth.exchangeCodeForSession(code);
                    // Remove the code from the URL to prevent re-triggering
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            }

            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                handleUserData(session.user);
            } else {
                setLoading(false);
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            handleUserData(session?.user);
            
            // Smart Redirect: If user logs in via OAuth and Supabase drops them on the home page or auth page,
            // we catch the 'SIGNED_IN' event and forcefully teleport them to the Dashboard.
            if (event === 'SIGNED_IN' && session?.user && typeof window !== 'undefined') {
                const path = window.location.pathname;
                if (path === '/' || path === '/auth') {
                    window.location.href = '/dashboard';
                }
            }
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
