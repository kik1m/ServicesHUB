import { useState } from 'react';

/**
 * useCompareReviews - Logic Hook
 * Rule #1: Logic Isolation
 */
export const useCompareReviews = () => {
    const [activeTab, setActiveTab] = useState(1);

    return {
        activeTab,
        setActiveTab
    };
};
