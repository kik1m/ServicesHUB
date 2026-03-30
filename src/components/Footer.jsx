import { Rocket, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
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
                            The most trusted directory for finding and submitting the world's most innovative AI and SaaS tools. Join thousands of creators today.
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
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/faq">Help Center</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Legal</h4>
                        <ul className="footer-links">
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                        </ul>
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
