import React from 'react';
import { Star, ShieldCheck, Share2, Heart, Flag, ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import styles from './ToolDetailSidebar.module.css';

const ToolDetailSidebar = ({ 
    tool, 
    publisher, 
    isFavorited, 
    toggleFavorite, 
    handleShare, 
    setIsReportModalOpen,
    isLoading,
    content
}) => {
    // Rule #11 & #4: Component-Owned Skeletons
    if (isLoading) {
        return (
            <aside className={styles.toolSidebar}>
                <div className={styles.sidebarInner}>
                    <Skeleton width="100px" height="24px" className={styles.mb1_5rem} />
                    <div className={styles.infoListRows}>
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={`skeleton-row-${i}`} className={styles.skeletonRow}>
                                <Skeleton width="80px" height="18px" borderRadius="4px" />
                                <Skeleton width="120px" height="18px" borderRadius="4px" />
                            </div>
                        ))}
                    </div>
                    
                    <div className={styles.skeletonActionsGroup}>
                        <div className={styles.skeletonRowFlex}>
                            <Skeleton width="50%" height="44px" borderRadius="10px" />
                            <Skeleton width="50%" height="44px" borderRadius="10px" />
                        </div>
                        <Skeleton width="100%" height="32px" borderRadius="8px" />
                    </div>

                    <div className={styles.skeletonClaimCard}>
                        <Skeleton width="40px" height="40px" borderRadius="10px" className={styles.mb1rem} />
                        <Skeleton width="180px" height="24px" className={styles.mb0_5rem} borderRadius="6px" />
                        <Skeleton width="100%" height="18px" className={styles.mb1rem} borderRadius="4px" />
                        <Skeleton width="140px" height="24px" borderRadius="6px" />
                    </div>
                </div>
            </aside>
        );
    }

    // Rule #36: Component Resilience
    if (!tool) return null;

    return (
        <aside className={styles.toolSidebar}>
            <div className={styles.sidebarInner}>
                <h4 className={styles.sidebarTitleSlim}>{content.sidebar.title}</h4>
                <div className={styles.infoListRows}>
                    <div className={styles.infoRowItem}>
                        <span className={styles.infoLabel}>{content.sidebar.pricing}</span>
                        <span className={styles.infoValue}>
                            {tool.pricing_type || 'Free'} {tool.pricing_details ? `(${tool.pricing_details})` : ''}
                        </span>
                    </div>
                    
                    {publisher && publisher.id && (
                        <div className={styles.infoRowItem}>
                            <span className={styles.infoLabel}>{content.sidebar.publisher}</span>
                            <Link 
                                to={publisher.id === '8ded6b0a-6982-495c-8ba8-fda45ac7e082' ? '#' : `/u/${publisher.id}`} 
                                className={`${styles.publisherLinkPremium} ${publisher.id === '8ded6b0a-6982-495c-8ba8-fda45ac7e082' ? styles.teamHubly : ''}`}
                            >
                                <span className={styles.publisherNameWrapper}>
                                    {publisher.id === '8ded6b0a-6982-495c-8ba8-fda45ac7e082' ? 'Team Hubly' : (publisher.full_name || content.sidebar.anonymous)}
                                    {publisher.id === '8ded6b0a-6982-495c-8ba8-fda45ac7e082' && (
                                        <CheckCircle2 size={14} className={styles.teamVerifiedBadge} />
                                    )}
                                </span>
                                <ChevronRight size={14} />
                            </Link>
                        </div>
                    )}

                    <div className={styles.infoRowItem}>
                        <span className={styles.infoLabel}>{content.sidebar.rating}</span>
                        <span className={styles.ratingValue}>
                            <Star size={16} fill={tool.reviews_count > 0 ? "#ffc107" : "transparent"} stroke="#ffc107" /> 
                            {tool.reviews_count > 0 ? tool.rating?.toFixed(1) : '0.0'} ({tool.reviews_count || 0})
                        </span>
                    </div>

                    <div className={styles.infoRowItem}>
                        <span className={styles.infoLabel}>{content.sidebar.status}</span>
                        <span className={styles.statusValue}>
                            {tool.is_featured ? content.badges.featured : content.badges.popular}
                        </span>
                    </div>

                    <div className={styles.infoRowItem}>
                        <span className={styles.infoLabel}>{content.sidebar.safety}</span>
                        <span className={styles.safetyBadgeGreen}>
                            <ShieldCheck size={16} /> {tool.is_verified ? content.sidebar.verified : content.sidebar.safe}
                        </span>
                    </div>
                </div>
                
                <hr className={styles.divider} />
                
                <div className={styles.shareSection}>
                    <p className={styles.shareSectionTitle}>{content.sidebar.shareTitle}</p>
                    <div className={styles.shareGroupRow}>
                        <Button 
                            variant="secondary" 
                            className={styles.shareActionBtn}
                            onClick={handleShare}
                            icon={Share2}
                        >
                            {content.actions.share}
                        </Button>
                        <Button 
                            variant="secondary" 
                            className={`${styles.shareActionBtn} ${isFavorited ? styles.isActive : ''}`}
                            onClick={toggleFavorite}
                            icon={Heart}
                        >
                            {isFavorited ? content.actions.saved : content.actions.favorite}
                        </Button>
                    </div>
                    <div className={styles.reportToolBtnContainer}>
                        <Button 
                            variant="text"
                            onClick={() => setIsReportModalOpen(true)}
                            className={styles.reportToolBtn}
                            icon={Flag}
                        >
                            {content.actions.report}
                        </Button>
                    </div>
                </div>

                <div className={styles.claimCardDashed}>
                    <ShieldCheck size={28} className={styles.claimIcon} />
                    <h5 className={styles.claimTitle}>{content.sidebar.claim.title}</h5>
                    <p className={styles.claimDesc}>{content.sidebar.claim.desc}</p>
                    <Button 
                        as={Link} 
                        to="/contact?subject=Claim%20Tool" 
                        variant="ghost" 
                        className={styles.claimLink}
                        icon={ArrowRight}
                        iconPosition="right"
                    >
                        {content.sidebar.claim.action}
                    </Button>
                </div>
            </div>
        </aside>
    );
};

export default ToolDetailSidebar;




