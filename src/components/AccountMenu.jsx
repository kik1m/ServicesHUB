import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Shield, Award } from 'lucide-react';
import DropdownCard from './ui/DropdownCard';
import { USER_MENU_LINKS } from '../constants/navbarConstants';

// Import Modular Styles
import styles from './AccountMenu.module.css';

const AccountMenu = ({ onClose, handleLogout, user, className = '' }) => {
    return (
        <DropdownCard className={`${styles.accountDropdown} ${className}`}>
            <div className={styles.userInfo}>
                <div className={styles.userNameRow}>
                    <p className={styles.userName}>{user?.full_name || user?.email?.split('@')[0] || 'User'}</p>
                    {user?.is_premium && <Award size={14} color="#FFD700" title="Premium Member" />}
                </div>
                <p className={styles.userEmail}>{user?.email}</p>
            </div>

            {USER_MENU_LINKS.map(link => {
                const Icon = link.icon;
                return (
                    <Link key={link.path} to={link.path} onClick={onClose} className={styles.menuItem}>
                        <Icon size={18} /> {link.label}
                    </Link>
                );
            })}

            {user?.role === 'admin' && (
                <Link to="/admin" onClick={onClose} className={styles.menuItem}>
                    <Shield size={18} /> Admin Center
                </Link>
            )}

            <div className={styles.separator}>
                <button 
                    onClick={() => { onClose(); handleLogout(); }}
                    className={`${styles.menuItem} ${styles.logoutBtn}`}
                >
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </DropdownCard>
    );
};

export default AccountMenu;


