import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { compareService } from '../services/compareService';
import { SCORING_WEIGHTS, REVIEWS_THRESHOLDS, PRICING_MULTIPLIERS } from '../constants/compareConstants';

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
    useEffect(() => {
        const hydrateAll = async () => {
            if (!t1Slug && !t2Slug) {
                setTool1(null);
                setTool2(null);
                setAiResults(null);
                setIsTool1Loading(false);
                setIsTool2Loading(false);
                setIsAiLoading(false);
                return;
            }

            // Start all requests in parallel
            const tool1Promise = t1Slug ? compareService.getToolBySlug(t1Slug) : Promise.resolve({ data: null });
            const tool2Promise = t2Slug ? compareService.getToolBySlug(t2Slug) : Promise.resolve({ data: null });
            
            // Note: AI comparison needs slugs, but doesn't strictly need the hydrated tool objects yet
            const aiPromise = (t1Slug && t2Slug) ? fetch(`/api/generate-comparison?slug1=${t1Slug}&slug2=${t2Slug}`) : Promise.resolve(null);

            if (t1Slug) setIsTool1Loading(true);
            if (t2Slug) setIsTool2Loading(true);
            if (t1Slug && t2Slug) setIsAiLoading(true);

        try {
                const [res1, res2] = await Promise.all([tool1Promise, tool2Promise]);

                // Handle Tool 1
                if (res1.data) setTool1(res1.data);
                if (res1.error) throw res1.error;

                // Handle Tool 2
                if (res2.data) setTool2(res2.data);
                if (res2.error) throw res2.error;

                setError(null);
            } catch (err) {
                console.error("Tool Hydration Error:", err);
                setError(err.message || "Failed to load tool data");
            } finally {
                setIsTool1Loading(false);
                setIsTool2Loading(false);
            }

            // Handle AI Result independently so tool errors don't block it and vice versa
            if (t1Slug && t2Slug) {
                try {
                    const resAi = await aiPromise;
                    if (resAi) {
                        if (!resAi.ok) {
                            let errMsg = `AI API Error: ${resAi.status}`;
                            try {
                                const errData = await resAi.json();
                                if (errData.error) errMsg = errData.error;
                            } catch(e) {
                                const errorText = await resAi.text();
                                if (errorText) errMsg = errorText;
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
                setIsAiLoading(false);
            }
        };

        hydrateAll();
    }, [t1Slug, t2Slug]);


    // Rule #116: Logic Isolation - Comparison Calculation Engine
    const comparisonResults = useMemo(() => {
        if (!tool1 || !tool2) return null;

        const featuresA = tool1.features || [];
        const featuresB = tool2.features || [];

        const uniqueToA = featuresA.filter(f => !featuresB.includes(f));
        const uniqueToB = featuresB.filter(f => !featuresA.includes(f));
        const sharedFeatures = featuresA.filter(f => featuresB.includes(f));

        const rating1 = parseFloat(tool1.rating) || 5.0;
        const rating2 = parseFloat(tool2.rating) || 5.0;
        const ratingWinner = rating1 > rating2 ? 1 : rating1 < rating2 ? 2 : 0;

        const reviews1 = tool1.reviews_count || 0;
        const reviews2 = tool2.reviews_count || 0;
        const reviewsWinner = reviews1 > reviews2 ? 1 : reviews1 < reviews2 ? 2 : 0;

        const getPricingFactor = (tool) => {
            const details = tool.pricing_details || '';
            const type = tool.pricing_type?.toLowerCase() || '';
            
            // 🧠 Elite Parsing Engine (V2)
            // 1. Try to parse numeric price (supports $20, 20$, .01, etc.)
            const priceMatch = details.match(/(?:\$|£|€)?\s*(\d+(?:\.\d+)?)\s*(?:\$|£|€)?/);
            
            if (priceMatch) {
                const price = parseFloat(priceMatch[1]);
                const lowDetails = details.toLowerCase();

                // Logic A: Monthly subscription
                if (lowDetails.includes('/mo') || lowDetails.includes('per month') || lowDetails.includes('monthly')) {
                    return price * 12;
                }
                
                // Logic B: Usage-based (e.g. .01 per min)
                // We assume a "Standard Professional Usage" of 500 mins/year for TCO estimation
                if (lowDetails.includes('per min') || lowDetails.includes('/min')) {
                    return Math.max(price * 500 * 12, PRICING_MULTIPLIERS.DEFAULT); 
                }

                // Logic C: Small numbers usually imply usage/per-unit
                if (price < 1 && price > 0) {
                    return PRICING_MULTIPLIERS.DEFAULT;
                }

                return price; // Assume yearly if it's a large number
            }

            // 2. Fallback to intelligent multipliers
            if (type.includes('free') && !type.includes('mium')) return PRICING_MULTIPLIERS.FREE;
            if (type.includes('open source')) return PRICING_MULTIPLIERS.OPEN_SOURCE;
            if (type.includes('freemium')) return PRICING_MULTIPLIERS.FREEMIUM;
            if (type.includes('paid') || type.includes('premium')) return PRICING_MULTIPLIERS.PAID;
            if (type.includes('enterprise')) return PRICING_MULTIPLIERS.ENTERPRISE;
            
            return PRICING_MULTIPLIERS.DEFAULT;
        };



        const factor1 = getPricingFactor(tool1);
        const factor2 = getPricingFactor(tool2);

        const calculateConfidenceScore = (tool, uniqueCount, otherUniqueCount) => {
            let score = 0;
            const rating = parseFloat(tool.rating) || 0;
            score += (rating / 5) * SCORING_WEIGHTS.RATING_MAX;
            if (tool.is_verified) score += SCORING_WEIGHTS.VERIFIED_BONUS;
            const reviews = tool.reviews_count || 0;
            if (reviews > REVIEWS_THRESHOLDS.HIGH) score += SCORING_WEIGHTS.REVIEWS_MAX;
            else if (reviews > REVIEWS_THRESHOLDS.MEDIUM) score += 10;
            else if (reviews > REVIEWS_THRESHOLDS.LOW) score += 5;
            const totalDifferential = uniqueCount + otherUniqueCount;
            if (totalDifferential > 0) score += (uniqueCount / totalDifferential) * SCORING_WEIGHTS.FEATURE_DOMINANCE_MAX;
            else score += SCORING_WEIGHTS.EQUAL_FEATURES_DEFAULT;
            return Math.min(Math.round(score), 100);
        };

        const score1 = calculateConfidenceScore(tool1, uniqueToA.length, uniqueToB.length);
        const score2 = calculateConfidenceScore(tool2, uniqueToB.length, uniqueToA.length);
        const overallWinner = score1 > score2 ? 1 : score1 < score2 ? 2 : 0;

        return {
            uniqueToA,
            uniqueToB,
            sharedFeatures,
            rating1,
            rating2,
            ratingWinner,
            reviews1,
            reviews2,
            reviewsWinner,
            factor1,
            factor2,
            score1,
            score2,
            overallWinner
        };
    }, [tool1, tool2]);

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
        results: comparisonResults,
        aiResults,
        isAiLoading,
        aiError
    };
};
