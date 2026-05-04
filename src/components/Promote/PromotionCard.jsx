import React, { memo } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import Safeguard from '../ui/Safeguard';
import styles from './PromotionCard.module.css';

/**
 * PromotionCard - Elite Component
 * Rule #112: Zero Inline Styles
 * Rule #19: Atomic Design Standard
 */
const PromotionCard = ({ plan, onSelect, isLoading, error, onRetry, disabled, activePlan, content }) => {
    const isCurrentPlanActive = activePlan && activePlan.name === plan.name;
    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={`${styles.card} ${plan?.recommended ? styles.recommended : ''} ${isCurrentPlanActive ? styles.locked : ''}`}>
                {plan?.recommended && !isCurrentPlanActive && (
                    <div className={styles.popularBadge}>
                        {content?.featured}
                    </div>
                )}
                {isCurrentPlanActive && (
                    <div className={styles.lockedBadge}>✓ Plan Active</div>
                )}

                <div className={styles.header}>
                    <h4 className={styles.name}>{plan?.name}</h4>
                    <div className={styles.priceContainer}>
                        <span className={styles.currency}>{content?.currency}</span>
                        <span className={styles.amount}>{plan?.price?.replace('$', '')}</span>
                        <span className={styles.period}>/ {plan?.period}</span>
                    </div>
                    <p className={styles.description}>
                        {content?.duration?.replace('{days}', plan?.id === 'basic' ? '7' : plan?.id === 'pro' ? '15' : '30')}
                    </p>
                </div>

                <div className={styles.divider} />

                <div className={styles.benefitsSection}>
                    <h5 className={styles.benefitsTitle}>{content?.benefits}</h5>
                    <ul className={styles.featuresList}>
                        {plan?.features?.map((feature, idx) => (
                            <li key={idx} className={styles.featureItem}>
                                <div className={styles.iconWrapper}>
                                    <CheckCircle2 size={16} />
                                </div>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <Button
                    onClick={() => onSelect(plan)}
                    isLoading={isLoading}
                    disabled={disabled}
                    className={`${styles.ctaBtn} ${styles['btn_' + plan?.id]}`}
                    icon={isCurrentPlanActive ? null : ArrowRight}
                    iconPosition="right"
                    iconSize={20}
                    variant={isCurrentPlanActive ? 'secondary' : (plan?.recommended ? 'primary' : 'secondary')}
                >
                    {isCurrentPlanActive ? 'Already Active' : content?.cta}
                </Button>
            </div>
        </Safeguard>
    );
};

export default memo(PromotionCard);
