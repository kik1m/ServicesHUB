import React, { useMemo, memo } from 'react';
import { LayoutGrid } from 'lucide-react';
import ToolCard from '../ToolCard';
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
                        Array.from({ length: PROFILE_UI_CONSTANTS.SKELETON_COUNTS?.PORTFOLIO || 3 }).map((_, i) => (
                            <ToolCard key={`skeleton-portfolio-${i}`} isLoading={true} />
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
