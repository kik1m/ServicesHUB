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
        <div className="page-content-transition" key={pathname}>
            {children}
        </div>
    );
}
