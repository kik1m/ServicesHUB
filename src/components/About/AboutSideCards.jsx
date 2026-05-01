import React, { memo } from 'react';
import { Rocket, Sparkles, Plus } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import Safeguard from '../ui/Safeguard';
import styles from './AboutSideCards.module.css';
import { ABOUT_UI_CONSTANTS } from '../../constants/aboutConstants';
import AboutFounderCard from './AboutFounderCard';

/**
 * AboutSideCards - Elite Component
 * Rule #14: Data-Driven UI
 * Rule #112: Zero inline styles
 */
const AboutSideCards = ({ isLoading, error, onRetry }) => {
    const data = ABOUT_UI_CONSTANTS.sideCards;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.sideStack}>
                {isLoading ? (
                    [1, 2].map(i => (
                        <div key={i} className={styles.card}>
                            <Skeleton className={styles.skeletonIcon} />
                            <Skeleton className={styles.skeletonTitle} />
                            <Skeleton className={styles.skeletonLine} />
                            <Skeleton className={styles.skeletonLineSmall} />
                        </div>
                    ))
                ) : (
                    <>
                        <AboutFounderCard />

                        <div className={styles.card}>
                            <div className={styles.iconBox}>
                                <Rocket size={20} />
                            </div>
                            <h3 className={styles.cardTitle}>{data?.vision?.title}</h3>
                            <p className={styles.cardDesc}>{data?.vision?.description}</p>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.iconBox}>
                                <Sparkles size={20} />
                            </div>
                            <h3 className={styles.cardTitle}>{data?.growth?.title}</h3>
                            <p className={styles.cardDesc}>{data?.growth?.description}</p>
                        </div>

                        <div className={`${styles.card} ${styles.joinCard}`}>
                            <h3 className={styles.joinTitle}>{data?.join?.title}</h3>
                            <p className={styles.joinDesc}>{data?.join?.description}</p>
                            <Button 
                                variant="primary" 
                                className={styles.joinBtn} 
                                icon={Plus} 
                                iconPosition="right"
                                to="/submit-tool"
                            >
                                {data?.join?.button}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Safeguard>
    );
};

export default memo(AboutSideCards);
