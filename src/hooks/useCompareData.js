import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { compareService } from '../services/compareService';

/**
 * Hook for managing comparison page state and logic
 * Elite Refactor: 100% URL-Synchronized (SSOT)
 * Responsibility: Slot Hydration, Selection State, and Parameter Sync.
 */
export const useCompareData = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const t1Slug = searchParams.get('t1');
    const t2Slug = searchParams.get('t2');

    const [tool1, setTool1] = useState(null);
    const [tool2, setTool2] = useState(null);

    // UI Loading states independent of search modal
    const [isTool1Loading, setIsTool1Loading] = useState(!!t1Slug);
    const [isTool2Loading, setIsTool2Loading] = useState(!!t2Slug);

    const [isSelectingFor, setIsSelectingFor] = useState(null); // 'tool1' | 'tool2'
    const [error, setError] = useState(null);

    // AI Dynamic Results State
    const [aiResults, setAiResults] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);

    // 🧠 Elite Parallel Hydration (V4)
    // Rule #17: Progressive Rendering - Fetch tools and AI in parallel if slugs exist
    const prevT1Slug = useRef(null);
    const prevT2Slug = useRef(null);

    useEffect(() => {
        const hydrateAll = async () => {
            const t1Changed = t1Slug !== prevT1Slug.current;
            const t2Changed = t2Slug !== prevT2Slug.current;

            if (!t1Changed && !t2Changed) return; // Nothing to do

            if (!t1Slug && !t2Slug) {
                setTool1(null);
                setTool2(null);
                setAiResults(null);
                setIsTool1Loading(false);
                setIsTool2Loading(false);
                setIsAiLoading(false);
                prevT1Slug.current = null;
                prevT2Slug.current = null;
                return;
            }

            // Start all requests in parallel
            const tool1Promise = (t1Slug && t1Changed) ? compareService.getToolBySlug(t1Slug) : Promise.resolve({ data: null });
            const tool2Promise = (t2Slug && t2Changed) ? compareService.getToolBySlug(t2Slug) : Promise.resolve({ data: null });
            
            // Note: AI comparison needs slugs, but doesn't strictly need the hydrated tool objects yet
            const aiPromise = (t1Slug && t2Slug && (t1Changed || t2Changed)) ? fetch(`/api/generate-comparison?slug1=${t1Slug}&slug2=${t2Slug}`) : Promise.resolve(null);

            if (t1Slug && t1Changed) setIsTool1Loading(true);
            if (t2Slug && t2Changed) setIsTool2Loading(true);
            if (t1Slug && t2Slug && (t1Changed || t2Changed)) setIsAiLoading(true);

            try {
                const [res1, res2] = await Promise.all([tool1Promise, tool2Promise]);

                // Handle Tool 1
                if (t1Slug) {
                    if (t1Changed) {
                        if (res1.error) throw res1.error;
                        if (res1.data) setTool1(res1.data);
                    }
                } else {
                    setTool1(null);
                }

                // Handle Tool 2
                if (t2Slug) {
                    if (t2Changed) {
                        if (res2.error) throw res2.error;
                        if (res2.data) setTool2(res2.data);
                    }
                } else {
                    setTool2(null);
                }

                setError(null);
            } catch (err) {
                console.error("Tool Hydration Error:", err);
                setError(err.message || "Failed to load tool data");
            } finally {
                if (t1Changed) setIsTool1Loading(false);
                if (t2Changed) setIsTool2Loading(false);
            }

            // Handle AI Result independently so tool errors don't block it and vice versa
            if (t1Slug && t2Slug) {
                try {
                    const resAi = await aiPromise;
                    if (resAi) {
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
                            } catch {
                                // fallback to default status error if text extraction fails
                            }
                            setAiError(errMsg);
                        } else {
                            const aiData = await resAi.json();
                            if (aiData.error) {
                                setAiError(aiData.error);
                            } else {
                                setAiResults({
                                    ...aiData.data,
                                    source: aiData.source
                                });
                                setAiError(null);
                            }
                        }
                    }
                } catch (aiErr) {
                    console.error("AI Hydration Error:", aiErr);
                    setAiError(aiErr.message || 'Failed to load AI analysis');
                } finally {
                    setIsAiLoading(false);
                }
            } else {
                setAiResults(null);
                setAiError(null);
                setIsAiLoading(false);
            }

            // Update refs after successful run
            prevT1Slug.current = t1Slug;
            prevT2Slug.current = t2Slug;
        };

        hydrateAll();
    }, [t1Slug, t2Slug]);

    // Tool selection and URL sync logic below

    // Handle tool selection by modifying the URL parameters (SSOT)
    const handleSelect = useCallback((tool) => {
        const newParams = new URLSearchParams(searchParams);
        const currentSlot = isSelectingFor;
        let nextSlot = null;

        if (currentSlot === 'tool1') {
            newParams.set('t1', tool.slug);
            setTool1(tool);
            if (!t2Slug) nextSlot = 'tool2';
        } else if (currentSlot === 'tool2') {
            newParams.set('t2', tool.slug);
            setTool2(tool);
            if (!t1Slug) nextSlot = 'tool1';
        }

        setSearchParams(newParams, { replace: true });
        setIsSelectingFor(nextSlot);
    }, [isSelectingFor, searchParams, setSearchParams, t1Slug, t2Slug]);

    const clearTool = useCallback((slot) => {
        const newParams = new URLSearchParams(searchParams);
        if (slot === 'tool1') newParams.delete('t1');
        if (slot === 'tool2') newParams.delete('t2');
        setSearchParams(newParams, { replace: true });
    }, [searchParams, setSearchParams]);

    const resetComparison = useCallback(() => {
        setSearchParams(new URLSearchParams(), { replace: true });
    }, [setSearchParams]);

    const openSelector = useCallback((slot) => {
        setIsSelectingFor(slot);
    }, []);

    const closeSelector = useCallback(() => {
        setIsSelectingFor(null);
    }, []);

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
        openSelector,
        closeSelector,
        error,
        results: null,
        aiResults,
        isAiLoading,
        aiError
    };
};
