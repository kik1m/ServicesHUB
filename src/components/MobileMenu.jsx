import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { X, Home, LayoutGrid, Info, Star, LogIn, LayoutDashboard, PlusCircle, User, LogOut, Heart, HelpCircle, Zap, Sparkles, Rss } from 'lucide-react';

const MobileMenu = ({ isOpen, onClose, user, handleLogout }) => {
    // Robust Body Scroll Locking 
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const menuContent = (
        <>
            {/* High-Fidelity Backdrop Overlay */}
            <div
                className="mobile-menu-overlay"
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 999998,
                    animation: 'fadeIn 0.3s ease-out'
                }}
            />

            {/* Premium Sidebar Content */}
            <aside
                className={`mobile-sidebar-standalone ${isOpen ? 'active' : ''}`}
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0, // Truly flush to the right edge
                    width: '320px',
                    maxWidth: '85%',
                    height: '100dvh',
                    background: 'rgba(7, 7, 9, 1)', // Opaque to hide content behind
                    zIndex: 999999,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0',
                    boxShadow: '-10px 0 50px rgba(0,0,0,0.9)',
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    overscrollBehavior: 'contain'
                }}
            >
                {/* Header with Branding and Close Button */}
                <div style={{
                    padding: '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    background: 'rgba(255, 255, 255, 0.02)'
                }}>
                    <Link to="/" onClick={onClose} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                            src="/logo.png"
                            alt="HUBly Logo"
                            style={{
                                height: '34px',
                                width: 'auto',
                                filter: 'drop-shadow(0 0 10px rgba(0, 136, 204, 0.3))'
                            }}
                        />
                        <div style={{ fontWeight: '900', fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: 'white' }}>HUB</span>
                            <span style={{
                                background: 'var(--gradient)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>ly</span>
                        </div>
                    </Link>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'white',
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: '0.2s'
                        }}
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.8px', marginBottom: '12px', paddingLeft: '8px' }}>Platform Navigation</div>

                    <Link to="/tools" onClick={onClose} className="mobile-nav-item">
                        <LayoutGrid size={20} /> <span>Explore Tools</span>
                    </Link>
                    <Link to="/categories" onClick={onClose} className="mobile-nav-item">
                        <Zap size={20} /> <span>Browse Categories</span>
                    </Link>
                    <Link to="/promote" onClick={onClose} className="mobile-nav-item">
                        <Sparkles size={20} /> <span>Promote Yours</span>
                    </Link>
                    <Link to="/blog" onClick={onClose} className="mobile-nav-item">
                        <Rss size={20} /> <span>Blog & Articles</span>
                    </Link>
                    <Link to="/premium" onClick={onClose} className="mobile-nav-item">
                        <Star size={20} /> <span>Premium Membership</span>
                    </Link>
                    <Link to="/about" onClick={onClose} className="mobile-nav-item">
                        <Info size={20} /> <span>Who We Are</span>
                    </Link>


                    <div style={{ margin: '20px 0', height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                    <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.8px', marginBottom: '12px', paddingLeft: '8px' }}>Account Control</div>

                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={onClose} className="mobile-nav-item">
                                <LayoutDashboard size={20} /> <span>User Dashboard</span>
                            </Link>
                            <Link to="/submit" onClick={onClose} className="mobile-nav-item">
                                <PlusCircle size={20} /> <span>Submit Resource</span>
                            </Link>
                            <Link to="/profile" onClick={onClose} className="mobile-nav-item">
                                <User size={20} /> <span>My Public Profile</span>
                            </Link>
                            <Link to="/settings" onClick={onClose} className="mobile-nav-item">
                                <Heart size={20} /> <span>Favorites & Saves</span>
                            </Link>

                            {user && !user.is_premium && (
                                <Link to="/premium" onClick={onClose} className="mobile-nav-item premium-cta-sidebar" style={{ marginTop: '12px' }}>
                                    <Star size={18} fill="currentColor" /> <span>Upgrade to Premium</span>
                                </Link>
                            )}

                            <div style={{ marginTop: 'auto', paddingTop: '30px' }}>
                                <button onClick={handleLogout} className="mobile-nav-item logout-btn-sidebar" style={{ background: 'rgba(255,85,85,0.06)', border: '1px solid rgba(255,85,85,0.15)', width: '100%', textAlign: 'left', cursor: 'pointer', borderRadius: '14px' }}>
                                    <LogOut size={20} /> <span>Secure Sign Out</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/auth" onClick={onClose} className="mobile-nav-item guest-login-btn">
                                <LogIn size={20} /> <span>Access Account</span>
                            </Link>
                            <Link to="/faq" onClick={onClose} className="mobile-nav-item" style={{ marginTop: '10px' }}>
                                <HelpCircle size={20} /> <span>Support Center</span>
                            </Link>
                        </>
                    )}
                </nav>

                {/* Footer Branding */}
                <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.4)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', fontWeight: '600', letterSpacing: '0.5px' }}>
                        © 2026 HUBly Platform. V2.1.0-PRO
                    </div>
                </div>
            </aside>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                
                .mobile-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 14px 18px;
                    border-radius: 14px;
                    text-decoration: none;
                    color: rgba(255,255,255,0.65);
                    font-weight: 500;
                    font-size: 0.95rem;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid transparent;
                }
                
                .mobile-nav-item:hover {
                    background: rgba(255,255,255,0.06);
                    color: white;
                    border-color: rgba(255,255,255,0.1);
                    transform: translateX(-5px);
                }
                
                .mobile-nav-item span { flex: 1; }
                
                .mobile-nav-item svg {
                    color: rgba(255,255,255,0.35);
                    transition: 0.25s;
                }
                
                .mobile-nav-item:hover svg {
                    color: var(--primary);
                    transform: scale(1.1) rotate(-5deg);
                }

                .logout-btn-sidebar { 
                    color: #ff5555 !important; 
                    margin-top: 10px;
                }
                .logout-btn-sidebar:hover { 
                    background: rgba(255,85,85,0.12) !important; 
                    border-color: rgba(255,85,85,0.3) !important;
                    color: #ff7777 !important; 
                }
                .logout-btn-sidebar svg { color: #ff5555 !important; }

                .guest-login-btn {
                    background: var(--gradient) !important;
                    color: white !important;
                    justify-content: center;
                    font-weight: 800;
                    margin-top: 10px;
                    box-shadow: 0 8px 20px rgba(0, 136, 204, 0.25);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .guest-login-btn svg { color: white !important; }
                .guest-login-btn:hover { 
                    transform: translateY(-2px) scale(1.02);
                    box-shadow: 0 12px 25px rgba(0, 136, 204, 0.35);
                }

                .premium-cta-sidebar {
                    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%) !important;
                    color: black !important;
                    justify-content: center;
                    font-weight: 900;
                    box-shadow: 0 8px 20px rgba(255, 165, 0, 0.15);
                }
                .premium-cta-sidebar svg { color: black !important; }
                .premium-cta-sidebar:hover { transform: scale(1.03); }

                aside::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </>
    );

    return createPortal(menuContent, document.body);
};

export default MobileMenu;



