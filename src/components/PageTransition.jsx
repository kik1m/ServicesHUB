'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }) {
    const pathname = usePathname();

    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        setIsAnimating(true);
        // Remove the animation class after it finishes (350ms) to restore backdrop-filter
        const animTimer = setTimeout(() => setIsAnimating(false), 350);

        const scrollTimer = setTimeout(() => {
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'instant'
                });
            });
        }, 10);

        return () => {
            clearTimeout(animTimer);
            clearTimeout(scrollTimer);
        };
    }, [pathname]);

    return (
        <div 
            key={pathname} 
            style={isAnimating ? { animation: 'fadeIn 0.35s ease-out forwards', width: '100%' } : { width: '100%' }}
        >
            {children}
        </div>
    );
}
