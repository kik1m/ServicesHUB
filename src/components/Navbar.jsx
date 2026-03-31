import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogIn, LayoutGrid, Zap, Menu, X, Sparkles, Info, Rss, RefreshCcw, ChevronDown, Bell, Settings, LogOut, Heart, Star, Sun, Moon } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';
import AccountMenu from './AccountMenu';

const Navbar = () => {
    const { user, loading: authLoading, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        let subscription;
        if (user) {
            fetchUnreadCount(user.id);

            subscription = supabase
                .channel('public:notifications')
                .on('postgres_changes', { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                }, (payload) => {
                    setUnreadCount(prev => prev + 1);
                })
                .subscribe();
        }

        return () => {
            if (subscription) {
                supabase.removeChannel(subscription);
            }
        };
    }, [user]);

    // Locking Body Scroll when Menu is Open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    const fetchUnreadCount = async (userId) => {
        const { count } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_unread', true);

        setUnreadCount(count || 0);
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/');
        setIsMenuOpen(false);
        setIsAccountOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="logo-section" onClick={() => setIsMenuOpen(false)}>
                    <div className="logo-icon"><LayoutGrid size={22} /></div>
                    <div className="logo-text">ServicesHUB</div>
                </Link>

                {/* Navbar Search - Centered */}
                <div className="nav-search-container">
                    <Link to="/search" className="nav-search-wrapper" style={{ textDecoration: 'none' }}>
                        <Search className="search-icon" size={20} />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Search tools...</span>
                    </Link>
                </div>

                {/* Mobile Menu Backdrop */}
                {isMenuOpen && (
                    <div
                        className="mobile-backdrop"
                        onClick={() => setIsMenuOpen(false)}
                    ></div>
                )}

                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    {user ? (
                        <>
                            <Link to="/profile" className="mobile-only-link-direct" style={{ fontWeight: 800, color: 'var(--primary)' }} onClick={() => setIsMenuOpen(false)}>
                                <User size={18} /> My Account
                            </Link>
                            <Link to="/dashboard" className="mobile-only-link-direct" onClick={() => setIsMenuOpen(false)}><LayoutGrid size={18} /> Dashboard</Link>
                            <Link to="/profile" className="mobile-only-link-direct" onClick={() => setIsMenuOpen(false)}><Heart size={18} /> My Favorites</Link>
                            <div className="mobile-only-divider" style={{ opacity: 0.5 }}></div>
                        </>
                    ) : authLoading ? (
                        <div className="mobile-only-link-direct" style={{ opacity: 0.5 }}>...</div>
                    ) : (
                        <Link to="/auth" className="mobile-only-link-direct" style={{ fontWeight: 800, color: 'var(--primary)' }} onClick={() => setIsMenuOpen(false)}>
                            <LogIn size={18} /> Login / Register
                        </Link>
                    )}

                    <Link to="/tools" onClick={() => setIsMenuOpen(false)}><Sparkles size={18} /> Explore Tools</Link>
                    <Link to="/compare" onClick={() => setIsMenuOpen(false)}><RefreshCcw size={18} /> Compare</Link>

                    <Link to="/categories" className="mobile-only-link-direct" onClick={() => setIsMenuOpen(false)}><LayoutGrid size={18} /> Categories</Link>
                    <Link to="/blog" className="mobile-only-link-direct" onClick={() => setIsMenuOpen(false)}><Rss size={18} /> Blog Hub</Link>

                    {user && (
                        <>
                            <div className="mobile-only-divider"></div>
                            <Link to="/notifications" className="mobile-only-link-direct" onClick={() => setIsMenuOpen(false)}><Bell size={18} /> Notifications</Link>
                            <Link to="/settings" className="mobile-only-link-direct" onClick={() => setIsMenuOpen(false)}><Settings size={18} /> Settings</Link>
                            <button className="mobile-only-link-direct" onClick={handleLogout} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', color: '#FF5252' }}>
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    )}

                    {/* Desktop More Menu */}
                    <div className="nav-more-container desktop-only">
                        <button
                            className="nav-more-trigger"
                            onClick={() => setIsMoreOpen(!isMoreOpen)}
                            onBlur={() => setTimeout(() => setIsMoreOpen(false), 200)}
                        >
                            Explore <ChevronDown size={14} className={isMoreOpen ? 'rotated' : ''} />
                        </button>
                        {isMoreOpen && (
                            <div className="nav-more-dropdown glass-card">
                                <Link to="/categories" onClick={() => setIsMoreOpen(false)}><LayoutGrid size={16} /> All Categories</Link>
                                <Link to="/blog" onClick={() => setIsMoreOpen(false)}><Rss size={16} /> Blog Hub</Link>
                                <Link to="/faq" onClick={() => setIsMoreOpen(false)}><Info size={16} /> FAQ & Help</Link>
                                <Link to="/promote" onClick={() => setIsMoreOpen(false)}><Zap size={16} /> Advertising</Link>
                            </div>
                        )}
                    </div>

                    <Link to="/submit" className="mobile-only-link" onClick={() => setIsMenuOpen(false)}>
                        <Zap size={18} /> Submit Tool
                    </Link>
                </div>

                <div className="nav-actions">
                    {user && !user.is_premium && (
                        <Link to="/premium" className="premium-nav-btn desktop-only" style={{
                            padding: '10px 15px',
                            borderRadius: '12px',
                            background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                            color: 'black',
                            fontWeight: '800',
                            textDecoration: 'none',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            marginRight: '10px',
                            boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)'
                        }}>
                            <Star size={14} fill="currentColor" /> Go Premium
                        </Link>
                    )}
                    <Link to="/submit" className="btn-primary-slim">Submit Tool</Link>
                    
                    
                    {authLoading ? (
                        <div style={{ width: 68, height: 38, background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }} />
                    ) : !user ? (
                        <Link to="/auth" className="nav-login-btn-slim">Login</Link>
                    ) : (
                        <>
                            <div className="nav-notif-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <button
                                    className="nav-icon-btn"
                                    onClick={() => { setIsNotifOpen(!isNotifOpen); setIsMoreOpen(false); setIsAccountOpen(false); }}
                                    title="Notifications"
                                >
                                    <Bell size={24} />
                                    {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                                </button>
                                {isNotifOpen && (
                                    <NotificationPanel onClose={() => setIsNotifOpen(false)} />
                                )}
                            </div>

                            <div className="nav-profile-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <button
                                    className="nav-profile-trigger"
                                    onClick={() => { setIsAccountOpen(!isAccountOpen); setIsNotifOpen(false); setIsMoreOpen(false); }}
                                    title="Account"
                                >
                                    <User size={26} />
                                </button>
                                {isAccountOpen && (
                                    <AccountMenu onClose={() => setIsAccountOpen(false)} handleLogout={handleLogout} user={user} />
                                )}
                            </div>
                        </>
                    )}

                    <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
