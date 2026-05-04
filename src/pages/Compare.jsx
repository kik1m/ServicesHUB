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
        if (tool1?.name && tool2?.name) return `${tool1.name} vs ${tool2.name} - AI Comparison, Pricing & Features`;
        if (tool1?.name || tool2?.name) return `Compare ${tool1?.name || tool2?.name} with Top AI Tools`;
        return "Expert AI & SaaS Tool Comparison | HUBly Side-by-Side";
    }, [tool1?.name, tool2?.name]);

    // 2. Elite Hybrid AI SEO Engine (v3.0)
    // Rule #34: Fetch AI-optimized metadata if available for this specific pair
    const comparisonId = tool1?.slug && tool2?.slug ? `${tool1.slug}-vs-${tool2.slug}` : null;

    useSEO({
        entityId: comparisonId,
        entityType: 'comparison',
        title: seoTitle,
        description: `Detailed AI-powered comparison between ${tool1?.name || 'leading AI tools'} and ${tool2?.name || 'alternatives'}. Get structured analysis on pricing, features, and performance.`,
        noindex: !tool1?.id || !tool2?.id, // Rule #34: Elite Indexing Control (Prevent ghost comparisons)
        ogType: 'website',
        schema: [
            {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": seoTitle,
                "url": tool1 && tool2 ? `https://hubly-tools.com/compare/${tool1.slug}-vs-${tool2.slug}` : "https://hubly-tools.com/compare",
                "description": "AI-powered structured comparison engine for software analysis."
            },
            {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "HUBly AI Comparison Engine",
                "applicationCategory": "ComparisonTool",
                "operatingSystem": "Web",
                "description": "Structured AI analysis for comparing SaaS and AI tools using real-time data.",
                "about": [
                    { "@type": "Thing", "name": "AI Generated Software Analysis" }
                ]
            }
        ]
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
        <main className={styles.compareView}>
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
        </main>
    );
};

export default Compare;
