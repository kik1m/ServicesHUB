import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { useToolDetailData } from '../hooks/useToolDetailData';
import { getCurrentUrl } from '../utils/getCurrentUrl';

// Import Global Components
import Safeguard from '../components/ui/Safeguard';
import EmptyState from '../components/ui/EmptyState';

// Import Modular Components
import ToolDetailHero from '../components/ToolDetail/ToolDetailHero';
import ToolDetailMasterCard from '../components/ToolDetail/ToolDetailMasterCard';
import ToolDetailInfo from '../components/ToolDetail/ToolDetailInfo';
import ToolDetailSidebar from '../components/ToolDetail/ToolDetailSidebar';
import ToolDetailRelated from '../components/ToolDetail/ToolDetailRelated';
import ReviewsSection from '../components/ReviewsSection';
import ReportToolModal from '../components/ReportToolModal';

// Import Constants & Styles
import { TOOL_DETAIL_UI_CONSTANTS } from '../constants/toolDetailConstants';
import styles from './ToolDetail.module.css';

/**
 * ToolDetail Page (Elite 10/10)
 * Rule #1: Logic Isolation (useToolDetailData)
 * Rule #31: Component Resilience via Safeguard
 */
const ToolDetail = () => {
    const navigate = useNavigate();
    
    const {
        tool,
        publisher,
        relatedTools,
        loading,
        error,
        isFavorited,
        isReportModalOpen,
        toggleFavorite,
        handleShare,
        handleExternalClick,
        openReportModal,
        closeReportModal,
        user,
        refresh
    } = useToolDetailData();

    // SEO Hardening
    useSEO({
        title: tool?.name ? `${tool.name} ${TOOL_DETAIL_UI_CONSTANTS.seo.titleSuffix}` : 'Tool Details',
        description: tool?.short_description || tool?.description,
        image: tool?.image_url,
        url: getCurrentUrl(),
        schema: tool ? {
            "@context": "https://schema.org/",
            "@type": "SoftwareApplication",
            "name": tool.name,
            "applicationCategory": "MultimediaApplication", // Generic category for AI tools
            "operatingSystem": "Web",
            "image": tool.image_url,
            "description": tool.short_description || tool.description,
            "brand": { "@type": "Brand", "name": tool.categories?.name || "AI Tool" },
            "aggregateRating": tool.rating > 0 ? {
                "@type": "AggregateRating",
                "ratingValue": tool.rating,
                "reviewCount": tool.reviews_count || 1
            } : undefined,
            "offers": {
                "@type": "Offer",
                "price": tool.pricing_type === 'Free' ? "0" : "1", // Use dummy for paid if exact price unknown, but valid schema
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
            }
        } : null
    });

    const breadcrumbItems = useMemo(() => [
        { label: TOOL_DETAIL_UI_CONSTANTS.breadcrumbs.home, path: '/' },
        { label: TOOL_DETAIL_UI_CONSTANTS.breadcrumbs.tools, path: '/tools' },
        { label: tool?.name || 'Tool' }
    ], [tool?.name]);

    const handleAuthAction = async (action) => {
        if (!user) {
            navigate('/auth');
            return;
        }
        await action();
    };

    const isNotFound = !loading && !tool && !error;

    return (
        <div className={styles.toolDetailPage}>
            <Safeguard error={error} onRetry={refresh} fullPage title="Tool Unavailable">
                {isNotFound ? (
                    <div className={styles.errorWrapper}>
                        <EmptyState 
                            title={TOOL_DETAIL_UI_CONSTANTS.error.notFound}
                            message={TOOL_DETAIL_UI_CONSTANTS.error.notFoundDesc}
                        />
                    </div>
                ) : (
                    <>
                        <ToolDetailHero 
                            tool={tool}
                            breadcrumbs={breadcrumbItems}
                            isLoading={loading && !tool}
                            content={TOOL_DETAIL_UI_CONSTANTS}
                        />

                        <section className={styles.toolDetailMain}>
                            <ToolDetailMasterCard 
                                tool={tool}
                                isFavorited={isFavorited}
                                toggleFavorite={() => handleAuthAction(toggleFavorite)}
                                onExternalClick={handleExternalClick}
                                isLoading={loading && !tool}
                                content={TOOL_DETAIL_UI_CONSTANTS}
                            />

                            <div className={styles.toolGridLayout}>
                                <div className={styles.infoCol}>
                                    <ToolDetailInfo 
                                        tool={tool} 
                                        isLoading={loading && !tool}
                                        content={TOOL_DETAIL_UI_CONSTANTS}
                                    />
                                </div>

                                <aside className={styles.sidebarCol}>
                                    <ToolDetailSidebar 
                                        tool={tool} 
                                        publisher={publisher} 
                                        isFavorited={isFavorited} 
                                        toggleFavorite={() => handleAuthAction(toggleFavorite)} 
                                        handleShare={handleShare} 
                                        setIsReportModalOpen={openReportModal} 
                                        isLoading={loading && !publisher}
                                        content={TOOL_DETAIL_UI_CONSTANTS}
                                    />
                                </aside>
                            </div>

                            <ToolDetailRelated 
                                relatedTools={relatedTools} 
                                isLoading={loading && relatedTools.length === 0}
                                content={TOOL_DETAIL_UI_CONSTANTS}
                            />
                            
                            {tool?.id && (
                                <div className={styles.reviewsSectionWrapper}>
                                    <ReviewsSection 
                                        toolId={tool.id} 
                                        content={TOOL_DETAIL_UI_CONSTANTS.reviews}
                                        onReviewSuccess={refresh}
                                    />
                                </div>
                            )}
                        </section>
                        
                        {isReportModalOpen && tool && (
                            <ReportToolModal 
                                toolId={tool.id} 
                                toolName={tool.name} 
                                user={user}
                                onClose={closeReportModal} 
                            />
                        )}
                    </>
                )}
            </Safeguard>
        </div>
    );
};

export default ToolDetail;
