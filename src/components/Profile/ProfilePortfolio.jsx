import React from 'react';
import { LayoutGrid } from 'lucide-react';
import ToolCard from '../ToolCard';
import styles from './ProfilePortfolio.module.css';

const ProfilePortfolio = ({ tools }) => {
    return (
        <div className={styles.portfolioSection}>
            <div className={styles.headerRow}>
                <h2 className={styles.title}>
                    Published <span className="gradient-text">Portfolio</span>
                </h2>
                <div className={styles.divider}></div>
            </div>

            {tools && tools.length > 0 ? (
                <div className={styles.grid}>
                    {tools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} />
                    ))}
                </div>
            ) : (
                <div className={styles.emptyPortfolioCard}>
                    <LayoutGrid className={styles.emptyIcon} />
                    <h3 className={styles.emptyTitle}>No active tools to show</h3>
                    <p className={styles.emptyText}>This user has a profile but hasn't listed any tools in our directory yet.</p>
                </div>
            )}
        </div>
    );
};

export default ProfilePortfolio;
