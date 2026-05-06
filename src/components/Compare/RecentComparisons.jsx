import React from 'react';
import { useNavigate } from 'react-router-dom';
import { History, ArrowRightLeft, Trophy, Sparkles } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import SmartImage from '../ui/SmartImage';
import { COMPARE_UI_CONSTANTS } from '../../constants/compareConstants';
import styles from './RecentComparisons.module.css';

/**
 * RecentComparisons - Elite v5.0
 * Displays a curated list of recent AI tool battles to inspire users.
 */
const RecentComparisons = ({ comparisons, isLoading }) => {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <Skeleton width="150px" height="24px" />
                </div>
                <div className={styles.grid}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className={styles.skeletonCard}>
                            <Skeleton width="100%" height="80px" borderRadius="16px" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!comparisons || comparisons.length === 0) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <History size={18} className={styles.titleIcon} />
                    <h3>{COMPARE_UI_CONSTANTS.recent.title}</h3>
                </div>
                <div className={styles.badge}>
                    <Sparkles size={12} />
                    <span>{COMPARE_UI_CONSTANTS.recent.badge}</span>
                </div>
            </div>

            <div className={styles.grid}>
                {comparisons.map((item) => {
                    const { tool1, tool2, ai_report_json } = item;
                    if (!tool1 || !tool2) return null;
                    
                    const winnerName = ai_report_json?.verdict?.winner;
                    const isWinner1 = winnerName === tool1.name;
                    const isWinner2 = winnerName === tool2.name;

                    return (
                        <div 
                            key={item.id} 
                            className={styles.card}
                            onClick={() => navigate(`/compare/${tool1.slug}-vs-${tool2.slug}`)}
                        >
                            <div className={styles.battleTrack}>
                                <div className={`${styles.toolMini} ${isWinner1 ? styles.winnerGlow : ''}`}>
                                    <SmartImage 
                                        src={tool1.image_url} 
                                        alt={tool1.name} 
                                        className={styles.toolIcon} 
                                        objectFit="contain"
                                    />
                                    {isWinner1 && <Trophy size={10} className={styles.trophyIcon} />}
                                </div>
                                
                                <div className={styles.vsDivider}>
                                    <ArrowRightLeft size={14} className={styles.vsIcon} />
                                </div>

                                <div className={`${styles.toolMini} ${isWinner2 ? styles.winnerGlow : ''}`}>
                                    <SmartImage 
                                        src={tool2.image_url} 
                                        alt={tool2.name} 
                                        className={styles.toolIcon} 
                                        objectFit="contain"
                                    />
                                    {isWinner2 && <Trophy size={10} className={styles.trophyIcon} />}
                                </div>
                            </div>
                            
                            <div className={styles.cardInfo}>
                                <span className={styles.names}>
                                    {tool1.name} vs {tool2.name}
                                </span>
                                <div className={styles.viewLink}>
                                    {COMPARE_UI_CONSTANTS.recent.view}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentComparisons;
