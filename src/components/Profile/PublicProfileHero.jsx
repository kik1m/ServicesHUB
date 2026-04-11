import React from 'react';
import { ShieldCheck, Calendar, Globe, Twitter, Github, Linkedin, Share2, Check, LayoutGrid } from 'lucide-react';
import styles from './PublicProfileHero.module.css';

const PublicProfileHero = ({ profile, toolCount, handleCopyLink, copied }) => {
    if (!profile) return null;

    return (
        <div className={`${styles.publicHeroCard} fade-in`}>
            {/* Background Accent */}
            <div className={styles.etherealGlow}></div>

            <div className={styles.heroFlexLayout}>
                {/* 1. Profile Core Identity Section (Avatar + Main Info) */}
                <div className={styles.identityColumn}>
                    <div className={styles.avatarContainer}>
                        <div className={styles.avatarGlow}></div>
                        <div className={styles.avatarBox}>
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.full_name} />
                            ) : (
                                profile.full_name?.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className={styles.verificationBadge}>
                            <ShieldCheck size={18} />
                        </div>
                    </div>

                    <div className={styles.contentStack}>
                        <div className={styles.nameBadgesRow}>
                            <h1 className={styles.userName}>{profile.full_name}</h1>
                            <span className={`${styles.pill} ${styles.role}`}>{profile.role || 'Member'}</span>
                        </div>

                        <div className={styles.metaInfoRow}>
                            <span className={styles.metaItem}>
                                <Calendar size={12} /> Joined {profile?.created_at ? new Date(profile.created_at).getFullYear() : '2026'}
                            </span>
                            {profile.website && (
                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className={`${styles.metaItem} ${styles.web}`}>
                                    <Globe size={12} /> Website
                                </a>
                            )}
                        </div>

                        <p className={styles.bioStatement}>
                            {profile.bio || 'Hubly professional contributor.'}
                        </p>

                        <div className={styles.socialMinimalRow}>
                            {profile.twitter && <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><Twitter size={16} /></a>}
                            {profile.github && <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><Github size={16} /></a>}
                            {profile.linkedin && <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><Linkedin size={16} /></a>}
                        </div>
                    </div>
                </div>

                {/* 2. Actions & Minimal Stats Section (Right Aligned) */}
                <div className={styles.actionsAnalyticsHub}>
                    <div className={styles.statMinimalPill}>
                        <LayoutGrid size={16} />
                        <span>{toolCount}</span>
                        <span>Tools Built</span>
                    </div>

                    <button 
                        onClick={handleCopyLink} 
                        className={`${styles.shareBtn} ${copied ? styles.copied : ''}`}
                    >
                        {copied ? <Check size={16} /> : <Share2 size={16} />}
                        <span>{copied ? 'Copied' : 'Share'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PublicProfileHero;
