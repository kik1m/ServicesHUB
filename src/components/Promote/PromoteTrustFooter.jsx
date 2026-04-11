import React from 'react';
import { ShieldCheck, CheckCircle2, TrendingUp, Star } from 'lucide-react';
import styles from './PromoteTrustFooter.module.css';

const PromoteTrustFooter = () => {
    return (
        <footer className={styles.promoteTrustFooter}>
            <div className={styles.trustIconBox}>
                <ShieldCheck size={42} className={styles.successGreen} />
            </div>
            <h3>Secure Global Promotion</h3>
            <p className={styles.trustDesc}>
                Trusted by 500+ SaaS founders. Our payment processing is handled securely via <strong>Lemon Squeezy</strong>.
            </p>
            <div className={styles.trustTagsRow}>
                {[
                    { label: 'Lemon Squeezy', icon: <CheckCircle2 size={16} className={styles.successGreen} /> },
                    { label: 'Instant Activation', icon: <TrendingUp size={16} /> },
                    { label: 'Analytics Included', icon: <Star size={16} /> }
                ].map((tag, i) => (
                    <div key={i} className={styles.trustTagItem}>
                        <span>{tag.icon}</span> {tag.label}
                    </div>
                ))}
            </div>
        </footer>
    );
};

export default PromoteTrustFooter;
