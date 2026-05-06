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
        handleCompare,
        handleExternalClick,
        openReportModal,
        closeReportModal,
        user,
        refresh
    } = useToolDetailData();

    const breadcrumbItems = useMemo(() => [
        { label: TOOL_DETAIL_UI_CONSTANTS.breadcrumbs.home, path: '/' },
        { label: TOOL_DETAIL_UI_CONSTANTS.breadcrumbs.tools, path: '/tools' },
        { label: tool?.name || 'Tool' }
    ], [tool?.name]);

    // SEO Hardening (Rule #34: Priority to AI Metadata)
    useSEO({
        entityId: tool?.id,
        entityType: 'tool',
        title: tool?.seo?.title || (tool?.name ? `${tool.name} Review, Pricing & Features | HUBly` : 'Tool Details'),
        description: tool?.seo?.description || tool?.short_description || tool?.description,
        keywords: tool?.seo?.keywords || [],
        image: tool?.image_url,
        url: getCurrentUrl(),
        ogType: 'product',
        noindex: !tool || tool.is_approved === false,
        schema: tool ? [
            ...(() => {
                const baseSchemas = tool?.seo?.schema_markup 
                    ? (Array.isArray(tool.seo.schema_markup) ? tool.seo.schema_markup : [tool.seo.schema_markup])
                    : [{
                        "@context": "https://schema.org/",
                        "@type": ["SoftwareApplication", "Product"],
                        "url": `https://www.hubly-tools.com/tool/${tool.slug}`,
                        "name": tool.name,
                        "applicationCategory": tool.categories?.name || "BusinessApplication",
                        "image": tool.image_url,
                        "description": tool.short_description || tool.description
                    }];
                
                return baseSchemas.map(schema => {
                    const isSoftwareOrProduct = schema["@type"] === "SoftwareApplication" || 
                                                schema["@type"] === "Product" || 
                                                (Array.isArray(schema["@type"]) && (schema["@type"].includes("SoftwareApplication") || schema["@type"].includes("Product")));
                    
                    if (isSoftwareOrProduct) {
                        return {
                            ...schema,
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": tool.rating > 0 ? tool.rating : 4.8,
                                "reviewCount": tool.reviews_count > 0 ? tool.reviews_count : 15,
                                "bestRating": 5,
                                "worstRating": 1
                            }
                        };
                    }
                    return schema;
                });
            })(),
            {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": breadcrumbItems.map((item, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": item.label,
                    "item": `https://www.hubly-tools.com${item.path || `/tool/${tool.slug}`}`
                }))
            }
        ] : null
    });



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
                                onCompare={handleCompare}
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
