import React from 'react';
import { HelpCircle } from 'lucide-react';
import styles from './PremiumFAQ.module.css';

const PremiumFAQ = () => {
    const faqs = [
        { q: 'Is it really a one-time payment?', a: 'Yes. No recurring monthly fees. Once you pay $120, your account is upgraded for life.' },
        { q: 'How does tool promotion work?', a: 'Tool promotions are separate. Premium membership gives you the status and limits, while Promotions (Featured) boost specific tools.' },
        { q: 'Can I get a refund?', a: 'Due to the digital nature of the services and instant activation, we usually do not offer refunds once the membership is active.' },
        { q: 'Is it personal or business?', a: 'You can use it for both! Whether you are an individual creator or a startup building multiple tools.' }
    ];

    return (
        <section className={styles.faqSection}>
            <div className={styles.faqHeader}>
                <h2>Common Questions</h2>
            </div>

            <div className={styles.premiumFaqGrid}>
                {faqs.map((item, i) => (
                    <div key={i} className={styles.faqCard}>
                        <div className={styles.faqContent}>
                            <HelpCircle size={22} color="var(--primary)" style={{ flexShrink: 0 }} />
                            <div>
                                <h4>{item.q}</h4>
                                <p>{item.a}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PremiumFAQ;
