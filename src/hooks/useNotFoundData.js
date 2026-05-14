import { useState, useEffect } from 'react';

/**
 * Hook for managing NotFound page loading state
 */
export const useNotFoundData = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 400);
        return () => clearTimeout(timer);
    }, []);

    return { loading };
};
