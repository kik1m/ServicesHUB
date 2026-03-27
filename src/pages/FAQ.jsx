import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, Zap, Shield, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const faqs = [
        {
            category: 'General',
            icon: <HelpCircle size={20} />,
            questions: [
                { q: "What is ServicesHUB?", a: "ServicesHUB is a curated directory of the world's most innovative AI and SaaS tools, designed to help founders and developers discover the right software for their needs." },
                { q: "Is it free to use?", a: "Yes, browsing and discovering tools on ServicesHUB is completely free for all users." }
            ]
        },
        {
            category: 'Submissions',
            icon: <Zap size={20} />,
            questions: [
                { q: "How do I submit my tool?", a: "Click the 'Submit Tool' button in the navigation bar and follow the 4-step process. Our team will review your submission within 24-48 hours." },
                { q: "Can I edit my tool after submission?", a: "Currently, you need to contact our support team to make changes to a live listing. We are working on a dashboard feature to allow self-editing." }
            ]
        },
        {
            category: 'Safety & Trust',
            icon: <Shield size={20} />,
            questions: [
                { q: "Are the tools verified?", a: "We perform a basic check on every tool submitted to ensure it is functional and safe. However, we always recommend reading reviews and doing your own due diligence." },
                { q: "How can I report a broken link?", a: "You can use the 'Contact Support' page to report any technical issues or broken links you find on the platform." }
            ]
        }
    ];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="page-wrapper faq-page">
            <header className="page-header hero-section" style={{ minHeight: '40vh', paddingBottom: '40px' }}>
                <div className="hero-content">
                    <div className="badge">KNOWLEDGE BASE</div>
                    <h1 className="hero-title">Frequently Asked <span className="gradient-text">Questions</span></h1>
                    <p className="hero-subtitle">Everything you need to know about ServicesHUB platform.</p>

                    <div className="search-container" style={{ maxWidth: '600px', margin: '3rem auto 0' }}>
                        <div className="nav-search-wrapper" style={{ padding: '15px 25px', background: 'rgba(255,255,255,0.05)' }}>
                            <Search className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Search for answers..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'white', fontSize: '1.1rem', outline: 'none' }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <section className="main-section" style={{ maxWidth: '900px', margin: '0 auto' }}>
                {faqs.map((group, groupIdx) => (
                    <div key={groupIdx} className="faq-group" style={{ marginBottom: '3rem' }}>
                        <div className="group-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                            {group.icon}
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>{group.category}</h3>
                        </div>

                        <div className="faq-list">
                            {group.questions.map((item, qIdx) => {
                                const globalIdx = `${groupIdx}-${qIdx}`;
                                const isOpen = activeIndex === globalIdx;

                                if (searchQuery && !item.q.toLowerCase().includes(searchQuery.toLowerCase()) && !item.a.toLowerCase().includes(searchQuery.toLowerCase())) {
                                    return null;
                                }

                                return (
                                    <div key={qIdx} className={`faq-item glass-card ${isOpen ? 'open' : ''}`} style={{ 
                                        marginBottom: '1rem', 
                                        padding: '0', 
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <div 
                                            className="faq-question" 
                                            onClick={() => toggleAccordion(globalIdx)}
                                            style={{ 
                                                padding: '1.5rem 2rem', 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center', 
                                                cursor: 'pointer',
                                                background: isOpen ? 'rgba(255,255,255,0.03)' : 'transparent'
                                            }}
                                        >
                                            <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{item.q}</span>
                                            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                        
                                        {isOpen && (
                                            <div className="faq-answer" style={{ 
                                                padding: '1.5rem 2rem 2.5rem', 
                                                color: 'var(--text-muted)', 
                                                lineHeight: '1.7',
                                                fontSize: '1rem',
                                                borderTop: '1px solid var(--border)'
                                            }}>
                                                {item.a}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                <div className="glass-card help-cta" style={{ textAlign: 'center', padding: '4rem', marginTop: '4rem' }}>
                    <MessageSquare size={48} color="var(--primary)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                    <h2 style={{ marginBottom: '1rem' }}>Still have questions?</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>We're here to help. Reach out to our support team any time.</p>
                    <Link to="/contact" className="btn-primary">Contact Support</Link>
                </div>
            </section>
        </div>
    );
};

export default FAQ;
