import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryOptions } from '../lib/queryOptions';
import { compareService } from '../services/compareService';
import { useAuth } from '../context/AuthContext';

export const useCompareData = ({
    initialRecentComparisons,
    initialTool1,
    initialTool2,
    initialAiResults
} = {}) => {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user, loading: authLoading } = useAuth();

    const comparisonSlug = params?.slug;

    // 1. Logic for extracting slugs
    let t1Slug = searchParams.get('t1');
    let t2Slug = searchParams.get('t2');

    useEffect(() => {
        if (t1Slug && t2Slug && !user && !authLoading) {
            router.replace(`/auth?redirect=/compare/${t1Slug}-vs-${t2Slug}`);
        }
    }, [t1Slug, t2Slug, user, authLoading, router]);

    if (comparisonSlug && comparisonSlug.includes('-vs-')) {
        const [p1, p2] = comparisonSlug.split('-vs-');
        if (p1 && p2) {
            t1Slug = p1;
            t2Slug = p2;
        }
    }

    const [localTool1, setLocalTool1] = useState(null);
    const [localTool2, setLocalTool2] = useState(null);
    const [isSelectingFor, setIsSelectingFor] = useState(null);

    // 2. React Query: Recent Comparisons
    const { data: recentComparisons = initialRecentComparisons || [], isLoading: isRecentLoading } = useQuery({
        ...queryOptions.home.comparisons(),
        initialData: initialRecentComparisons?.length > 0 ? initialRecentComparisons : undefined,
        initialDataUpdatedAt: initialRecentComparisons?.length > 0 ? Date.now() : undefined,
        staleTime: 1000 * 60 * 10
    });

    // 3. React Query: Tool 1
    const { data: tool1, isLoading: isTool1Loading, error: tool1Error } = useQuery({
        ...queryOptions.toolBySlug(t1Slug),
        initialData: (t1Slug === initialTool1?.slug && initialTool1) ? initialTool1 : undefined,
        initialDataUpdatedAt: (t1Slug === initialTool1?.slug && initialTool1) ? Date.now() : undefined,
    });

    // 4. React Query: Tool 2
    const { data: tool2, isLoading: isTool2Loading, error: tool2Error } = useQuery({
        ...queryOptions.toolBySlug(t2Slug),
        initialData: (t2Slug === initialTool2?.slug && initialTool2) ? initialTool2 : undefined,
        initialDataUpdatedAt: (t2Slug === initialTool2?.slug && initialTool2) ? Date.now() : undefined,
    });

    // 🏆 Instant UI Parity: Sync local states with fetched React Query results
    useEffect(() => {
        if (tool1) setLocalTool1(tool1);
    }, [tool1]);

    useEffect(() => {
        if (tool2) setLocalTool2(tool2);
    }, [tool2]);

    useEffect(() => {
        if (!t1Slug) setLocalTool1(null);
    }, [t1Slug]);

    useEffect(() => {
        if (!t2Slug) setLocalTool2(null);
    }, [t2Slug]);

    const activeT1 = localTool1?.slug || t1Slug;
    const activeT2 = localTool2?.slug || t2Slug;

    // 5. React Query: AI Dynamic Comparison
    const { data: aiResults = initialAiResults || null, isLoading: isAiLoading, error: queryAiError } = useQuery({
        queryKey: ['compare', 'ai', activeT1, activeT2],
        queryFn: async () => {
            const resAi = await fetch(`/api/generate-comparison?slug1=${activeT1}&slug2=${activeT2}`);
            if (!resAi.ok) {
                let errMsg = `AI API Error: ${resAi.status}`;
                try {
                    const text = await resAi.text();
                    try {
                        const errData = JSON.parse(text);
                        if (errData.error) errMsg = errData.error;
                    } catch {
                        if (text) errMsg = text;
                    }
                } catch { }
                throw new Error(errMsg);
            }
            const aiData = await resAi.json();
            if (aiData.error) throw new Error(aiData.error);
            return {
                ...aiData.data,
                source: aiData.source
            };
        },
        initialData: initialAiResults || undefined,
        initialDataUpdatedAt: initialAiResults ? Date.now() : undefined,
        enabled: !!activeT1 && !!activeT2,
        staleTime: 1000 * 60 * 60 * 24
    });

    const error = (tool1Error || tool2Error) ? (tool1Error?.message || tool2Error?.message) : null;
    const aiError = queryAiError ? queryAiError.message : null;

    const handleSelect = useCallback((tool) => {
        const currentSlot = isSelectingFor;
        let nextT1 = activeT1;
        let nextT2 = activeT2;

        queryClient.setQueryData(['tool', tool.slug], tool);

        if (currentSlot === 'tool1') {
            setLocalTool1(tool);
            nextT1 = tool.slug;
        } else if (currentSlot === 'tool2') {
            setLocalTool2(tool);
            nextT2 = tool.slug;
        }

        // Close/transition slot instantly (0ms lag)
        let nextSlot = null;
        if (currentSlot === 'tool1' && !nextT2) nextSlot = 'tool2';
        else if (currentSlot === 'tool2' && !nextT1) nextSlot = 'tool1';

        setIsSelectingFor(nextSlot);

        // Defer heavy Next.js routing to prevent main-thread freezing and click-drop
        setTimeout(() => {
            const isDynamicRoute = !!params?.slug;

            if (nextT1 && nextT2) {
                if (!user && !authLoading) {
                    router.replace(`/auth?redirect=/compare/${nextT1}-vs-${nextT2}`, { scroll: false });
                } else {
                    if (isDynamicRoute) {
                        router.replace(`/compare/${nextT1}-vs-${nextT2}`, { scroll: false });
                    } else {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set('t1', nextT1);
                        newParams.set('t2', nextT2);
                        router.replace(`/compare?${newParams.toString()}`, { scroll: false });
                    }
                }
            } else {
                const newParams = new URLSearchParams(searchParams);
                if (nextT1) newParams.set('t1', nextT1);
                else newParams.delete('t1');
                if (nextT2) newParams.set('t2', nextT2);
                else newParams.delete('t2');
                
                if (isDynamicRoute) {
                    router.replace(`/compare?${newParams.toString()}`, { scroll: false });
                } else {
                    router.replace(`/compare?${newParams.toString()}`, { scroll: false });
                }
            }
        }, 50);
    }, [isSelectingFor, searchParams, params?.slug, activeT1, activeT2, user, authLoading, router, queryClient, setLocalTool1, setLocalTool2]);

    const clearTool = useCallback((slot) => {
        if (slot === 'tool1') setLocalTool1(null);
        if (slot === 'tool2') setLocalTool2(null);

        const nextT1 = slot === 'tool1' ? null : activeT1;
        const nextT2 = slot === 'tool2' ? null : activeT2;

        setTimeout(() => {
            const isDynamicRoute = !!params?.slug;
            
            if (!nextT1 && !nextT2) {
                router.replace('/compare', { scroll: false });
            } else if (nextT1 && nextT2) {
                if (isDynamicRoute) {
                    router.replace(`/compare/${nextT1}-vs-${nextT2}`, { scroll: false });
                } else {
                    const newParams = new URLSearchParams();
                    newParams.set('t1', nextT1);
                    newParams.set('t2', nextT2);
                    router.replace(`/compare?${newParams.toString()}`, { scroll: false });
                }
            } else {
                const newParams = new URLSearchParams();
                if (nextT1) newParams.set('t1', nextT1);
                if (nextT2) newParams.set('t2', nextT2);
                router.replace(`/compare?${newParams.toString()}`, { scroll: false });
            }
        }, 50);
    }, [activeT1, activeT2, params?.slug, router, setLocalTool1, setLocalTool2]);

    const resetComparison = useCallback(() => {
        setLocalTool1(null);
        setLocalTool2(null);
        setTimeout(() => {
            router.replace('/compare', { scroll: false });
        }, 50);
    }, [router, setLocalTool1, setLocalTool2]);

    // Client-side SEO: Update tab title when interacting dynamically
    useEffect(() => {
        const t1Name = localTool1?.name || tool1?.name;
        const t2Name = localTool2?.name || tool2?.name;
        if (t1Name && t2Name) {
            document.title = `${t1Name} vs ${t2Name} - Expert AI Comparison | HUBly`;
        } else {
            document.title = 'Expert AI & SaaS Tool Comparison | HUBly Side-by-Side';
        }
    }, [localTool1?.name, tool1?.name, localTool2?.name, tool2?.name]);

    return {
        tool1: localTool1 || tool1,
        tool2: localTool2 || tool2,
        isTool1Loading: isTool1Loading && !localTool1,
        isTool2Loading: isTool2Loading && !localTool2,
        isSelectingFor,
        setIsSelectingFor,
        handleSelect,
        clearTool,
        resetComparison,
        openSelector: (slot) => setIsSelectingFor(slot),
        closeSelector: () => setIsSelectingFor(null),
        error,
        aiResults,
        isAiLoading,
        aiError,
        recentComparisons,
        isRecentLoading
    };
};
