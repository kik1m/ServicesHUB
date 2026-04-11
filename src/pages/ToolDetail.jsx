import React from 'react';
import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { useToolDetailData } from '../hooks/useToolDetailData';
import ReviewsSection from '../components/ReviewsSection';
import ReportToolModal from '../components/ReportToolModal';

// Import Modular Components
import ToolDetailSkeleton from '../components/ToolDetail/ToolDetailSkeleton';
import ToolDetailHeader from '../components/ToolDetail/ToolDetailHeader';
import ToolDetailInfo from '../components/ToolDetail/ToolDetailInfo';
import ToolDetailSidebar from '../components/ToolDetail/ToolDetailSidebar';
import ToolDetailRelated from '../components/ToolDetail/ToolDetailRelated';

// Import Modular CSS
import styles from './ToolDetail.module.css';

const ToolDetail = () => {
    const {
        tool,
        publisher,
        relatedTools,
        loading,
        isFavorited,
        isReportModalOpen,
        setIsReportModalOpen,
        toggleFavorite,
        handleShare,
        navigate
    } = useToolDetailData();

    useSEO({
        title: tool?.name ? `${tool.name} - Tool Details` : 'Tool Details',
        description: tool?.description,
        image: tool?.image_url,
        url: typeof window !== 'undefined' ? window.location.href : ''
    });

    if (loading) return <ToolDetailSkeleton />;

    if (!tool) {
        return (
            <div className="page-wrapper" style={{ textAlign: 'center', padding: '150px 5%' }}>
                <h2 className="hero-title">Tool <span className="gradient-text">Not Found</span></h2>
                <Link to="/tools" className="btn-primary" style={{ marginTop: '2rem' }}>Back to Directory</Link>
            </div>
        );
    }

    return (
        <div className={`page-wrapper ${styles.toolDetailPage}`}>
            <ToolDetailHeader 
                tool={tool} 
                navigate={navigate} 
                isFavorited={isFavorited} 
                toggleFavorite={toggleFavorite} 
            />

            <section className={`main-section ${styles.toolDetailMain}`}>
                <div className={styles.toolGridLayout}>
                    <ToolDetailInfo tool={tool} />

                    <ToolDetailSidebar 
                        tool={tool} 
                        publisher={publisher} 
                        isFavorited={isFavorited} 
                        toggleFavorite={toggleFavorite} 
                        handleShare={handleShare} 
                        setIsReportModalOpen={setIsReportModalOpen} 
                    />
                </div>

                <ToolDetailRelated relatedTools={relatedTools} />
                
                {tool && tool.id && <ReviewsSection toolId={tool.id} />}
            </section>
            
            {isReportModalOpen && (
                <ReportToolModal 
                    toolId={tool.id} 
                    toolName={tool.name} 
                    onClose={() => setIsReportModalOpen(false)} 
                />
            )}
        </div>
    );
};

export default ToolDetail;
