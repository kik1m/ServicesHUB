import React, { memo } from 'react';
import Skeleton from '../ui/Skeleton';
import Link from 'next/link';
import { Info, ArrowRight } from 'lucide-react';
import PromotionCard from './PromotionCard';
import Safeguard from '../ui/Safeguard';
import styles from './PromotionPlans.module.css';

/**
 * PromotionPlans - Elite Orchestrator
 * Rule #16: Component Orchestration
 */
const PromotionPlans = ({ plans = [], handlePromote, loadingPlan, selectedToolId, activePlan, checkingPlan, isLoading, error, onRetry, content }) => {
    return (
        <Safeguard error={error} onRetry={onRetry} title="Plans Unavailable">
            <div className={styles.plansContainer}>
                <div className={styles.sectionHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div className={styles.stepBadge}>STEP 2</div>
                        <h2 className={styles.sectionTitle}>{content?.title}</h2>
                    </div>
                    <Link 
                        href="/docs/promotions" 
                        style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            padding: '8px 20px', 
                            background: 'rgba(0, 210, 255, 0.08)', 
                            border: '1px solid rgba(0, 210, 255, 0.2)', 
                            borderRadius: '100px', 
                            color: 'var(--accent)', 
                            fontSize: '0.85rem', 
                            fontWeight: '600', 
                            textDecoration: 'none',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 210, 255, 0.15)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 210, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 210, 255, 0.08)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <Info size={16} />
                        <span>Docs</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {(isLoading || checkingPlan || !plans?.length) ? (
                    <div className={styles.plansGrid}>
                        {[1, 2, 3].map(i => (
                            <div key={i} className={styles.skeletonCard}>
                                <div className={styles.skeletonHeader}>
                                    <Skeleton width="80px" height="20px" />
                                    <Skeleton width="160px" height="40px" style={{ marginTop: '12px' }} />
                                    <Skeleton width="100%" height="12px" style={{ marginTop: '8px' }} />
                                </div>
                                <div className={styles.skeletonDivider} />
                                <div className={styles.skeletonBody}>
                                    <Skeleton width="100px" height="12px" style={{ marginBottom: '1rem' }} />
                                    {[1, 2, 3, 4, 5].map(j => (
                                        <Skeleton key={j} width="100%" height="14px" style={{ marginTop: '10px' }} />
                                    ))}
                                </div>
                                <Skeleton width="100%" height="44px" borderRadius="12px" style={{ marginTop: '2rem' }} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.plansGrid}>
                    {plans?.map((plan) => (
                        <PromotionCard 
                            key={plan?.id}
                            plan={plan}
                            onSelect={handlePromote}
                            isLoading={loadingPlan === plan?.name}
                            disabled={!selectedToolId || (activePlan && activePlan.name === plan.name)}
                            activePlan={activePlan}
                            content={content}
                        />
                    ))}
                </div>
                )}
            </div>
        </Safeguard>
    );
};

export default memo(PromotionPlans);
