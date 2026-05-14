import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { compareService } from '../services/compareService';

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

    const comparisonSlug = params?.slug;
    
    // 1. Logic for extracting slugs
    let t1Slug = searchParams.get('t1');
    let t2Slug = searchParams.get('t2');

    if (comparisonSlug && comparisonSlug.includes('-vs-')) {
        const [p1, p2] = comparisonSlug.split('-vs-');
        if (p1 && p2) {
            t1Slug = p1;
            t2Slug = p2;
        }
    }

    const [isSelectingFor, setIsSelectingFor] = useState(null);

    // 2. React Query: Recent Comparisons
    const { data: recentComparisons = initialRecentComparisons || [], isLoading: isRecentLoading } = useQuery({
        queryKey: ['compare', 'recent'],
        queryFn: async () => {
            const { data } = await compareService.getRecentComparisons();
            return data || [];
        },
        initialData: initialRecentComparisons,
        staleTime: 1000 * 60 * 10 
    });

    // 3. React Query: Tool 1
    const { data: tool1, isLoading: isTool1Loading, error: tool1Error } = useQuery({
        queryKey: ['tool', t1Slug],
        queryFn: async () => {
            const { data, error } = await compareService.getToolBySlug(t1Slug);
            if (error) throw error;
            return data;
        },
        initialData: t1Slug === initialTool1?.slug ? initialTool1 : undefined,
        enabled: !!t1Slug,
        staleTime: 1000 * 60 * 60 * 24
    });

    // 4. React Query: Tool 2
    const { data: tool2, isLoading: isTool2Loading, error: tool2Error } = useQuery({
        queryKey: ['tool', t2Slug],
        queryFn: async () => {
            const { data, error } = await compareService.getToolBySlug(t2Slug);
            if (error) throw error;
            return data;
        },
        initialData: t2Slug === initialTool2?.slug ? initialTool2 : undefined,
        enabled: !!t2Slug,
        staleTime: 1000 * 60 * 60 * 24
    });

    // 5. React Query: AI Dynamic Comparison
    const { data: aiResults = initialAiResults || null, isLoading: isAiLoading, error: queryAiError } = useQuery({
        queryKey: ['compare', 'ai', t1Slug, t2Slug],
        queryFn: async () => {
            const resAi = await fetch(`/api/generate-comparison?slug1=${t1Slug}&slug2=${t2Slug}`);
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
        initialData: initialAiResults,
        enabled: !!t1Slug && !!t2Slug,
        staleTime: 1000 * 60 * 60 * 24
    });

    const error = (tool1Error || tool2Error) ? (tool1Error?.message || tool2Error?.message) : null;
    const aiError = queryAiError ? queryAiError.message : null;

    useEffect(() => {
        if (t1Slug && !t2Slug && !isSelectingFor) {
            setIsSelectingFor('tool2');
        }
    }, [t1Slug, t2Slug, isSelectingFor]); 

    const handleSelect = useCallback((tool) => {
        const currentSlot = isSelectingFor;
        let nextT1 = t1Slug;
        let nextT2 = t2Slug;

        queryClient.setQueryData(['tool', tool.slug], tool);

        if (currentSlot === 'tool1') {
            nextT1 = tool.slug;
        } else if (currentSlot === 'tool2') {
            nextT2 = tool.slug;
        }

        if (nextT1 && nextT2) {
            router.replace(`/compare/${nextT1}-vs-${nextT2}`);
        } else {
            const params = new URLSearchParams(searchParams);
            if (nextT1) params.set('t1', nextT1);
            else params.delete('t1');
            if (nextT2) params.set('t2', nextT2);
            else params.delete('t2');
            router.replace(`/compare?${params.toString()}`);
        }

        let nextSlot = null;
        if (currentSlot === 'tool1' && !nextT2) nextSlot = 'tool2';
        else if (currentSlot === 'tool2' && !nextT1) nextSlot = 'tool1';
        
        setIsSelectingFor(nextSlot);
    }, [isSelectingFor, searchParams, t1Slug, t2Slug, router, queryClient]);

    const clearTool = useCallback((slot) => {
        const nextT1 = slot === 'tool1' ? null : t1Slug;
        const nextT2 = slot === 'tool2' ? null : t2Slug;

        if (!nextT1 && !nextT2) {
            router.replace('/compare');
        } else if (nextT1 && nextT2) {
            router.replace(`/compare/${nextT1}-vs-${nextT2}`);
        } else {
            const params = new URLSearchParams();
            if (nextT1) params.set('t1', nextT1);
            if (nextT2) params.set('t2', nextT2);
            router.replace(`/compare?${params.toString()}`);
        }
    }, [t1Slug, t2Slug, router]);

    const resetComparison = useCallback(() => {
        router.replace('/compare');
    }, [router]);

    return {
        tool1,
        tool2,
        isTool1Loading,
        isTool2Loading,
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
