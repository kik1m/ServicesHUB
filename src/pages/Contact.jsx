import { Mail, Phone, MapPin, Send, MessageCircle, Github, Twitter, Linkedin, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import SkeletonLoader from '../components/SkeletonLoader';
import { useToast } from '../context/ToastContext';

const Contact = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            showToast('Message sent! We will get back to you soon. 📩', 'success');
            setSubmitting(false);
            e.target.reset();
        }, 1500);
    };

    if (loading) {
        return (
            <div className="page-wrapper contact-page">
                <header className="page-header hero-section" style={{ minHeight: '40vh', paddingBottom: '40px' }}>
                    <div className="hero-content">
                        <SkeletonLoader type="text" width="100px" style={{ margin: '0 auto 1rem' }} />
                        <SkeletonLoader type="title" width="50%" style={{ margin: '0 auto' }} />
                    </div>
                </header>
                <section className="main-section" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                        <SkeletonLoader height="400px" borderRadius="24px" />
                        <SkeletonLoader height="600px" borderRadius="24px" />
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="page-wrapper contact-page">
            <header className="page-header hero-section" style={{ minHeight: '40vh', paddingBottom: '40px' }}>
                <div className="hero-content">
                    <div className="badge">GET IN TOUCH</div>
                    <h1 className="hero-title">How can we <span className="gradient-text">help you?</span></h1>
                    <p className="hero-subtitle">Have a question about a tool, a partnership inquiry, or just want to say hi? We're all ears.</p>
                </div>
            </header>

            <section className="main-section" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="contact-grid">
                    {/* Contact Info Sidebar */}
                    <div className="contact-info-sidebar">
                        <div className="glass-card" style={{ padding: '3rem', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', fontWeight: '800' }}>Contact Information</h3>
                            
                            <div className="info-item" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div className="cat-icon-wrapper" style={{ minWidth: '48px', height: '48px', background: 'rgba(0, 136, 204, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Email Us</h4>
                                    <p style={{ fontWeight: '600' }}>support@serviceshub.com</p>
                                </div>
                            </div>

                            <div className="info-item" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div className="cat-icon-wrapper" style={{ minWidth: '48px', height: '48px', background: 'rgba(0, 136, 204, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                    <MessageCircle size={20} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Live Chat</h4>
                                    <p style={{ fontWeight: '600' }}>Available Mon-Fri, 9am-6pm</p>
                                </div>
                            </div>

                            <div className="info-item" style={{ display: 'flex', gap: '1.5rem' }}>
                                <div className="cat-icon-wrapper" style={{ minWidth: '48px', height: '48px', background: 'rgba(0, 136, 204, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Location</h4>
                                    <p style={{ fontWeight: '600' }}>Global Remote Team</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                            <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Follow our journey</h4>
                            <div className="social-links" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                                <button className="icon-btn"><Twitter size={18} /></button>
                                <button className="icon-btn"><Github size={18} /></button>
                                <button className="icon-btn"><Linkedin size={18} /></button>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="glass-card contact-form-card" style={{ padding: 'var(--card-padding, 4rem)' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row-dual">
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Full Name</label>
                                    <input type="text" placeholder="John Doe" style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', outline: 'none' }} required />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email Address</label>
                                    <input type="email" placeholder="john@example.com" style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', outline: 'none' }} required />
                                </div>
                            </div>
                            
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Subject</label>
                                <select style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', outline: 'none' }}>
                                    <option>General Inquiry</option>
                                    <option>Tool Submission Question</option>
                                    <option>Partnership/Advertising</option>
                                    <option>Technical Bug Report</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Message</label>
                                <textarea rows="6" placeholder="How can we help you today?" style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', outline: 'none', resize: 'vertical' }} required></textarea>
                            </div>

                            <button className="btn-primary" style={{ width: '100%', height: '56px' }} disabled={submitting}>
                                {submitting ? <Loader2 className="animate-spin" size={20} /> : <>Send Message <Send size={20} /></>}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
