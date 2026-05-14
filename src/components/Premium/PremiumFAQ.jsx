import React, { memo } from 'react';
import { HelpCircle } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import { PREMIUM_UI_CONSTANTS } from '../../constants/premiumConstants';
import styles from './PremiumFAQ.module.css';

/**
 * PremiumFAQ - Elite Component
 * Rule #14: Data-Driven UI via constants
 * Rule #112: Zero inline styles
 * Rule #31: Component Resilience
 */
const PremiumFAQ = memo(({ isLoading, error, onRetry }) => {
    const { faq } = PREMIUM_UI_CONSTANTS;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            {isLoading ? (
                <section className={styles.faqSection}>
                    <div className={styles.skeletonHeader}>
                        <Skeleton width="300px" height="36px" />
                    </div>
                    <div className={styles.faqGrid}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={styles.faqCard}>
                                <div className={styles.faqContent}>
                                    <Skeleton width="24px" height="24px" borderRadius="100px" />
                                    <div className={styles.skeletonContent}>
                                        <Skeleton width="70%" height="20px" className={styles.skeletonQ} />
                                        <Skeleton width="100%" height="14px" />
                                        <Skeleton width="90%" height="14px" className={styles.skeletonA} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ) : (
                <section className={styles.faqSection}>
                    <div className={styles.faqHeader}>
                        <h2>
                            {faq?.title} <span className="gradient-text">{faq?.highlight}</span>
                        </h2>
                    </div>

                    <div className={styles.faqGrid}>
                        {faq?.items?.map((item, i) => (
                            <div key={i} className={styles.faqCard}>
                                <div className={styles.faqContent}>
                                    <HelpCircle size={24} className={styles.faqIcon} />
                                    <div>
                                        <h4>{item?.q}</h4>
                                        <p>{item?.a}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </Safeguard>
    );
});

export default PremiumFAQ;
