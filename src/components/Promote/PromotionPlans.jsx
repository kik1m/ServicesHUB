import React from 'react';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import styles from './PromotionPlans.module.css';

const PromotionPlans = ({ plans, handlePromote, loadingPlan, selectedToolId }) => {
    return (
        <section className={styles.promoteStepCard}>
            <div className={styles.sectionHeaderCompact}>
                <div className={styles.badgeStep}>STEP 2</div>
                <h3>Choose Promotion Level</h3>
            </div>

            <div className={styles.promotePlansGrid}>
                {plans.map((plan) => (
                    <div key={plan.id} className={styles.promotePlanCard}>
                        <div className={styles.planGlowOverlay} style={{
                            background: `radial-gradient(circle at 50% 10%, ${plan.glow} 0%, transparent 60%)`
                        }}></div>

                        {plan.recommended && (
                            <div className={styles.recommendedBadge} style={{ background: plan.theme }}>MOST POPULAR</div>
                        )}

                        <div className={styles.planTitleBox}>
                            <h4>{plan.name}</h4>
                            <p>{plan.desc}</p>
                        </div>

                        <div className={styles.planPriceTag}>
                            <span className={styles.amount}>{plan.price}</span>
                            <span className={styles.period}>{plan.period}</span>
                        </div>

                        <ul className={styles.planFeaturesList}>
                            {plan.features.map((f, i) => (
                                <li key={i}>
                                    <CheckCircle2 size={18} style={{ color: plan.theme }} />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handlePromote(plan)}
                            disabled={loadingPlan === plan.name || !selectedToolId}
                            className={styles.planCtaBtn}
                            style={{
                                background: plan.theme,
                                boxShadow: selectedToolId ? `0 10px 30px ${plan.glow}` : 'none',
                                opacity: selectedToolId ? 1 : 0.4,
                                cursor: selectedToolId ? 'pointer' : 'not-allowed'
                            }}
                        >
                            {loadingPlan === plan.name ? <Loader2 className="animate-spin" /> : <>{plan.cta} <ArrowRight size={20} /></>}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PromotionPlans;
