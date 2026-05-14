'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }) {
    const pathname = usePathname();

    useEffect(() => {
        // Force scroll to absolute top on every route change
        const scrollTimer = setTimeout(() => {
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'instant'
                });
            });
        }, 10);

        return () => clearTimeout(scrollTimer);
    }, [pathname]);

    return (
        <>
            {/* The Veil: A full-screen overlay that fades out to reveal the new page.
                Using key={pathname} forces it to remount on every route change.
                This provides a smooth transition WITHOUT breaking backdrop-filter! */}
            <div 
                key={pathname + '-veil'} 
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'var(--background, #0f111a)', // Fallback to your dark background
                    zIndex: 99999, // Above everything
                    pointerEvents: 'none', // Allow clicks to pass through
                    animation: 'veilFadeOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                }}
            />
            
            {/* The actual page content is rendered completely normally, preserving all CSS contexts */}
            <div style={{ width: '100%' }}>
                {children}
            </div>
        </>
    );
}
