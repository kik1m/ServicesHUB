'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }) {
    const pathname = usePathname();

    useEffect(() => {
        // Elite UX Rule: Force scroll to absolute top on every route change
        // We use setTimeout and requestAnimationFrame to guarantee execution AFTER React has committed the DOM
        const timer = setTimeout(() => {
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'instant' // 'instant' prevents the visual jump that 'smooth' causes on long pages
                });
            });
        }, 10);

        return () => clearTimeout(timer);
    }, [pathname]);

    // key={pathname} forces React to unmount the old page and mount the new one,
    // triggering the fadeIn animation every time the route changes.
    return (
        <div key={pathname} style={{ animation: 'fadeIn 0.35s ease-out forwards', width: '100%' }}>
            {children}
        </div>
    );
}
