import React, { useMemo, memo } from 'react';
import { LayoutGrid } from 'lucide-react';
import ToolCard from '../ToolCard';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ProfilePortfolio.module.css';
import { PROFILE_UI_CONSTANTS } from '../../constants/profileConstants';

/**
 * ProfilePortfolio - Elite Component
 * Rule #29: Pure View with Safeguard protection
 */
const ProfilePortfolio = memo(({ tools, isLoading, error, onRetry }) => {
    const portLabels = PROFILE_UI_CONSTANTS.public.portfolio;

    const safeTools = useMemo(() => {
        return (tools || []).filter(tool => tool && (tool.id || tool.slug));
    }, [tools]);

    return (
        <Safeguard error={error} onRetry={onRetry} title="Portfolio Unavailable">
            <div className={`${styles.portfolioSection} fade-in`}>
                <div className={styles.headerRow}>
                    <h2 className={styles.title}>
                        {portLabels?.titleStart} <span className="gradient-text">{portLabels?.titleHighlight}</span>
                    </h2>
                    <div className={styles.divider}></div>
                </div>

                <div className={styles.grid}>
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={`skeleton-portfolio-${i}`} className={styles.skeletonCardWrapper}>
                                <Skeleton height="280px" borderRadius="24px" />
                            </div>
                        ))
                    ) : safeTools.length > 0 ? (
                        safeTools.map(tool => (
                            <ToolCard key={tool?.id || tool?.slug} tool={tool} />
                        ))
                    ) : (
                        <div className={styles.emptyPortfolioCard}>
                            <LayoutGrid className={styles.emptyIcon} />
                            <h3 className={styles.emptyTitle}>{portLabels?.emptyTitle}</h3>
                            <p className={styles.emptyText}>{portLabels?.emptyText}</p>
                        </div>
                    )}
                </div>
            </div>
        </Safeguard>
    );
});

export default ProfilePortfolio;
