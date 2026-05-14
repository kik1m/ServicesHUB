'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowRightLeft, Trophy, Zap } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import SectionHeader from '../ui/SectionHeader';
import SmartImage from '../ui/SmartImage';
import Safeguard from '../ui/Safeguard';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';
import styles from './HomeComparisons.module.css';

/**
 * HomeComparisons - Elite Live Section
 * Rule #29: Pure View with Safeguard protection
 * Rule #16: Orchestration via Parent (useHomeData)
 * Rule #35: Derived Data Stability via useMemo
 */
const HomeComparisons = ({ comparisons = [], isLoading, error }) => {
    const visibleComparisons = useMemo(() => {
        return (comparisons || []).filter(c => c?.tool1 && c?.tool2).slice(0, 6);
    }, [comparisons]);

    return (
        <Safeguard error={error}>
            <section className={styles.comparisonsSection}>
                <SectionHeader
                    title="Live"
                    subtitle="Comparisons"
                    description="Real AI-powered battles. Discover which tools win head-to-head."
                    subtitleClassName={styles.blueGradientText}
                >
                    <span className={styles.livePill}>
                        <span className={styles.dot}></span> LIVE AI
                    </span>
                </SectionHeader>

                {!isLoading && visibleComparisons.length === 0 ? (
                    <EmptyState
                        title="No comparisons yet"
                        message="Be the first to compare AI tools and discover the winner."
                        icon={ArrowRightLeft}
                    />
                ) : (
                    <div className={styles.comparisonsGrid}>
                        {isLoading ? (
                            [1, 2, 3, 4, 5, 6].map(i => (
                                <div key={`skeleton-cmp-${i}`} className={styles.comparisonCard}>
                                    <div className={styles.skeletonBattle}>
                                        <Skeleton className={styles.skeletonIcon} />
                                        <Skeleton className={styles.skeletonVs} />
                                        <Skeleton className={styles.skeletonIcon} />
                                    </div>
                                    <Skeleton className={styles.skeletonLabel} />
                                </div>
                            ))
                        ) : (
                            visibleComparisons.map(item => {
                                const { tool1, tool2, ai_report_json } = item;
                                const winnerName = ai_report_json?.verdict?.winner;
                                const isWinner1 = winnerName === tool1.name;
                                const isWinner2 = winnerName === tool2.name;

                                return (
                                    <Link
                                        key={item.id}
                                        href={`/compare/${tool1.slug}-vs-${tool2.slug}`}
                                        className={styles.comparisonCard}
                                    >
                                        {/* Battle Track */}
                                        <div className={styles.battleTrack}>
                                            <div className={`${styles.toolSlot} ${isWinner1 ? styles.winnerGlow : ''}`}>
                                                <SmartImage
                                                    src={tool1.image_url}
                                                    alt={tool1.name}
                                                    fallbackIcon={Zap}
                                                />
                                                {isWinner1 && (
                                                    <span className={styles.trophyBadge}>
                                                        <Trophy size={9} />
                                                    </span>
                                                )}
                                            </div>

                                            <div className={styles.vsChip}>
                                                <ArrowRightLeft size={12} />
                                            </div>

                                            <div className={`${styles.toolSlot} ${isWinner2 ? styles.winnerGlow : ''}`}>
                                                <SmartImage
                                                    src={tool2.image_url}
                                                    alt={tool2.name}
                                                    fallbackIcon={Zap}
                                                />
                                                {isWinner2 && (
                                                    <span className={styles.trophyBadge}>
                                                        <Trophy size={9} />
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className={styles.cardInfo}>
                                            <span className={styles.toolNames}>
                                                {tool1.name} <span className={styles.vsText}>vs</span> {tool2.name}
                                            </span>
                                            <span className={styles.viewLink}>
                                                View Battle <ArrowRight size={12} />
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                )}

                {/* CTA */}
                {!isLoading && (
                    <div className={styles.ctaWrapper}>
                        <Button
                            as={Link}
                            href="/compare"
                            variant="text"
                            icon={ArrowRight}
                            iconPosition="right"
                            className={styles.viewAllBtn}
                        >
                            Start Your Own Comparison
                        </Button>
                    </div>
                )}
            </section>
        </Safeguard>
    );
};

export default HomeComparisons;
