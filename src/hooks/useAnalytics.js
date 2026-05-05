import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logPageView } from '../services/analyticsService';

/**
 * Hook to automatically track page views on route change.
 */
export const useAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        // Log the page view with the current path and document title
        logPageView(location.pathname + location.search, document.title);
    }, [location]);
};
