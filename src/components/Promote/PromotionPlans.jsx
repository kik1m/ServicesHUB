import React from 'react';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

const PromotionPlans = ({ plans, handlePromote, loadingPlan, selectedToolId }) => {
    return (
        <section className="promote-step-card">
            <div className="section-header-compact">
                <div className="badge-step">STEP 2</div>
                <h3>Choose Promotion Level</h3>
            </div>

            <div className="promote-plans-grid">
                {plans.map((plan) => (
                    <div key={plan.id} className="promote-plan-card">
                        <div className="plan-glow-overlay" style={{
                            background: `radial-gradient(circle at 50% 10%, ${plan.glow} 0%, transparent 60%)`
                        }}></div>

                        {plan.recommended && (
                            <div className="recommended-badge" style={{ background: plan.theme }}>MOST POPULAR</div>
                        )}

                        <div className="plan-title-box">
                            <h4>{plan.name}</h4>
                            <p>{plan.desc}</p>
                        </div>

                        <div className="plan-price-tag">
                            <span className="amount">{plan.price}</span>
                            <span className="period">{plan.period}</span>
                        </div>

                        <ul className="plan-features-list">
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
                            className="plan-cta-btn"
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
