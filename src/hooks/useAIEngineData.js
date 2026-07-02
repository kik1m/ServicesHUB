import { useQuery } from '@tanstack/react-query';
import { queryOptions } from '../lib/queryOptions';
import { useMemo } from 'react';

/**
 * 🚀 Elite AI Engine Data Hook
 * Follows Rule #21 (Data Contract) and Rule #35 (Derived Data Stability)
 */
export const useAIEngineData = (t1Slug, t2Slug) => {
    // 1. React Query: Tool 1 Data
    const { 
        data: tool1, 
        isLoading: isTool1Loading,
        error: error1
    } = useQuery({
        ...queryOptions.toolBySlug(t1Slug),
        enabled: !!t1Slug,
        staleTime: 1000 * 60 * 60 // 1 hour
    });

    // 2. React Query: Tool 2 Data
    const { 
        data: tool2, 
        isLoading: isTool2Loading,
        error: error2
    } = useQuery({
        ...queryOptions.toolBySlug(t2Slug),
        enabled: !!t2Slug,
        staleTime: 1000 * 60 * 60 // 1 hour
    });

    // Compute derived state
    const isLoading = (!!t1Slug && isTool1Loading) || (!!t2Slug && isTool2Loading);
    const error = error1 || error2;

    // Rule #35: Memoized Return Payload
    const memoizedValue = useMemo(() => ({
        tool1,
        tool2,
        isLoading,
        error
    }), [tool1, tool2, isLoading, error]);

    return memoizedValue;
};
