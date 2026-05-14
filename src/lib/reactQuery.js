import { QueryClient } from '@tanstack/react-query';

/**
 * 🚀 Elite React Query Client Configuration
 * Rule #14: Global State Optimization
 * Rule #41: Performance-First Caching Strategy
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data is considered fresh for 5 minutes
            staleTime: 1000 * 60 * 5,
            // Keep inactive data in cache for 10 minutes
            gcTime: 1000 * 60 * 10,
            // Retry failed requests 2 times with exponential backoff
            retry: 2,
            // Prevent refetching on window focus (Elite Performance)
            refetchOnWindowFocus: false,
            // Better UX: Show cached data while refetching in background
            refetchOnMount: false,
        },
    },
});
