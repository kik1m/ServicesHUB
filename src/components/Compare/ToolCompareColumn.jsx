import React from 'react';
import { Plus, X, CheckCircle2, Zap, Star } from 'lucide-react';
import SmartImage from '../ui/SmartImage';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ToolCompareColumn.module.css';

/**
 * ToolCompareColumn - Elite v2.3
 * Feature: Full Data Recovery (Verification, Category, Featured, Rating)
 */
const ToolCompareColumn = ({ tool, onClear, onSelect, isLoading, error, onRetry, content }) => {
    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.column}>
                {isLoading ? (
                    <div className={styles.loadingOpacity}>
                        <div className={styles.skeletonTitleCenter}>
                            <Skeleton className={styles.skeletonLogo} borderRadius="24px" />
                        </div>
                        <div className={styles.skeletonTitleCenter}>
                            <Skeleton className={styles.skeletonTitle} />
                        </div>
                    </div>
                ) : tool ? (
                    <div className={`${styles.activeCard} ${tool?.is_featured ? styles.featuredGlow : ''} fade-in`}>
                        {/* Clear Action */}
                        <button className={styles.closeBtn} onClick={onClear} title="Remove Tool">
                            <X size={18} />
                        </button>

                        {/* Top Meta: Featured Badge */}
                        <div className={styles.topMeta}>
                            {tool?.is_featured && (
                                <div className={styles.featuredBadge}>
                                    <Zap size={10} fill="currentColor" />
                                    <span>FEATURED</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Visual: Real Tool Image */}
                        <div className={styles.logoContainer}>
                            <div className={styles.logoImageContainer}>
                                <SmartImage 
                                    src={tool?.image_url} 
                                    alt={tool?.name}
                                    className={styles.logoImage}
                                    fallbackIcon={Zap}
                                />
                            </div>
                        </div>
                        
                        {/* Info Header: Name + Verification */}
                        <div className={styles.toolHeader}>
                            <h3 className={styles.toolName}>{tool?.name}</h3>
                            {tool?.is_verified && (
                                <CheckCircle2 size={18} className={styles.verifiedIcon} />
                            )}
                        </div>

                        {/* Middle Info: Category & Rating */}
                        <div className={styles.middleMeta}>
                            <span className={styles.categoryLabel}>{tool?.categories?.name || 'Uncategorized'}</span>
                            <div className={styles.ratingBox}>
                                <Star 
                                    size={14} 
                                    color="#ffaa00" 
                                    fill={tool?.reviews_count > 0 ? "currentColor" : "transparent"} 
                                />
                                <span>{tool?.reviews_count > 0 ? tool?.rating?.toFixed(1) : '0.0'}</span>
                            </div>
                        </div>
                        
                        {/* Footer Info: Pricing */}
                        <div className={styles.infoSection}>
                            <div className={styles.pricingBox}>
                                <div className={styles.pricingLabel}>Pricing Model</div>
                                <div className={styles.pricingValue}>{tool?.pricing_type || 'Paid'}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.placeholder} onClick={onSelect}>
                        <div className={styles.placeholderIcon}>
                            <Plus size={32} />
                        </div>
                        <h3 className={styles.placeholderTitle}>{content?.addTitle || "Add Tool"}</h3>
                        <p className={styles.placeholderText}>{content?.addSubtitle || "Select a tool to compare"}</p>
                    </div>
                )}
            </div>
        </Safeguard>
    );
};

export default ToolCompareColumn;
