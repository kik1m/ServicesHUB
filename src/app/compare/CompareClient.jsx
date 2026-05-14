'use client';

import React, { useCallback, useMemo } from 'react';
import { RefreshCcw, Share2 } from 'lucide-react';
import { useCompareData } from '../../hooks/useCompareData';
import { useBannerData } from '../../hooks/useBannerData';

// Import Global UI Components
import PageHero from '../../components/ui/PageHero';
import Safeguard from '../../components/ui/Safeguard';
import SmartBanner from '../../components/SmartBanner';
import ToolCompareColumn from '../../components/Compare/ToolCompareColumn';
import ComparisonMatrix from '../../components/Compare/ComparisonMatrix';
import CompareBuilder from '../../components/Compare/CompareBuilder';
import RecentComparisons from '../../components/Compare/RecentComparisons';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

// Import Constants & Styles
import { COMPARE_UI_CONSTANTS } from '../../constants/compareConstants';
import styles from './Compare.module.css';

/**
 * CompareClient - Next.js Interactive Layer
 * Rule #1: Logic Isolation via useCompareData
 */
export default function CompareClient({ 
    initialRecentComparisons, 
    bannerTools,
    initialTool1,
    initialTool2,
    initialAiResults
}) {
    const { addToast } = useToast();
    const banner = useBannerData(bannerTools);
    
    const {
        tool1,
        tool2,
        isTool1Loading,
        isTool2Loading,
        isSelectingFor,
        handleSelect,
        clearTool,
        resetComparison,
        openSelector,
        closeSelector,
        setIsSelectingFor,
        error,
        aiResults,
        isAiLoading,
        aiError,
        recentComparisons,
        isRecentLoading
    } = useCompareData({ 
        initialRecentComparisons,
        initialTool1,
        initialTool2,
        initialAiResults
    });

    const handleClearTool1 = useCallback(() => clearTool('tool1'), [clearTool]);
    const handleClearTool2 = useCallback(() => clearTool('tool2'), [clearTool]);
    const handleOpenSelector1 = useCallback(() => openSelector('tool1'), [openSelector]);
    const handleOpenSelector2 = useCallback(() => openSelector('tool2'), [openSelector]);

    const isPageLoading = isTool1Loading || isTool2Loading;
    const isComparisonReady = tool1?.id && tool2?.id && !isPageLoading;

    const handleShare = () => {
        if (!tool1?.slug || !tool2?.slug) return;
        const shareUrl = `${window.location.origin}/compare/${tool1.slug}-vs-${tool2.slug}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            addToast('success', 'Comparison link copied to clipboard!');
        });
    };

    return (
        <main className={styles.compareView}>
            {/* Rule #12: SmartBanner receives data from server-side hydration and managed by hook */}
            <SmartBanner 
                tools={banner.tools}
                currentIndex={banner.currentIndex}
                isLoading={banner.loading}
                error={banner.error}
                next={banner.next}
                prev={banner.prev}
                onRetry={() => banner.setCurrentIndex(0)}
            />
            
            <PageHero 
                title={COMPARE_UI_CONSTANTS.hero.title} 
                highlight={COMPARE_UI_CONSTANTS.hero.highlight} 
                isLoading={false}
                breadcrumbs={COMPARE_UI_CONSTANTS.hero.breadcrumbs}
                subtitle={COMPARE_UI_CONSTANTS.hero.subtitle}
            />

            <section className={styles.compareContainer}>
                <div className={styles.comparisonContainer}>
                    <ToolCompareColumn 
                        tool={tool1} 
                        slot={1} 
                        onClear={handleClearTool1}
                        onSelect={handleOpenSelector1}
                        isLoading={isTool1Loading}
                        content={COMPARE_UI_CONSTANTS?.placeholders}
                        error={error}
                        onRetry={resetComparison}
                    />
                    
                    <div className={styles.vsDivider}>VS</div>

                    <ToolCompareColumn 
                        tool={tool2} 
                        slot={2} 
                        onClear={handleClearTool2}
                        onSelect={handleOpenSelector2}
                        isLoading={isTool2Loading}
                        content={COMPARE_UI_CONSTANTS?.placeholders}
                        error={error}
                        onRetry={resetComparison}
                    />
                </div>
                
                {(!tool1 || !tool2) && (
                    <RecentComparisons 
                        comparisons={recentComparisons} 
                        isLoading={isRecentLoading} 
                    />
                )}

                <ComparisonMatrix 
                    tool1={tool1} 
                    tool2={tool2} 
                    isLoading={isPageLoading}
                    isTool1Loading={isTool1Loading}
                    isTool2Loading={isTool2Loading}
                    isAiLoading={isAiLoading}
                    aiResults={aiResults}
                    aiError={aiError}
                    content={COMPARE_UI_CONSTANTS?.matrix}
                    error={error}
                    onRetry={resetComparison}
                />

                {isComparisonReady && (
                    <div className={styles.resetContainer}>
                        <Button 
                            onClick={handleShare} 
                            variant="primary"
                            icon={Share2}
                        >
                            Share Comparison
                        </Button>
                        <Button 
                            onClick={resetComparison} 
                            variant="secondary"
                            icon={RefreshCcw}
                        >
                            {COMPARE_UI_CONSTANTS?.actions?.reset}
                        </Button>
                    </div>
                )}
            </section>

            {isSelectingFor && (
                <CompareBuilder 
                    isSelectingFor={isSelectingFor}
                    tool1={tool1}
                    tool2={tool2}
                    onSelect={handleSelect}
                    onClose={closeSelector}
                    onClear={clearTool}
                    onSwitchStep={setIsSelectingFor}
                />
            )}
        </main>
    );
}
