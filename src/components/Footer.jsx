import { Rocket, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer" style={{ 
            borderTop: '1px solid var(--border)', 
            padding: '4rem 2rem', 
            background: 'rgba(15, 15, 18, 0.6)', 
            backdropFilter: 'blur(20px)',
            marginTop: 'auto'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div className="footer-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '3rem',
                    marginBottom: '4rem'
                }}>
                    {/* Brand Section */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                            <Rocket size={28} style={{ marginRight: '12px' }} /> ServicesHUB
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.8', maxWidth: '350px', marginBottom: '2rem' }}>
                            The most trusted directory for finding and submitting the world's most innovative AI and SaaS tools.
                        </p>
                        <div style={{ display: 'flex', gap: '1.2rem' }}>
                            <a href="#" className="icon-btn" style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}><Twitter size={18} /></a>
                            <a href="#" className="icon-btn" style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}><Github size={18} /></a>
                            <a href="#" className="icon-btn" style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}><Linkedin size={18} /></a>
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '1.8rem', fontWeight: '800', color: 'white' }}>Explore</h4>
                        <ul className="footer-links" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <li><Link to="/tools" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} onClick={() => window.scrollTo(0,0)}>All Tools</Link></li>
                            <li><Link to="/blog" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} onClick={() => window.scrollTo(0,0)}>Articles</Link></li>
                            <li><Link to="/categories" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} onClick={() => window.scrollTo(0,0)}>Categories</Link></li>
                            <li><Link to="/promote" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} onClick={() => window.scrollTo(0,0)}>Sponsorships</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '1.8rem', fontWeight: '800', color: 'white' }}>Platform</h4>
                        <ul className="footer-links" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <li><Link to="/submit" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Submit Tool</Link></li>
                            <li><Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About Us</Link></li>
                            <li><Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact</Link></li>
                            <li><Link to="/faq" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Help Center</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '1.8rem', fontWeight: '800', color: 'white' }}>Legal</h4>
                        <ul className="footer-links" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <li><Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</Link></li>
                            <li><Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{ 
                    paddingTop: '2.5rem', 
                    borderTop: '1px solid var(--border)', 
                    display: 'flex', 
                    flexWrap: 'wrap',
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    gap: '1.5rem',
                    color: 'var(--text-muted)', 
                    fontSize: '0.9rem' 
                }}>
                    <p>© 2026 ServicesHUB. Built with excellence for the AI community.</p>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <span style={{ 
                            padding: '4px 14px', 
                            background: 'rgba(0, 255, 170, 0.1)', 
                            color: '#00ffaa', 
                            borderRadius: '20px', 
                            fontSize: '0.75rem', 
                            fontWeight: 'bold', 
                            border: '1px solid rgba(0, 255, 170, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <span style={{ width: '6px', height: '6px', background: '#00ffaa', borderRadius: '50%' }}></span>
                            Production Ready
                        </span>
                        <span>Service Status: <span style={{ color: '#00ffaa' }}>Online</span></span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
