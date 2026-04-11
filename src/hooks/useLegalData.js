import { useState, useEffect } from 'react';

/**
 * Shared hook for legal pages (Privacy, Terms)
 * Manages simple loading states and common logic
 */
export const useLegalData = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    return { loading };
};
