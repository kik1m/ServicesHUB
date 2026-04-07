import React from 'react';
import { HelpCircle } from 'lucide-react';

const PremiumFAQ = () => {
    const faqs = [
        { q: 'Is it really a one-time payment?', a: 'Yes. No recurring monthly fees. Once you pay $120, your account is upgraded for life.' },
        { q: 'How does tool promotion work?', a: 'Tool promotions are separate. Premium membership gives you the status and limits, while Promotions (Featured) boost specific tools.' },
        { q: 'Can I get a refund?', a: 'Due to the digital nature of the services and instant activation, we usually do not offer refunds once the membership is active.' },
        { q: 'Is it personal or business?', a: 'You can use it for both! Whether you are an individual creator or a startup building multiple tools.' }
    ];

    return (
        <section style={{ marginTop: '7rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '2.2rem', fontWeight: '900', margin: 0 }}>Common Questions</h2>
            </div>

            <div className="premium-faq-grid">
                {faqs.map((item, i) => (
                    <div key={i} className="glass-card" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <HelpCircle size={22} color="var(--primary)" style={{ flexShrink: 0 }} />
                            <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '10px', color: 'white', margin: 0 }}>{item.q}</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0, marginTop: '8px' }}>{item.a}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PremiumFAQ;
