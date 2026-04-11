import React from 'react';
import { Shield, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './ProfileMembershipSidebar.module.css';

const ProfileMembershipSidebar = ({ profile }) => {
    return (
        <div className={`glass-card ${styles.sidebarCard} fade-in`}>
            <h3 className={styles.sidebarTitle}>Plan & Status</h3>
            <div className={`${styles.membershipCardContent} ${profile?.is_premium ? styles.premium : ''}`}>
                <div className={styles.iconBox}>
                    <Shield size={24} color={profile?.is_premium ? '#FFD700' : 'var(--primary)'} />
                </div>
                <div className={styles.membershipInfo}>
                    <h5>{profile?.is_premium ? 'PREMIUM MEMBER' : 'FREE PLAN'}</h5>
                    <p>{profile?.is_premium ? 'Elite Access Enabled' : 'Basic Community Access'}</p>
                </div>
            </div>
            
            {!profile?.is_premium ? (
                <Link to="/premium" className={`btn-primary ${styles.upgradeBtn}`}>
                    UPGRADE TO PRO
                </Link>
            ) : (
                <div className={styles.premiumStatusBadge}>PRIME ACTIVE</div>
            )}

            <div className={styles.sidebarFooter}>
                <Link to="/settings" className={`btn-secondary ${styles.settingsBtn}`}>
                    <Settings size={14} /> Profile Settings
                </Link>
            </div>
        </div>
    );
};

export default ProfileMembershipSidebar;
