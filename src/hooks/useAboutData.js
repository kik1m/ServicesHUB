import { useState, useEffect } from 'react';

/**
 * Hook for managing the About page state and loading behavior
 */
export const useAboutData = () => {
    const [loading, setLoading] = useState(true);

    // Simulate initial loading as in the original page
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    return {
        loading
    };
};
