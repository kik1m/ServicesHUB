import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Bell, User, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavbar } from '../hooks/useNavbar';
import { useNotifications } from '../hooks/useNotifications';
import { NAV_LINKS, NAV_LABELS, MORE_GROUPS } from '../constants/navbarConstants';

// Components
import NotificationPanel from './NotificationPanel';
import AccountMenu from './AccountMenu';
import MobileMenu from './MobileMenu';
import Skeleton from './ui/Skeleton';
import Button from './ui/Button';
import Logo from './Logo';
import DropdownCard from './ui/DropdownCard';

// Styles
import styles from './Navbar.module.css';

/**
 * 🚀 Elite Unified Navigation
 * Rule #1: Logic Isolation via useNavbar
 * Rule #2: Zero Inline Styles (Rule #81)
 * Rule #3: Centralized Constants (Rule #11)
 */
const Navbar = () => {
    const { user, loading: authLoading, signOut } = useAuth();
    const navigate = useNavigate();
    const { unreadCount } = useNotifications(user?.id);
    
    const {
        isScrolled,
        activeDropdown,
        toggleDropdown,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        closeAll
    } = useNavbar();

    const navRef = useRef(null);

    const handleLogout = async () => {
        await signOut();
        navigate('/');
        closeAll();
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                closeAll();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [closeAll]);

    return (
        <nav 
            ref={navRef}
            className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ''}`}
            style={{ '--nav-height': isScrolled ? '68px' : '80px' }}
        >
            <div className={styles.navContainer}>
                <Logo size={32} onClick={closeAll} />

                {/* Search Bar - Center */}
                <div className={styles.navSearchContainer}>
                    <Link to="/search" className={styles.navSearchWrapper} onClick={closeAll}>
                        <Search size={20} className={styles.searchIcon} />
                        <span className={styles.navSearchText}>
                            {NAV_LABELS.SEARCH_PLACEHOLDER}
                        </span>
                    </Link>
                </div>

                {/* Primary Links */}
                <div className={styles.navLinks}>
                    {NAV_LINKS.map(link => {
                        const Icon = link.icon;
                        return (
                            <Link key={link.path} to={link.path} onClick={closeAll}>
                                <Icon size={18} /> {link.label}
                            </Link>
                        );
                    })}

                    {/* More Dropdown */}
                    <div className={styles.navMoreContainer}>
                        <button
                            className={styles.navMoreTrigger}
                            onClick={() => toggleDropdown('more')}
                        >
                            {NAV_LABELS.MORE} 
                            <ChevronDown 
                                size={14} 
                                className={activeDropdown === 'more' ? styles.rotate180 : ''} 
                            />
                        </button>
                        {activeDropdown === 'more' && (
                            <DropdownCard className={styles.navMoreDropdown}>
                                {MORE_GROUPS.map((group, gIdx) => (
                                    <div key={gIdx} className={styles.navMoreGroup}>
                                        <span className={styles.navMoreGroupTitle}>{group.title}</span>
                                        {group.links.map(link => {
                                            const Icon = link.icon;
                                            return (
                                                <Link key={link.path} to={link.path} onClick={closeAll}>
                                                    <Icon size={16} /> {link.label}
                                                </Link>
                                            );
                                        })}
                                        {gIdx < MORE_GROUPS.length - 1 && <div className={styles.navMoreSeparator} />}
                                    </div>
                                ))}
                            </DropdownCard>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className={styles.navActions}>
                    {user && !user.is_premium && (
                        <div className="desktop-only">
                            <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={() => navigate('/premium')}
                                className={styles.premiumBtn}
                                icon={Star}
                            >
                                {NAV_LABELS.PREMIUM_CTA}
                            </Button>
                        </div>
                    )}
                    
                    <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => navigate('/submit')}
                    >
                        {NAV_LABELS.SUBMIT}
                    </Button>

                    {authLoading ? (
                        <div className={styles.authSkeleton}>
                            <Skeleton width="100%" height="100%" borderRadius="12px" />
                        </div>
                    ) : !user ? (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate('/auth')}
                        >
                            {NAV_LABELS.LOGIN}
                        </Button>
                    ) : (
                        <div className={styles.userControls}>
                            <div className={styles.notifWrapper}>
                                <button
                                    className={styles.navIconBtn}
                                    onClick={() => toggleDropdown('notifications')}
                                    title="Notifications"
                                >
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className={styles.notifBadge}>{unreadCount}</span>
                                    )}
                                </button>
                                {activeDropdown === 'notifications' && (
                                    <NotificationPanel 
                                        onClose={closeAll} 
                                        className={styles.notifDropdown}
                                    />
                                )}
                            </div>

                            <div className={styles.accountWrapper}>
                                <button
                                    className={styles.navProfileTrigger}
                                    onClick={() => toggleDropdown('account')}
                                    title="Account"
                                >
                                    <User size={22} />
                                </button>
                                {activeDropdown === 'account' && (
                                    <AccountMenu 
                                        onClose={closeAll} 
                                        handleLogout={handleLogout} 
                                        user={user}
                                        className={styles.accountDropdown}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    <button
                        className={styles.menuTogglePremium}
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open Menu"
                    >
                        <div className={styles.hamburgerBox}>
                            <div className={styles.hamburgerInner}></div>
                        </div>
                    </button>
                </div>
            </div>

            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                user={user}
                handleLogout={handleLogout}
            />
        </nav>
    );
};

export default Navbar;
