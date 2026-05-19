'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * PageBodyClass — Sets data-page attribute on <html> based on current route.
 * Used to scope CSS rules (like the dynamic halo) to specific pages only.
 */
export default function PageBodyClass() {
    const pathname = usePathname();

    useEffect(() => {
        const isHome = pathname === '/';
        document.documentElement.setAttribute('data-page', isHome ? 'home' : 'other');
    }, [pathname]);

    return null;
}
