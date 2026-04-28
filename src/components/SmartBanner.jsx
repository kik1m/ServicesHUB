import React, { memo } from 'react';
import { ChevronLeft, ChevronRight, Zap, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './SmartBanner.module.css';

// Import UI Atoms - Rule #5
import Button from './ui/Button';
import SmartImage from './ui/SmartImage';
import Skeleton from './ui/Skeleton';
import Safeguard from './ui/Safeguard';

/**
 * SmartBanner - Elite Advertising Engine (v3.3)
 * Feature: Unified Verification UI & Enhanced Skeletons
 */
const SmartBanner = memo((props) => {
    const {
        tools = [],
        currentIndex = 0,
        isLoading,
        error,
        next,
        prev,
        onExternalClick,
        onRetry
    } = props;

    const currentTool = tools?.[currentIndex] || null;

    if (error) return <Safeguard error={error} onRetry={onRetry} />;

    return (
        <div className={`${styles.smartBannerNew} fade-in`} id="smart-banner-node">
            <div className={styles.bannerInner}>
                {/* 1. Visual Section */}
                <div className={styles.bannerVisual}>
                    <div className={styles.imageFixedBox}>
                        {isLoading ? (
                            <Skeleton className={styles.skeletonImage} />
                        ) : (
                            <SmartImage
                                src={currentTool?.image_url}
                                alt={currentTool?.name}
                                className={styles.bannerImg}
                                fallbackText={currentTool?.name?.charAt(0)}
                            />
                        )}
                    </div>
                </div>

                {/* 2. Content Section */}
                <div className={styles.bannerDetails}>
                    <div className={styles.bannerTopMeta}>
                        {isLoading ? (
                            <Skeleton className={styles.skeletonBadge} />
                        ) : (
                            <div className={styles.featuredBadge}>
                                <Zap size={14} fill="currentColor" />
                                <span>FEATURED</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.bannerTextContent}>
                        {isLoading ? (
                            <>
                                <Skeleton className={styles.skeletonTextTitle} />
                                <Skeleton className={styles.skeletonTextP1} />
                            </>
                        ) : (
                            <>
                                <div className={styles.titleRow}>
                                    <h2>{currentTool?.name}</h2>
                                    {currentTool?.is_verified && (
                                        <CheckCircle2 size={20} className={styles.verifiedIcon} />
                                    )}
                                </div>
                                <p>{currentTool?.short_description}</p>
                            </>
                        )}
                    </div>

                    <div className={styles.bannerNavMinimal}>
                        <button className={styles.navBtnMin} onClick={prev} disabled={isLoading || tools.length <= 1}>
                            <ChevronLeft size={20} />
                        </button>
                        <span className={styles.countLabel}>
                            {isLoading ? (
                                <Skeleton width="40px" height="12px" />
                            ) : (
                                `${currentIndex + 1} / ${tools.length}`
                            )}
                        </span>
                        <button className={styles.navBtnMin} onClick={next} disabled={isLoading || tools.length <= 1}>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* 3. Actions Section */}
                <div className={styles.bannerActionsRight}>
                    <div className={styles.bannerCtaGroup}>
                        {isLoading ? (
                            <>
                                <Skeleton className={styles.skeletonCta} />
                                <Skeleton className={styles.skeletonCta} />
                            </>
                        ) : (
                            <>
                                <Button
                                    as={Link}
                                    to={currentTool ? `/tool/${currentTool.slug}` : '#'}
                                    variant="ghost"
                                    className={styles.bannerCtaOverride}
                                    disabled={isLoading || !currentTool}
                                >
                                    Details
                                </Button>
                                <Button
                                    as="a"
                                    href={currentTool?.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="primary"
                                    icon={ExternalLink}
                                    className={styles.bannerCtaOverride}
                                    onClick={() => currentTool && onExternalClick?.(currentTool.id)}
                                    disabled={isLoading || !currentTool}
                                >
                                    Visit
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default SmartBanner;
