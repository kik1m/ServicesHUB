import React, { useCallback, useMemo } from 'react';
import { RefreshCcw, Share2 } from 'lucide-react';
import SmartBanner from '../components/SmartBanner';
import useSEO from '../hooks/useSEO';
import { useCompareData } from '../hooks/useCompareData';
import { useBannerData } from '../hooks/useBannerData';
import { useToast } from '../context/ToastContext';

// Import Global Components
import PageHero from '../components/ui/PageHero';
import Safeguard from '../components/ui/Safeguard';
import ToolCompareColumn from '../components/Compare/ToolCompareColumn';
import ComparisonMatrix from '../components/Compare/ComparisonMatrix';
import CompareBuilder from '../components/Compare/CompareBuilder';
import Button from '../components/ui/Button';

// Import Modular CSS
import styles from './Compare.module.css';
import { COMPARE_UI_CONSTANTS } from '../constants/compareConstants';

/**
 * Compare Page - Ultimate Elite Standard (10/10)
 * Rule #12: Pure UI (SmartBanner receives data from page)
 * Rule #31: Component Resilience via Safeguard
 */
const Compare = () => {
    const banner = useBannerData();
    const { addToast } = useToast();
    
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
        results,
        aiResults,
        isAiLoading,
        aiError
    } = useCompareData();

    const handleClearTool1 = useCallback(() => clearTool('tool1'), [clearTool]);
    const handleClearTool2 = useCallback(() => clearTool('tool2'), [clearTool]);
    const handleOpenSelector1 = useCallback(() => openSelector('tool1'), [openSelector]);
    const handleOpenSelector2 = useCallback(() => openSelector('tool2'), [openSelector]);

    const isPageLoading = isTool1Loading || isTool2Loading;
    const isComparisonReady = tool1?.id && tool2?.id && !isPageLoading;
    
    const seoTitle = useMemo(() => {
        if (tool1?.name && tool2?.name) return `${tool1.name} vs ${tool2.name} | Professional Comparison`;
        if (tool1?.name || tool2?.name) return `Compare ${tool1?.name || tool2?.name} with others`;
        return "Compare AI Tools | Side-by-Side Analysis";
    }, [tool1?.name, tool2?.name]);

    // 2. SEO Hardening (v2.0)
    useSEO({
        title: seoTitle,
        description: `Side-by-side comparison of ${tool1?.name || 'top tools'} and ${tool2?.name || 'more'}. Make informed decisions with HUBly.`,
    });

    // 3. Share Functionality
    const handleShare = () => {
        if (!tool1?.slug || !tool2?.slug) return;
        const shareUrl = `${window.location.origin}/compare/${tool1.slug}-vs-${tool2.slug}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            addToast('success', 'Comparison link copied to clipboard!');
        });
    };

    return (
        <div className={styles.compareView}>
            <SmartBanner 
                tools={banner.tools}
                isLoading={banner.loading}
                error={banner.error}
                next={banner.next}
                prev={banner.prev}
                currentIndex={banner.currentIndex}
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
        </div>
    );
};

export default Compare;
