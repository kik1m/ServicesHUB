import React from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { X, LogOut } from 'lucide-react';
import Logo from './Logo';
import { MOBILE_GROUPS, NAV_LABELS } from '../constants/navbarConstants';
import styles from './MobileMenu.module.css';

/**
 * 📱 Elite Mobile Navigation Menu
 * Rule #1: Modular Styles (Rule #81)
 * Rule #2: Centralized Constants (Rule #11)
 * Rule #3: Portal implementation for zero Z-index issues
 */
const MobileMenu = ({ isOpen, onClose, user, handleLogout }) => {
    if (!isOpen) return null;

    const menuContent = (
        <>
            {/* Backdrop */}
            <div className={styles.overlay} onClick={onClose} />

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isOpen ? styles.active : ''}`}>
                <div className={styles.header}>
                    <Logo size={34} onClick={onClose} className={styles.logoLink} />
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={22} />
                    </button>
                </div>

                <nav className={styles.nav}>
                    {MOBILE_GROUPS.map((group, idx) => {
                        // Skip auth-only or guest-only groups based on status
                        if (group.auth === true && !user) return null;
                        if (group.auth === false && user) return null;

                        return (
                            <React.Fragment key={idx}>
                                <div className={styles.groupLabel}>{group.title}</div>
                                {group.links.map((link, lIdx) => {
                                    const Icon = link.icon;
                                    const isPremium = link.label.includes('Premium') || link.label.includes('Upgrade');
                                    const isAuth = link.variant === 'primary';

                                    return (
                                        <Link 
                                            key={lIdx} 
                                            to={link.path} 
                                            onClick={onClose} 
                                            className={`
                                                ${styles.navItem} 
                                                ${isPremium ? styles.premiumItem : ''} 
                                                ${isAuth ? styles.authItem : ''}
                                            `}
                                        >
                                            <Icon size={20} />
                                            <span>{link.label}</span>
                                        </Link>
                                    );
                                })}
                            </React.Fragment>
                        );
                    })}

                    {user && (
                        <button onClick={handleLogout} className={styles.logoutBtn}>
                            <LogOut size={20} />
                            <span>{NAV_LABELS.SIGNOUT}</span>
                        </button>
                    )}
                </nav>

                <div className={styles.footer}>
                    <div className={styles.footerText}>{NAV_LABELS.FOOTER_TEXT}</div>
                </div>
            </aside>
        </>
    );

    return createPortal(menuContent, document.body);
};

export default MobileMenu;
