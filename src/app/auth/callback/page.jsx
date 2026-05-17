'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import { useToast } from '../../../context/ToastContext';

export default function AuthCallbackPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [status, setStatus] = useState('Authenticating with Google...');

    useEffect(() => {
        // This runs ONLY on the client. 
        // Supabase client automatically looks for #access_token or ?code in the URL
        const handleAuthCallback = async () => {
            try {
                // If the URL has an error (e.g. user denied access)
                if (window.location.hash.includes('error_description')) {
                    const params = new URLSearchParams(window.location.hash.substring(1));
                    const errorDesc = params.get('error_description');
                    throw new Error(errorDesc?.replace(/\+/g, ' ') || 'Authentication failed');
                }

                // Get the session to force Supabase to process the URL fragment
                const { data, error } = await supabase.auth.getSession();
                
                if (error) throw error;

                if (data?.session) {
                    setStatus('Success! Redirecting to Dashboard...');
                    // Add a tiny delay to allow AuthContext to sync
                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 500);
                } else {
                    // No session found in URL
                    throw new Error("No authentication session found in the URL.");
                }

            } catch (err) {
                console.error('Auth Callback Error:', err);
                showToast(err.message || 'Authentication failed', 'error');
                router.push('/auth');
            }
        };

        handleAuthCallback();
    }, [router, showToast]);

    return (
        <div style={{
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            flexDirection: 'column',
            gap: '1rem',
            background: '#09090b',
            color: 'white',
            fontFamily: 'var(--font-geist-sans)'
        }}>
            <div className="spinner" style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(255,255,255,0.1)',
                borderTopColor: '#00a3ff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 500 }}>{status}</h2>
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
