'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useToolDetailData } from '../../../hooks/useToolDetailData';

// Import Global Components
import Safeguard from '../../../components/ui/Safeguard';
import EmptyState from '../../../components/ui/EmptyState';

// Import Modular Components
import ToolDetailHero from '../../../components/ToolDetail/ToolDetailHero';
import ToolDetailMasterCard from '../../../components/ToolDetail/ToolDetailMasterCard';
import ToolDetailInfo from '../../../components/ToolDetail/ToolDetailInfo';
import ToolDetailSidebar from '../../../components/ToolDetail/ToolDetailSidebar';
import ToolDetailRelated from '../../../components/ToolDetail/ToolDetailRelated';
import ReviewsSection from '../../../components/ReviewsSection';
import ReportToolModal from '../../../components/ReportToolModal';
import ToolDetailPricing from '../../../components/ToolDetail/ToolDetailPricing';

// Import Constants & Styles
import { TOOL_DETAIL_UI_CONSTANTS } from '../../../constants/toolDetailConstants';
import styles from './ToolDetail.module.css';

/**
 * ToolDetailClient Page (Elite 10/10)
 * Hydrates Server Data into React Query and handles Client UI Interactivity
 */
export default function ToolDetailClient({ initialTool, initialPublisher, initialRelatedTools }) {
    const router = useRouter();
    
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
    } = useToolDetailData({ initialTool, initialPublisher, initialRelatedTools });

    const breadcrumbItems = useMemo(() => [
        { label: TOOL_DETAIL_UI_CONSTANTS.breadcrumbs.home, path: '/' },
        { label: TOOL_DETAIL_UI_CONSTANTS.breadcrumbs.tools, path: '/tools' },
        { label: tool?.name || 'Tool' }
    ], [tool?.name]);

    const handleAuthAction = async (action) => {
        if (!user) {
            router.push('/auth');
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
                                    <ToolDetailPricing 
                                        tool={tool}
                                        isLoading={loading && !tool}
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
}
