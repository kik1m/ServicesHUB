'use client';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import Input from '../ui/Input';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import Safeguard from '../ui/Safeguard';
import { HERO_CONSTANTS, SKELETON_COUNTS } from '../../constants/homeConstants';
import Image from 'next/image';
import styles from './HomeHero.module.css';

/**
 * HomeHero - Elite Entry Point
 * Rule #29: Pure View with Safeguard protection
 */
const HomeHero = ({ searchQuery, setSearchQuery, statsCount, isLoading, error, content, popularCategories = [] }) => {
    const router = useRouter();

    const handleSearch = useCallback(() => {
        if (searchQuery.trim()) {
            router.push(`/tools?q=${encodeURIComponent(searchQuery)}`);
        }
    }, [searchQuery, router]);

    const handleTagClick = useCallback((catName) => {
        router.push(`/tools?category=${encodeURIComponent(catName)}`);
    }, [router]);

    return (
        <header className={styles.heroSectionSlim}>
            <div className={styles.mouseGlow} />
            <Safeguard error={error}>
                <div className={styles.heroContent}>
                    <div className={styles.logoWrapper}>
                        <Image 
                            src="/logo.png" 
                            alt="Hubly Logo" 
                            width={64} 
                            height={64} 
                            className={styles.heroLogo} 
                            priority 
                        />
                    </div>
                    <div className={styles.badge}>{content.badge}</div>
                    <h1 className={`${styles.heroTitleSlim} ${styles.gradientText}`}>
                        {content.title} {content.highlight}
                    </h1>
                    <p className={styles.heroSubtitleSlim}>
                        {content.subtitle}
                    </p>

                    <div className={styles.heroSearchContainer}>
                        {isLoading ? (
                            <div className={styles.skeletonSearch}>
                                <Skeleton className={styles.skeletonSearchInner} />
                            </div>
                        ) : (
                        <Input 
                            icon={SearchIcon}
                            rightIcon={ArrowRight}
                            onRightIconClick={handleSearch}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder={content.searchPlaceholder}
                            wrapperClassName={styles.heroSearchInput}
                        />
                        )}
                    </div>

                    <div className={styles.popularTags}>
                        <span>{content.popularLabel}</span>
                        {isLoading ? (
                            <div className={styles.skeletonTags}>
                                {SKELETON_COUNTS.HERO_TAGS.map(i => <Skeleton key={`skeleton-tag-${i}`} className={styles.skeletonTagInner} />)}
                            </div>
                        ) : (
                            popularCategories.slice(0, 5).map(cat => (
                                <Button 
                                    key={cat.id} 
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleTagClick(cat.name)} 
                                    className={styles.tagLink}
                                >
                                    {cat.name}
                                </Button>
                            ))
                        )}
                    </div>

                    <div className={styles.trustLogos}>
                        <p>{content.logosPrefix}</p>
                        <div className={styles.logoRow}>
                            {content.logos.map(logo => (
                                <div key={logo} className={styles.logoItemWrapper}>
                                    <span className={styles.logoDot}>•</span>
                                    <span className={styles.logoItem}>{logo}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Safeguard>
        </header>
    );
};

export default HomeHero;
