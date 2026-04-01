import React, { useState } from 'react';
import { Github, Twitter, Linkedin, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '../context/ToastContext';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { showToast } = useToast();

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;
        setSubmitting(true);
        try {
            const { error } = await supabase.from('newsletter_subscribers').insert([{ email }]);
            if (error) {
                if (error.code === '23505') throw new Error('You are already subscribed!');
                throw error;
            }
            showToast('Subscribed to the newsletter successfully! 🎉', 'success');
            setEmail('');
        } catch (error) {
            showToast(error.message || 'Subscription failed. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div className="footer-brand">
                        <div className="brand-logo">
                            <Rocket size={28} /> ServicesHUB
                        </div>
                        <p>
                            The most trusted directory for finding and submitting the world&apos;s most innovative AI and SaaS tools. Join thousands of creators today.
                        </p>
                        <div className="footer-socials">
                            <a href="#" className="icon-btn"><Twitter size={18} /></a>
                            <a href="#" className="icon-btn"><Github size={18} /></a>
                            <a href="#" className="icon-btn"><Linkedin size={18} /></a>
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="footer-column">
                        <h4>Explore</h4>
                        <ul className="footer-links">
                            <li><Link to="/tools" onClick={() => window.scrollTo(0,0)}>All Tools</Link></li>
                            <li><Link to="/blog" onClick={() => window.scrollTo(0,0)}>Articles</Link></li>
                            <li><Link to="/categories" onClick={() => window.scrollTo(0,0)}>Categories</Link></li>
                            <li><Link to="/promote" onClick={() => window.scrollTo(0,0)}>Sponsorships</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Platform</h4>
                        <ul className="footer-links">
                            <li><Link to="/submit">Submit Tool</Link></li>
                            <li><Link to="/about">About Us & FAQ</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/terms">Terms & Privacy</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column" style={{ flex: 1, minWidth: '250px' }}>
                        <h4>Never miss an update</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.5' }}>
                            Join 10,000+ creators. Get the latest AI tools and exclusive deals to your inbox.
                        </p>
                        <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <input 
                                type="email" 
                                placeholder="name@company.com" 
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                required
                                style={{ flex: 1, minWidth: '150px', padding: '12px 15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                            />
                            <button type="submit" disabled={submitting} className="btn-primary" style={{ padding: '0 20px', whiteSpace: 'nowrap' }}>
                                {submitting ? '...' : 'Subscribe'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p>© 2026 ServicesHUB. Built with excellence for the AI community.</p>
                    <div className="status-group">
                        <div className="status-badge">
                            <span className="status-dot"></span>
                            Production Ready
                        </div>
                        <span>Service Status: <span style={{ color: '#00ffaa', fontWeight: 'bold' }}>Online</span></span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
