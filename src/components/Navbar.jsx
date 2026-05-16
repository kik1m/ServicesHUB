'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, Bell, User, Star, Menu } from 'lucide-react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useNavbar } from '../hooks/useNavbar';
import { useNotifications } from '../hooks/useNotifications';
import { NAV_LINKS, NAV_LABELS, MORE_GROUPS } from '../constants/navbarConstants';
import { queryOptions } from '../lib/queryOptions';

// Components
import NotificationPanel from './NotificationPanel';
import AccountMenu from './AccountMenu';
import MobileMenu from './MobileMenu';
import GlobalSearch from './GlobalSearch';
import Skeleton from './ui/Skeleton';
import Button from './ui/Button';
import SmartImage from './ui/SmartImage';
import Logo from './Logo';
import DropdownCard from './ui/DropdownCard';

// Styles
import styles from './Navbar.module.css';

/**
 * 🚀 Elite Unified Navigation
 */
const Navbar = () => {
    const { user, loading: authLoading, signOut } = useAuth();
    
    // 🚀 Elite Profile Fetching (with instant fallback to user metadata)
    const { data: profile } = useQuery(queryOptions.profile(user?.id, user));

    const router = useRouter();
    const queryClient = useQueryClient();
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
        router.push('/');
        closeAll();
    };

    // Universal Route Prefetcher
    const handlePrefetchRoute = (path) => {
        if (!path) return;
        
        // 0. Home Page
        if (path === '/') {
            queryClient.prefetchQuery(queryOptions.home.categories());
            queryClient.prefetchQuery(queryOptions.home.featured());
            queryClient.prefetchQuery(queryOptions.home.latest());
            queryClient.prefetchQuery(queryOptions.home.trending());
            queryClient.prefetchQuery(queryOptions.home.posts());
            queryClient.prefetchQuery(queryOptions.home.comparisons());
            queryClient.prefetchQuery(queryOptions.home.stats());
        }
        // 1. Dashboard & Profile
        else if (path.startsWith('/dashboard') || path.startsWith('/profile') || path.startsWith('/notifications') || path.startsWith('/settings')) {
            const userId = user?.id;
            if (userId) {
                queryClient.prefetchQuery(queryOptions.profile(userId, user));
                queryClient.prefetchQuery(queryOptions.favorites(userId));
                queryClient.prefetchQuery(queryOptions.dashboardTools(userId));
                queryClient.prefetchQuery(queryOptions.notifications(userId));
            }
        } 
        // 2. Categories
        else if (path.startsWith('/categories')) {
            queryClient.prefetchQuery(queryOptions.categories());
        }
        else if (path.startsWith('/category/')) {
            const slug = path.split('/').filter(Boolean).pop();
            if (slug && slug !== 'category') {
                queryClient.prefetchQuery(queryOptions.categoryBySlug(slug));
            }
        }
        // 3. Blog
        else if (path.startsWith('/blog')) {
            queryClient.prefetchQuery(queryOptions.blogCategories());
        }
        // 4. Tools Search
        else if (path.startsWith('/tools')) {
            queryClient.prefetchInfiniteQuery(queryOptions.toolsSearch());
        }
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.closest('[data-mobile-menu]')) return;
            if (navRef.current && !navRef.current.contains(event.target)) {
                closeAll();
            }
        };

        if (activeDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeDropdown, closeAll]);

    return (
        <nav 
            ref={navRef}
            className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ''}`}
        >
            <div className={styles.navContainer}>
                <Logo 
                    size={32} 
                    onClick={closeAll} 
                    onMouseEnter={() => handlePrefetchRoute('/')}
                />

                <div className={styles.navSearchContainer}>
                    <GlobalSearch />
                </div>

                <div className={styles.navLinks}>
                    {NAV_LINKS.map((link) => (
                        <Link 
                            key={link.path} 
                            href={link.path}
                            onMouseEnter={() => handlePrefetchRoute(link.path)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    
                    <div className={styles.navMoreContainer}>
                        <button 
                            className={styles.navMoreTrigger}
                            onClick={() => toggleDropdown('more')}
                        >
                            {NAV_LABELS.MORE} <ChevronDown size={14} className={activeDropdown === 'more' ? styles.rotate180 : ''} />
                        </button>
                        
                        {activeDropdown === 'more' && (
                            <DropdownCard className={styles.navMoreDropdown} onClose={closeAll}>
                                {MORE_GROUPS.map((group) => (
                                    <div key={group.title} className={styles.navMoreGroup}>
                                        <div className={styles.navMoreGroupTitle}>{group.title}</div>
                                        {group.links.map((item) => (
                                            <Link 
                                                key={item.path} 
                                                href={item.path} 
                                                onClick={closeAll}
                                                onMouseEnter={() => handlePrefetchRoute(item.path)}
                                            >
                                                {item.icon && <item.icon size={16} />}
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                ))}
                            </DropdownCard>
                        )}
                    </div>
                </div>

                <div className={styles.navActions}>
                    {authLoading ? (
                        <div className={styles.authSkeletonWrapper}>
                            <Skeleton className={styles.skeletonSubmitBtn} />
                            <Skeleton className={styles.skeletonLoginBtn} />
                        </div>
                    ) : (
                        <>
                            <div className={styles.hideOnMobile}>
                                <Button 
                                    variant="primary" 
                                    size="sm" 
                                    onClick={() => router.push('/submit')}
                                >
                                    {NAV_LABELS.SUBMIT}
                                </Button>
                            </div>

                            {!user ? (
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => router.push('/auth')}
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
                                            onMouseEnter={() => handlePrefetchRoute('/dashboard')}
                                            title="Account"
                                        >
                                            {profile?.avatar_url ? (
                                                <div className={styles.navAvatarBox}>
                                                    <SmartImage 
                                                        src={profile.avatar_url} 
                                                        alt={profile.full_name} 
                                                        className={styles.navAvatar}
                                                    />
                                                </div>
                                            ) : (
                                                <User size={22} />
                                            )}
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
                        </>
                    )}

                    <button
                        className={styles.menuTogglePremium}
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open Menu"
                    >
                        <Menu size={22} color="white" />
                    </button>
                </div>
            </div>

            <MobileMenu 
                isOpen={isMobileMenuOpen} 
                onClose={() => setIsMobileMenuOpen(false)} 
                user={user}
                handleLogout={handleLogout}
                handlePrefetch={handlePrefetchRoute}
            />
        </nav>
    );
};

export default Navbar;
