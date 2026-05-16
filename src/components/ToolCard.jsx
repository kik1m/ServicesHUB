'use client';
import React, { useCallback } from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { queryOptions } from '../lib/queryOptions';
import { ArrowUpRight, Star, CheckCircle2, Zap } from 'lucide-react';
import Skeleton from './ui/Skeleton';
import SmartImage from './ui/SmartImage';
import styles from './ToolCard.module.css';

/**
 * 🚀 ToolCard — Elite v2.0 (10/10)
 * ✅ Hover Prefetch: Loads tool page data before user clicks
 * ✅ React.memo: Prevents unnecessary re-renders in large lists
 * ✅ Dual mode: Link mode (directory) & Select mode (compare/modal)
 */
const ToolCard = ({ tool, isLoading = false, onClickOverride = null }) => {
    const queryClient = useQueryClient();

    // 🚀 Prefetch on hover — loads the tool detail page data BEFORE the user clicks
    const handleMouseEnter = useCallback(() => {
        if (!tool?.slug || onClickOverride) return; // no prefetch in select mode
        queryClient.prefetchQuery(queryOptions.toolBySlug(tool.slug));
    }, [tool?.slug, onClickOverride, queryClient]);

    if (isLoading) {
        return (
            <div className={`${styles.toolCard} ${styles.skeletonCard}`}>
                <div className={styles.cardLogoBox}>
                    <Skeleton className={styles.skeletonLogo} />
                </div>
                <div className={styles.cardContent}>
                    <div className={`${styles.cardTitleRow} ${styles.cardTitleRowSkeleton}`}>
                        <Skeleton className={styles.skeletonTitle} />
                        <Skeleton className={styles.skeletonPill} />
                    </div>
                    <Skeleton className={styles.skeletonLineShort} />
                    <Skeleton className={styles.skeletonLineFull} />
                </div>
                <div className={styles.cardFooter}>
                    <Skeleton className={styles.skeletonFooterItem} />
                    <Skeleton className={styles.skeletonFooterItem} />
                </div>
            </div>
        );
    }

    const isSelectMode = !!onClickOverride;
    const CardElement = isSelectMode ? 'div' : Link;

    const cardProps = isSelectMode
        ? { onClick: () => onClickOverride(tool) }
        : { href: `/tool/${tool.slug}`, onMouseEnter: handleMouseEnter };

    return (
        <CardElement
            {...cardProps}
            className={`${styles.toolCard} ${tool.is_featured ? styles.featuredGlowCard : styles.standardToolCard}`}
        >
            <div className={styles.cardLogoBox}>
                <SmartImage
                    src={tool.image_url}
                    alt={tool.name}
                    fallbackIcon={Zap}
                    className={styles.cardLogoImage}
                />
            </div>

            <div className={styles.cardContent}>
                <div className={styles.cardTitleRow}>
                    <div className={styles.nameContainer}>
                        <h3>{tool.name || 'Untitled Tool'}</h3>
                        {tool.is_verified && (
                            <CheckCircle2 size={16} className={styles.verifiedIcon} title="Verified Tool" />
                        )}
                    </div>

                    <div className={styles.cardMetaGroup}>
                        <div className={styles.pillPrice}>
                            {tool.pricing_type || 'Free'}
                        </div>
                    </div>
                </div>

                <p>{tool.short_description || tool.description || 'No description available for this tool.'}</p>
            </div>

            <div className={styles.cardFooter}>
                <div className={styles.cardRating}>
                    <Star size={12} className={styles.ratingIcon} fill={tool.reviews_count > 0 ? 'currentColor' : 'transparent'} />
                    <span>{tool.reviews_count > 0 ? tool.rating?.toFixed(1) : '0.0'}</span>
                </div>
                <div className={styles.cardLink}>
                    View <ArrowUpRight size={14} />
                </div>
            </div>
        </CardElement>
    );
};

// ✅ React.memo: Prevents re-render if tool data hasn't changed
export default React.memo(ToolCard);
