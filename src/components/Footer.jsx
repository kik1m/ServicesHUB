import { Rocket, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer" style={{ borderTop: '1px solid var(--border)', padding: '6rem 5% 4rem', background: 'rgba(0,0,0,0.2)' }}>
            <div className="footer-container" style={{ 
                maxWidth: '1400px', 
                margin: '0 auto', 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '4rem' 
            }}>
                <div className="footer-brand">
                    <div className="footer-logo" style={{ fontSize: '1.6rem', fontWeight: '900', marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                        <Rocket size={24} style={{ marginRight: '10px' }} /> ServicesHUB
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                        The most trusted directory for finding and submitting the world's most innovative AI and SaaS tools.
                    </p>
                    <div className="social-row" style={{ display: 'flex', gap: '1rem' }}>
                        <button className="icon-btn" style={{ width: '40px', height: '40px' }}><Twitter size={16} /></button>
                        <button className="icon-btn" style={{ width: '40px', height: '40px' }}><Github size={16} /></button>
                        <button className="icon-btn" style={{ width: '40px', height: '40px' }}><Linkedin size={16} /></button>
                    </div>
                </div>

                <div className="footer-col">
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '800' }}>Explore</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <li><Link to="/tools" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>All Tools</Link></li>
                        <li><Link to="/blog" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Articles</Link></li>
                        <li><Link to="/compare" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Compare Tools</Link></li>
                        <li><Link to="/promote" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Sponsorships</Link></li>
                        <li><Link to="/categories" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Categories</Link></li>
                        <li><Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Featured Picks</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '800' }}>Platform</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <li><Link to="/submit" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Submit Tool</Link></li>
                        <li><Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>About Us</Link></li>
                        <li><Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Contact Support</Link></li>
                        <li><Link to="/faq" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Help Center (FAQ)</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '800' }}>Legal</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <li><Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Terms of Service</Link></li>
                        <li><Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Policy</Link></li>
                        <li><Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Cookie Policy</Link></li>
                        <li><Link to="/auth" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>User Agreement</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom" style={{ maxWidth: '1400px', margin: '4rem auto 0', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <p>© 2026 ServicesHUB. Built with excellence for the AI community.</p>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <span>Service Status: <span style={{ color: '#00ffaa' }}>Online</span></span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
