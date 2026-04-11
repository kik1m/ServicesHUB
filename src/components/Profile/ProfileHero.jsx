import React from 'react';
import { ShieldCheck, Sparkles, Calendar, LayoutDashboard, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './ProfileHero.module.css';

const ProfileHero = ({ profile }) => {
    if (!profile) return null;

    return (
        <div className={`glass-card ${styles.heroCard} fade-in`}>
            {/* 1. Identity Layout (Row Based) */}
            <div className={styles.heroFlex}>
                {/* Avatar Section */}
                <div className={styles.avatarWrapper}>
                    <div className={styles.avatarBox}>
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.full_name} />
                        ) : (
                            profile.full_name?.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className={styles.verificationMark}>
                        <ShieldCheck size={18} color="#0099ff" />
                    </div>
                </div>

                {/* Info Text Section */}
                <div className={styles.infoStack}>
                    <div className={styles.titleRow}>
                        <h1 className={styles.nameText}>{profile.full_name}</h1>
                        {profile.is_premium && <Sparkles size={20} className={styles.premiumIcon} />}
                    </div>

                    <div className={styles.metaPillGroup}>
                        <span className={`${styles.pill} ${styles.role}`}>{profile.role || 'Member'}</span>
                        <span className={`${styles.pill} ${styles.date}`}>
                            <Calendar size={12} /> Joined {profile?.created_at ? new Date(profile.created_at).getFullYear() : '2026'}
                        </span>
                        {profile.bio && <span className={styles.pillBio}>{profile.bio}</span>}
                    </div>
                </div>

                {/* Quick Actions (Right Aligned) */}
                <div className={styles.quickActions}>
                    <Link to="/dashboard" className={`${styles.btnAction} ${styles.secondary}`}>
                        <LayoutDashboard size={14} /> Dashboard
                    </Link>
                    <Link to={`/u/${profile.id}`} className={`${styles.btnAction} ${styles.primary}`}>
                        <ExternalLink size={14} /> View Public
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProfileHero;
