import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';

/**
 * 🚀 Elite React Query Client — v2.0 (10/10 Standard)
 * Rule #14: Global State Optimization
 * Rule #41: Performance-First Caching Strategy
 */
export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => {
            if (error?.status === 401 || error?.message?.toLowerCase().includes('jwt expired')) {
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('auth:jwt-expired'));
                }
            }
        },
    }),
    mutationCache: new MutationCache({
        onError: (error) => {
            if (error?.status === 401 || error?.message?.toLowerCase().includes('jwt expired')) {
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('auth:jwt-expired'));
                }
            }
        },
    }),
    defaultOptions: {
        queries: {
            // Data considered fresh for 5 minutes globally
            staleTime: 1000 * 60 * 5,
            // Keep unused data in memory for 30 minutes (navigation-friendly)
            gcTime: 1000 * 60 * 30,
            // ✅ FIX: 'stale' = refetch only if data is stale, not always false
            // This ensures Dashboard/Notifications stay fresh while static pages stay cached
            refetchOnMount: 'stale',
            // No wasted requests when user tabs back in
            refetchOnWindowFocus: false,
            // Retry with exponential backoff
            retry: 2,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
        },
    },
});
