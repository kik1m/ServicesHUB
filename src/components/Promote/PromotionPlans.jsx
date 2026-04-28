import React, { memo } from 'react';
import Skeleton from '../ui/Skeleton';
import PromotionCard from './PromotionCard';
import styles from './PromotionPlans.module.css';

/**
 * PromotionPlans - Elite Orchestrator
 * Rule #16: Component Orchestration
 */
const PromotionPlans = ({ plans, handlePromote, loadingPlan, selectedToolId, isLoading, content }) => {
    return (
        <div className={styles.plansContainer}>
            <div className={styles.sectionHeader}>
                <div className={styles.stepBadge}>STEP 2</div>
                <h3 className={styles.sectionTitle}>{content.title}</h3>
            </div>

            {(isLoading || !plans.length) ? (
                <div className={styles.plansGrid}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className={styles.skeletonCard}>
                            <div className={styles.skeletonHeader}>
                                <Skeleton width="120px" height="24px" />
                                <Skeleton width="180px" height="48px" style={{ marginTop: '15px' }} />
                                <Skeleton width="100%" height="16px" style={{ marginTop: '10px' }} />
                            </div>
                            <div className={styles.skeletonDivider} />
                            <div className={styles.skeletonBody}>
                                <Skeleton width="100px" height="14px" />
                                {[1, 2, 3, 4].map(j => (
                                    <Skeleton key={j} width="90%" height="16px" style={{ marginTop: '12px' }} />
                                ))}
                            </div>
                            <Skeleton width="100%" height="48px" borderRadius="12px" style={{ marginTop: 'auto' }} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.plansGrid}>
                {plans.map((plan) => (
                    <PromotionCard 
                        key={plan.id}
                        plan={plan}
                        onSelect={handlePromote}
                        isLoading={loadingPlan === plan.name}
                        disabled={!selectedToolId}
                        content={content}
                    />
                ))}
            </div>
            )}
        </div>
    );
};

export default memo(PromotionPlans);
