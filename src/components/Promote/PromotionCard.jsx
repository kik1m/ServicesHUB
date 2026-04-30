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
const PromotionCard = ({ plan, onSelect, isLoading, error, onRetry, disabled, content }) => {
    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={`${styles.card} ${plan?.recommended ? styles.recommended : ''}`}>
                {plan?.recommended && (
                    <div className={styles.popularBadge}>
                        {content?.featured}
                    </div>
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
                    icon={ArrowRight}
                    iconPosition="right"
                    variant={plan?.recommended ? 'primary' : 'secondary'}
                >
                    {content?.cta}
                </Button>
            </div>
        </Safeguard>
    );
};

export default memo(PromotionCard);
