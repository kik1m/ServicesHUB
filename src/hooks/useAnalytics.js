import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { logPageView } from '../services/analyticsService';
import { trackVisit } from '../utils/analytics';

/**
 * Hook to automatically track page views on route change.
 */
export const useAnalytics = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // 🚀 Rule #102: Initialize GA only once
        if (typeof window !== 'undefined' && !window.gtag) {
            const { initGA } = require('../services/analyticsService');
            initGA();
        }

        const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
        
        // External Analytics (Google)
        logPageView(url, document.title);
        
        // Internal Analytics (Supabase)
        trackVisit(url);
    }, [pathname, searchParams]);
};
