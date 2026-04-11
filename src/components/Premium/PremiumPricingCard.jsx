import React from 'react';
import { Award, Rocket, Star, Zap, Globe, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import styles from './PremiumPricingCard.module.css';

const PremiumPricingCard = ({ user, loading, onUpgrade }) => {
    const perks = [
        { title: 'Unlimited Tool Submissions', desc: 'List your innovations without bounds.', icon: <Rocket size={16} /> },
        { title: 'Golden Verification Badge', desc: 'Diamond status on profile and every tool.', icon: <Star size={16} /> },
        { title: 'Priority Support & Review', desc: 'Jump to the front of the queue.', icon: <Zap size={16} /> },
        { title: 'Performance Insights', desc: 'Advanced analytics in your dashboard.', icon: <Globe size={16} /> }
    ];

    return (
        <section className={styles.premiumMainCardContainer}>
            <div className={styles.goldMeshGlow}></div>

            <div className={styles.premiumGlassPanel}>
                {/* Features Column */}
                <div className={styles.premiumFeaturesCol}>
                    <div className={styles.featureHeader}>
                        <div className={styles.awardIconBox}>
                            <Award size={24} color="#FFD700" />
                        </div>
                        <div>
                            <h2>Membership Perks</h2>
                            <p>Scale with Diamond status.</p>
                        </div>
                    </div>

                    <ul className={styles.perksList}>
                        {perks.map((item, i) => (
                            <li key={i} className={styles.premiumFeatureItem}>
                                <div className={styles.featureIconBox}>
                                    {item.icon}
                                </div>
                                <div className={styles.featureContent}>
                                    <strong>{item.title}</strong>
                                    <span>{item.desc}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Pricing Column */}
                <div className={styles.premiumPricingCol}>
                    <div className={styles.pricingTagBadge}>LIFETIME DEAL</div>
                    
                    <div className={styles.pricingAmountRow}>
                        <span className={styles.currency}>$</span>
                        <span className={styles.amount}>120</span>
                        <span className={styles.period}>ONE-TIME</span>
                    </div>

                    <div style={{ width: '100%', marginBottom: '2rem' }}>
                        {user?.is_premium ? (
                            <div className={styles.premiumBadgeStatus}>
                                ALREADY A PREMIUM MEMBER
                            </div>
                        ) : (
                            <button
                                onClick={onUpgrade}
                                disabled={loading}
                                className={styles.btnPremiumCheckout}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Get Access Now <ArrowRight size={20} /></>}
                            </button>
                        )}
                    </div>

                    <div className={styles.secureFooter}>
                        <ShieldCheck size={16} color="#00ffaa" />
                        <span>Secure payments via <strong>Lemon Squeezy</strong></span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PremiumPricingCard;
