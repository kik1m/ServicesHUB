import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogIn, LayoutGrid, Zap, Menu, X, Sparkles, Info, Rss, RefreshCcw, ChevronDown, Bell, Settings, LogOut, Heart, Star, Home } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';
import AccountMenu from './AccountMenu';
import MobileMenu from './MobileMenu';

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
        if (user?.id) {
            fetchUnreadCount(user.id);

            subscription = supabase
                .channel(`public:notifications:${user.id}`)
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                }, (_payload) => {
                    fetchUnreadCount(user.id);
                })
                .subscribe();

            // Custom Event Listener for instant sync
            const handleSync = () => fetchUnreadCount(user.id);
            window.addEventListener('notifications-updated', handleSync);

            return () => {
                if (subscription) supabase.removeChannel(subscription);
                window.removeEventListener('notifications-updated', handleSync);
            };
        }
    }, [user?.id]);

    const fetchUnreadCount = async (userId) => {
        try {
            const { count } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('is_unread', true);

            setUnreadCount(count || 0);
        } catch (err) {
            console.error('Fetch unread count error:', err);
        }
    };

    const handleLogout = useCallback(async () => {
        await signOut();
        navigate('/');
        setIsMenuOpen(false);
        setIsAccountOpen(false);
    }, [signOut, navigate]);

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="logo-section" onClick={() => setIsMenuOpen(false)}>
                    <img src="/logo.png" alt="HUBly" style={{ height: '32px', width: 'auto' }} />
                    <div className="logo-text">
                        <span className="logo-white">HUB</span><span className="logo-gradient">ly</span>
                    </div>
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

                <div className="nav-links desktop-only">
                    <Link to="/tools"><LayoutGrid size={18} /> Tools</Link>
                    <Link to="/categories"><Zap size={18} /> Categories</Link>
                    <Link to="/promote"><Sparkles size={18} /> Promote</Link>

                    <div className="nav-more-container">
                        <button
                            className="nav-more-trigger"
                            onClick={() => { setIsMoreOpen(!isMoreOpen); setIsNotifOpen(false); setIsAccountOpen(false); }}
                        >
                            More <ChevronDown size={14} className={isMoreOpen ? 'rotated' : ''} />
                        </button>
                        {isMoreOpen && (
                            <div className="nav-more-dropdown glass-card">
                                <Link to="/premium" onClick={() => setIsMoreOpen(false)}><Star size={16} /> Premium Access</Link>
                                <Link to="/blog" onClick={() => setIsMoreOpen(false)}><Rss size={16} /> Blog Hub</Link>
                                <Link to="/about" onClick={() => setIsMoreOpen(false)}><Info size={16} /> Who We Are</Link>
                                <Link to="/compare" onClick={() => setIsMoreOpen(false)}><RefreshCcw size={16} /> Compare Tools</Link>
                                <Link to="/faq" onClick={() => setIsMoreOpen(false)}><Info size={16} /> FAQ & Help</Link>
                            </div>
                        )}
                    </div>
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
                                    <Bell size={20} />
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
                                    <User size={22} />
                                </button>
                                {isAccountOpen && (
                                    <AccountMenu onClose={() => setIsAccountOpen(false)} handleLogout={handleLogout} user={user} />
                                )}
                            </div>
                        </>
                    )}

                    {!isMenuOpen && (
                        <button
                            className="menu-toggle-premium"
                            onClick={() => setIsMenuOpen(true)}
                            aria-label="Open Menu"
                        >
                            <div className="hamburger-box">
                                <div className="hamburger-inner"></div>
                            </div>
                        </button>
                    )}
                </div>
            </div>

            <MobileMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                user={user}
                handleLogout={handleLogout}
            />
        </nav>
    );
};

export default Navbar;
