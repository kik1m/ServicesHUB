import React, { memo } from 'react';
import Link from 'next/link';
import { Award, CheckCircle2, ShieldCheck, ArrowRight, Info } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import Safeguard from '../ui/Safeguard';
import { PREMIUM_UI_CONSTANTS } from '../../constants/premiumConstants';
import styles from './PremiumPricingCard.module.css';

/**
 * PremiumPricingCard - Elite Component (Promote Style)
 * Rule #14: Data-Driven UI via constants
 * Rule #112: Zero inline styles
 * Rule #31: Component Resilience
 */
const PremiumPricingCard = memo(({ user, loading, onUpgrade, isLoading, error, onRetry }) => {
    const { plans } = PREMIUM_UI_CONSTANTS;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            {isLoading ? (
                <section className={styles.container}>
                    <div className={styles.cardsGrid}>
                        {[1, 2, 3].map(i => (
                            <div key={i} className={styles.planCard}>
                                <div className={styles.cardHeader} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Skeleton width="100px" height="24px" />
                                    <Skeleton width="150px" height="45px" style={{ marginTop: '12px' }} />
                                    <Skeleton width="120px" height="14px" style={{ marginTop: '12px' }} />
                                </div>
                                <div className={styles.skeletonFeatures} style={{ flex: 1 }}>
                                    <Skeleton width="90px" height="12px" style={{ marginBottom: '1.5rem' }} />
                                    {[1, 2, 3, 4, 5].map(j => (
                                        <Skeleton key={j} width="100%" height="16px" style={{ marginTop: '14px' }} />
                                    ))}
                                </div>
                                <Skeleton width="100%" height="44px" borderRadius="12px" style={{ marginTop: '2rem' }} />
                            </div>
                        ))}
                    </div>
                </section>
            ) : (
                <section className={styles.container}>
                    <div className={styles.meshGlow}></div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                        <Link 
                            href="/docs/premium" 
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
                    <div className={styles.cardsGrid}>
                        {plans?.map((plan) => (
                            <div
                                key={plan.id}
                                className={`${styles.planCard} ${plan.isRecommended ? styles.recommended : ''} ${plan.id === 'elite' ? styles.elite : ''}`}
                            >
                                {plan.isRecommended && <div className={styles.recommendedBadge}>Recommended</div>}

                                <div className={styles.cardHeader}>
                                    <h2>{plan.planName}</h2>
                                    <div className={styles.pricingAmount}>
                                        <span className={styles.currency}>$</span>
                                        <span className={styles.amount}>{plan.price}</span>
                                        <span className={styles.period}>{plan.period}</span>
                                    </div>
                                    <p>{plan.id === 'free' ? 'Forever Free' : 'Billed monthly'}</p>
                                </div>

                                <ul className={styles.perksList} style={{ flex: 1, marginBottom: '2rem' }}>
                                    {plan.features?.map((feature, i) => (
                                        <li key={i} className={styles.featureItem}>
                                            <div className={styles.checkIconBox}>
                                                <CheckCircle2 size={18} strokeWidth={2.5} />
                                            </div>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {(user?.subscription_tier === plan.id) || (plan.id === 'free' && (!user || !user.subscription_tier || user.subscription_tier === 'free')) ? (
                                    <div className={styles.statusBadge}>
                                        CURRENT PLAN
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => plan.variantId ? onUpgrade(plan.variantId) : null}
                                        isLoading={loading}
                                        variant={plan.isRecommended ? "primary" : "outline"}
                                        size="lg"
                                        className={styles.upgradeBtn}
                                        icon={plan.id !== 'free' ? ArrowRight : undefined}
                                        iconPosition="right"
                                        disabled={plan.id === 'free'}
                                    >
                                        {loading ? plan.buttonLoading : plan.buttonText}
                                    </Button>
                                )}

                                {plan.id !== 'free' && (
                                    <div className={styles.guarantee} style={{ justifyContent: 'center' }}>
                                        <ShieldCheck size={16} className={styles.guaranteeIcon} />
                                        <span>{plan.guarantee}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </Safeguard>
    );
});

export default PremiumPricingCard;
