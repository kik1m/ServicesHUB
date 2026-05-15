import { useState, useEffect, useMemo } from 'react';

/**
 * useComparisonMatrix - Logic Hook
 * Extracted from ComparisonMatrix Elite v5.0
 */
export const useComparisonMatrix = (tool1, tool2, isAiLoading, aiResults) => {
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState(1); // For mobile switcher

    // Derive winner from AI verdict
    const aiWinner = aiResults?.verdict?.winner;
    const tool1IsWinner = !!(aiResults && tool1?.name && aiWinner === tool1.name);
    const tool2IsWinner = !!(aiResults && tool2?.name && aiWinner === tool2.name);

    // Lightweight display score fallback
    const calculateDisplayScore = (tool) => {
        if (!tool) return 0;
        let score = Math.round(((parseFloat(tool?.rating) || 0) / 5) * 55);
        if (tool?.is_verified) score += 20;
        const r = tool?.reviews_count || 0;
        if (r > 500) score += 25;
        else if (r > 100) score += 15;
        else if (r > 10) score += 10;
        else score += 5;
        return Math.min(score, 100);
    };

    // Scores logic
    const aiScore1 = aiResults?.scores?.tool1;
    const aiScore2 = aiResults?.scores?.tool2;
    const score1 = isAiLoading ? 80 : ((aiScore1 != null) ? aiScore1 : calculateDisplayScore(tool1));
    const score2 = isAiLoading ? 80 : ((aiScore2 != null) ? aiScore2 : calculateDisplayScore(tool2));

    // Winner & Metadata
    const displayWinner = tool1IsWinner ? 1 : tool2IsWinner ? 2 : (score1 > score2 ? 1 : score1 < score2 ? 2 : 0);
    const isScoreFromAI = aiScore1 != null && aiScore2 != null;

    // Loading messages logic
    const LOADING_MESSAGES = [
        "AI Analyst is distilling strategic insights...",
        "Deep-scanning feature vectors for both tools...",
        "Synthesizing comparative capability matrix...",
        "Calculating TCO scaling dynamics...",
        "Generating objective expert verdict...",
        "Aligning dimensional analysis with industry standards..."
    ];

    const loadingMessage = LOADING_MESSAGES[loadingMessageIndex];

    useEffect(() => {
        if (isAiLoading) {
            const interval = setInterval(() => {
                setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [isAiLoading, LOADING_MESSAGES.length]);

    // Fallback Matrix Logic
    const fallbackMatrix = useMemo(() => {
        if (!tool1 || !tool2) return null;
        
        const f1 = tool1.features || [];
        const f2 = tool2.features || [];
        const uniqueTo1 = f1.filter(f => !f2.includes(f));
        const uniqueTo2 = f2.filter(f => !f1.includes(f));
        const shared = f1.filter(f => f2.includes(f));
        
        const combined = [...uniqueTo1.slice(0, 2), ...uniqueTo2.slice(0, 2), ...shared.slice(0, 1)];
        while (combined.length < 5 && (f1.length > 0 || f2.length > 0)) {
            const nextFeat = [...f1, ...f2].find(f => !combined.includes(f));
            if (!nextFeat) break;
            combined.push(nextFeat);
        }

        if (combined.length === 0) return null;

        return combined.map(feat => {
            const has1 = f1.includes(feat);
            const has2 = f2.includes(feat);
            return {
                feature: feat,
                tool1_value: has1 ? "Available" : "Not Supported",
                tool2_value: has2 ? "Available" : "Not Supported",
                winner: (has1 && !has2) ? 1 : (has2 && !has1) ? 2 : 0,
                insight: "Standard Database Feature"
            };
        });
    }, [tool1, tool2]);

    return {
        activeTab,
        setActiveTab,
        loadingMessage,
        tool1IsWinner,
        tool2IsWinner,
        score1,
        score2,
        displayWinner,
        isScoreFromAI,
        fallbackMatrix
    };
};
