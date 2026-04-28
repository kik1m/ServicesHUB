import React, { memo } from 'react';
import { Award, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
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
    const { pricing } = PREMIUM_UI_CONSTANTS;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            {isLoading ? (
                <section className={styles.container}>
                    <div className={styles.glassPanel}>
                        {/* Features Column Skeleton */}
                        <div className={styles.featuresCol}>
                            <div className={styles.featureHeader}>
                                <Skeleton width="64px" height="64px" borderRadius="20px" />
                                <div className={styles.skeletonInfo}>
                                    <Skeleton width="180px" height="28px" className={styles.skeletonTitle} />
                                    <Skeleton width="240px" height="16px" />
                                </div>
                            </div>
                            <div className={styles.skeletonFeatures}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className={styles.skeletonFeature}>
                                        <Skeleton width="28px" height="28px" borderRadius="9px" />
                                        <Skeleton width="70%" height="20px" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Pricing Column Skeleton */}
                        <div className={styles.pricingCol}>
                            <Skeleton width="140px" height="32px" borderRadius="100px" className={styles.skeletonPricingHeader} />
                            <Skeleton width="220px" height="80px" className={styles.skeletonAmount} />
                            <Skeleton width="100%" height="54px" borderRadius="14px" />
                        </div>
                    </div>
                </section>
            ) : (
                <section className={styles.container}>
                    <div className={styles.meshGlow}></div>
                    <div className={styles.glassPanel}>
                        <div className={styles.featuresCol}>
                            <div className={styles.featureHeader}>
                                <div className={styles.iconBox}>
                                    <Award size={28} />
                                </div>
                                <div>
                                    <h2>{pricing?.planName}</h2>
                                    <p>{PREMIUM_UI_CONSTANTS?.hero?.subtitle}</p>
                                </div>
                            </div>

                            <ul className={styles.perksList}>
                                {pricing?.features?.map((feature, i) => (
                                    <li key={i} className={styles.featureItem}>
                                        <div className={styles.checkIconBox}>
                                            <CheckCircle2 size={18} strokeWidth={2.5} />
                                        </div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.pricingCol}>
                            <div className={styles.badge}>LIFETIME ACCESS</div>
                            
                            <div className={styles.pricingAmount}>
                                <span className={styles.currency}>$</span>
                                <span className={styles.amount}>{pricing?.price}</span>
                                <div className={styles.period}>{pricing?.period}</div>
                            </div>

                            {user?.is_premium ? (
                                <div className={styles.statusBadge}>
                                    ALREADY A PRIME MEMBER
                                </div>
                            ) : (
                                <Button
                                    onClick={onUpgrade}
                                    isLoading={loading}
                                    variant="primary"
                                    size="lg"
                                    className={styles.upgradeBtn}
                                    icon={ArrowRight}
                                    iconPosition="right"
                                >
                                    {loading ? pricing?.buttonLoading : pricing?.buttonText}
                                </Button>
                            )}

                            <div className={styles.guarantee}>
                                <ShieldCheck size={18} className={styles.guaranteeIcon} />
                                <span>{pricing?.guarantee}</span>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </Safeguard>
    );
});

export default PremiumPricingCard;
