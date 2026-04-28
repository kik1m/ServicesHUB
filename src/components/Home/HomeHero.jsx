import React, { useCallback } from 'react';
import SearchBar from '../ui/SearchBar';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import Safeguard from '../ui/Safeguard';
import { HERO_CONSTANTS, SKELETON_COUNTS } from '../../constants/homeConstants';
import styles from './HomeHero.module.css';

const UsersGroup = ({ isLoading }) => (
    <div className={styles.userTrustBox}>
        <div className={styles.avatarGroup}>
            {isLoading ? (
                SKELETON_COUNTS.HERO_AVATARS.map((i) => (
                    <div key={`skeleton-avatar-${i}`} className={styles.avatarMini}>
                        <Skeleton width="100%" height="100%" borderRadius="50%" />
                    </div>
                ))
            ) : (
                HERO_CONSTANTS.TRUST_AVATARS.filter(Boolean).map((img, i) => (
                    <div key={`avatar-${i}`} className={styles.avatarMini}>
                        <img src={img} alt={`User ${i + 1}`} className={styles.avatarImg} />
                    </div>
                ))
            )}
        </div>
    </div>
);

/**
 * HomeHero - Elite Entry Point
 * Rule #29: Pure View with Safeguard protection
 */
const HomeHero = ({ searchQuery, setSearchQuery, navigate, statsCount, isLoading, error, content, popularCategories = [] }) => {
    const handleSearch = useCallback(() => {
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery}`);
        }
    }, [searchQuery, navigate]);

    const handleTagClick = useCallback((catName) => {
        navigate(`/search?category=${encodeURIComponent(catName)}`);
    }, [navigate]);

    const usersCount = statsCount?.users ?? HERO_CONSTANTS.DEFAULT_USERS_COUNT;

    return (
        <header className={styles.heroSectionSlim}>
            <Safeguard error={error}>
                <div className={styles.heroContent}>
                    <div className={styles.badge}>{content.badge}</div>
                    <h1 className={styles.heroTitleSlim}>
                        {content.title} <span className={styles.gradientText}>{content.highlight}</span>
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
                            <SearchBar 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onSearch={handleSearch}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder={content.searchPlaceholder}
                                className={styles.heroSearchOverride}
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

                    <div className={styles.heroCtaWrapper}>
                        <div className={styles.userTrust}>
                            <UsersGroup isLoading={isLoading} /> 
                            {isLoading ? (
                                <div className={styles.skeletonTrust}>
                                    <Skeleton className={styles.skeletonTrustInner} />
                                </div>
                            ) : (
                                <span>{content.trustPrefix} <strong className={styles.strongText}>{usersCount.toLocaleString()}</strong> {content.trustSuffix}</span>
                            )}
                        </div>
                    </div>

                    <div className={styles.trustLogos}>
                        <p>{content.logosPrefix}</p>
                        <div className={styles.logoRow}>
                            {content.logos.map(logo => (
                                <span key={logo} className={styles.logoItem}>{logo}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </Safeguard>
        </header>
    );
};

export default HomeHero;
