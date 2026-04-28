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

    // Rule #34: Hydrate tool slots from URL dynamically
    useEffect(() => {
        const hydrateTool1 = async () => {
            if (!t1Slug) {
                setTool1(null);
                setIsTool1Loading(false);
                return;
            }
            if (tool1?.slug === t1Slug) return;
            
            setIsTool1Loading(true);
            try {
                const { data, error: fetchError } = await compareService.getToolBySlug(t1Slug);
                if (fetchError) throw fetchError;
                setTool1(data);
                setError(null);
            } catch (err) {
                console.error("Hydration Error Slot 1:", err);
                setError(err.message || "Failed to load tool");
            } finally {
                setIsTool1Loading(false);
            }
        };
        hydrateTool1();
    }, [t1Slug, tool1?.slug]);

    useEffect(() => {
        const hydrateTool2 = async () => {
            if (!t2Slug) {
                setTool2(null);
                setIsTool2Loading(false);
                return;
            }
            if (tool2?.slug === t2Slug) return;
            
            setIsTool2Loading(true);
            try {
                const { data, error: fetchError } = await compareService.getToolBySlug(t2Slug);
                if (fetchError) throw fetchError;
                setTool2(data);
                setError(null);
            } catch (err) {
                console.error("Hydration Error Slot 2:", err);
                setError(err.message || "Failed to load tool");
            } finally {
                setIsTool2Loading(false);
            }
        };
        hydrateTool2();
    }, [t2Slug, tool2?.slug]);

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
            const type = tool.pricing_type?.toLowerCase() || '';
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
        results: comparisonResults
    };
};
