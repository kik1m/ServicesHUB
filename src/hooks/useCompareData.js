import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { compareService } from '../services/compareService';

/**
 * Hook for managing comparison page state and logic
 * Elite Refactor: 100% URL-Synchronized (SSOT)
 * Responsibility: Slot Hydration, Selection State, and Parameter Sync.
 */
export const useCompareData = () => {
    const { comparisonSlug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    // 1. Logic for extracting slugs (Priority: Static Path > Query Params)
    let t1Slug = searchParams.get('t1');
    let t2Slug = searchParams.get('t2');

    if (comparisonSlug && comparisonSlug.includes('-vs-')) {
        const [p1, p2] = comparisonSlug.split('-vs-');
        if (p1 && p2) {
            t1Slug = p1;
            t2Slug = p2;
        }
    }

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
    const [recentComparisons, setRecentComparisons] = useState([]);
    const [isRecentLoading, setIsRecentLoading] = useState(false);
    
    // Fetch recent comparisons on mount
    useEffect(() => {
        const fetchRecent = async () => {
            setIsRecentLoading(true);
            const { data } = await compareService.getRecentComparisons();
            setRecentComparisons(data || []);
            setIsRecentLoading(false);
        };
        fetchRecent();
    }, []);

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

    // Rule #48: Auto-Selector UX (Open slot 2 if slot 1 is pre-hydrated via URL)
    useEffect(() => {
        if (t1Slug && !t2Slug && !isSelectingFor) {
            setIsSelectingFor('tool2');
        }
    }, []); // Only on mount

    // Tool selection and URL sync logic below

    const navigate = useNavigate();

    // Handle tool selection by modifying the URL parameters or path (SSOT)
    const handleSelect = useCallback((tool) => {
        const currentSlot = isSelectingFor;
        
        let nextT1 = t1Slug;
        let nextT2 = t2Slug;

        if (currentSlot === 'tool1') {
            nextT1 = tool.slug;
            setTool1(tool);
        } else if (currentSlot === 'tool2') {
            nextT2 = tool.slug;
            setTool2(tool);
        }

        // If both tools are present, use the static "vs" route
        if (nextT1 && nextT2) {
            navigate(`/compare/${nextT1}-vs-${nextT2}`, { replace: true });
        } else {
            // Otherwise fallback to query params for single selection
            const newParams = new URLSearchParams(searchParams);
            if (nextT1) newParams.set('t1', nextT1);
            else newParams.delete('t1');
            
            if (nextT2) newParams.set('t2', nextT2);
            else newParams.delete('t2');

            setSearchParams(newParams, { replace: true });
        }

        // Auto-advance logic
        let nextSlot = null;
        if (currentSlot === 'tool1' && !nextT2) nextSlot = 'tool2';
        else if (currentSlot === 'tool2' && !nextT1) nextSlot = 'tool1';
        
        setIsSelectingFor(nextSlot);
    }, [isSelectingFor, searchParams, setSearchParams, t1Slug, t2Slug, navigate]);

    const clearTool = useCallback((slot) => {
        const nextT1 = slot === 'tool1' ? null : t1Slug;
        const nextT2 = slot === 'tool2' ? null : t2Slug;

        if (!nextT1 && !nextT2) {
            navigate('/compare', { replace: true });
        } else if (nextT1 && nextT2) {
            navigate(`/compare/${nextT1}-vs-${nextT2}`, { replace: true });
        } else {
            // If only one tool remains, fallback to query params at /compare
            const newParams = new URLSearchParams();
            if (nextT1) newParams.set('t1', nextT1);
            if (nextT2) newParams.set('t2', nextT2);
            navigate(`/compare?${newParams.toString()}`, { replace: true });
        }
    }, [t1Slug, t2Slug, navigate]);

    const resetComparison = useCallback(() => {
        navigate('/compare', { replace: true });
    }, [navigate]);

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
        aiError,
        recentComparisons,
        isRecentLoading
    };
};
