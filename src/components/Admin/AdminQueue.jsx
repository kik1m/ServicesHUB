import React, { memo } from 'react';
import { ADMIN_UI_CONSTANTS } from '../../constants/adminConstants';
import { Trash2, Star, Search, CheckCircle, HelpCircle } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Input from '../ui/Input';
import Button from '../ui/Button';
import SmartImage from '../ui/SmartImage';
import Safeguard from '../ui/Safeguard';
import styles from './AdminQueue.module.css';

/**
 * AdminQueue - Elite Modular Queue Manager
 * Rule #18: Memoized
 */
const AdminQueue = memo(({ 
    activeTab, 
    pendingTools = [], 
    featuredTools = [], 
    handleOpenReview, 
    handleReject, 
    handleToggleFeatured,
    adminSearchQuery = '',
    adminSearchResults = [],
    handleAdminSearch,
    isLoading,
    error,
    onRetry
}) => {
    // 1. Guard for active tab
    if (activeTab !== 'pending' && activeTab !== 'featured') return null;

    const SKELETON_COUNT = 4;
    const labels = ADMIN_UI_CONSTANTS.queue;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.wrapper}>
                {isLoading ? (
                    <>
                        <div className={styles.sectionHeader}>
                            <Skeleton className={styles.skeletonSectionTitle} />
                        </div>
                        <div className={styles.listContainer}>
                            {[...Array(SKELETON_COUNT)].map((_, i) => (
                                <div key={`skeleton-admin-queue-${i}`} className={styles.itemRowSkeleton}>
                                    <Skeleton className={styles.skeletonThumb} />
                                    <div className={styles.skeletonText}>
                                        <Skeleton className={styles.skeletonRowTitle} />
                                        <Skeleton className={styles.skeletonRowMeta} />
                                    </div>
                                    <Skeleton className={styles.skeletonActionBtn} />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.sectionHeader}>
                            <div className={styles.headerInfo}>
                                <h2 className={styles.title}>{activeTab === 'pending' ? labels.pendingTitle : labels.featuredTitle}</h2>
                                <span className={styles.badge}>
                                    {(activeTab === 'pending' ? pendingTools : featuredTools)?.length || 0} {activeTab.toUpperCase()}
                                </span>
                            </div>
                            
                            {activeTab === 'featured' && (
                                <div className={styles.searchWrapper}>
                                    <Input 
                                        placeholder={labels.searchPlaceholder} 
                                        value={adminSearchQuery} 
                                        onChange={handleAdminSearch}
                                        icon={Search}
                                        className={styles.adminSearchInput}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Search Results Dropdown - Rule #3: Dynamic Design */}
                        {activeTab === 'featured' && adminSearchResults?.length > 0 && (
                            <div className={styles.searchResultsSection}>
                                <h4 className={styles.searchHeader}>{labels.searchResultTitle}</h4>
                                <div className={styles.listContainer}>
                                    {adminSearchResults.map(tool => (
                                        <div key={`search-match-${tool.id}`} className={`${styles.itemRow} ${styles.searchMatch}`}>
                                            <div className={styles.itemContent}>
                                                <div className={styles.itemThumb}>
                                                    <SmartImage src={tool.image_url} alt={tool.name} />
                                                </div>
                                                <div className={styles.itemInfo}>
                                                    <h4>{tool?.name}</h4>
                                                    <p>{tool?.categories?.name} • {tool?.pricing_type}</p>
                                                </div>
                                                
                                                <Button
                                                    variant={tool?.is_featured ? 'secondary' : 'primary'}
                                                    onClick={() => handleToggleFeatured(tool)}
                                                    className={tool?.is_featured ? styles.featuredActive : styles.featureTrigger}
                                                    icon={Star}
                                                    iconFill={tool?.is_featured ? 'currentColor' : 'none'}
                                                >
                                                    {tool?.is_featured ? labels.actions?.featured : labels.actions?.featureThis}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Main List Container */}
                        <div className={styles.listContainer}>
                            {(activeTab === 'pending' ? pendingTools : featuredTools)?.map(tool => (
                                <div key={tool.id} className={styles.itemRow}>
                                    <div className={styles.itemContent}>
                                        <div className={styles.itemThumb}>
                                            <SmartImage src={tool.image_url} alt={tool.name} />
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <h4>{tool?.name}</h4>
                                            <p>{tool?.categories?.name} • {tool?.formatted_date}</p>
                                        </div>
                                        
                                        <div className={styles.actions}>
                                            {activeTab === 'pending' ? (
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => handleOpenReview(tool)}
                                                    className={`${styles.reviewBtn} ${tool?.pending_changes ? styles.updateMode : styles.newMode}`}
                                                    icon={tool?.pending_changes ? HelpCircle : CheckCircle}
                                                >
                                                    {tool?.pending_changes ? labels.actions?.reviewUpdate : labels.actions?.fullReview}
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => handleToggleFeatured(tool)}
                                                    className={`${styles.actionBtn} ${styles.featuredActive}`}
                                                    icon={Star}
                                                    iconFill="currentColor"
                                                >
                                                    {labels.actions?.featured}
                                                </Button>
                                            )}
                                            
                                            <button 
                                                type="button"
                                                onClick={() => handleReject(tool)} 
                                                className={styles.rejectBtn}
                                                title={labels.actions?.rejectTitle}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {(activeTab === 'pending' ? pendingTools : featuredTools)?.length === 0 && (
                                <div className={styles.emptyState}>
                                    <p>{labels.empty?.replace('{status}', activeTab)}</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Safeguard>
    );
});

export default AdminQueue;
