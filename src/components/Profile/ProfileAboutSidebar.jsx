import React from 'react';
import { User, Award, Globe, ExternalLink, Twitter, Github, Linkedin } from 'lucide-react';
import styles from './ProfileAboutSidebar.module.css';

const ProfileAboutSidebar = ({ profile }) => {
    return (
        <div className={`glass-card ${styles.sidebarCard} fade-in`}>
            <h3 className={styles.sidebarTitle}>
                <User size={18} color="var(--primary)" /> About Me
            </h3>
            <p className={styles.bioText}>
                {profile?.bio || 'No bio provided yet. Add a bio in settings to tell the community about yourself.'}
            </p>

            <h4 className={styles.sidebarSubtitle}>Identity</h4>
            <div className={styles.identityList}>
                <div className={styles.identityItem}>
                    <div className={styles.iconBox}>
                        <Award size={14} color="var(--secondary)" />
                    </div>
                    <span>{profile?.role || 'User / Seeker'}</span>
                </div>
                {profile?.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className={`${styles.identityItem} ${styles.socialLinkHover}`}>
                        <div className={styles.iconBox}>
                            <Globe size={14} />
                        </div>
                        <span>Website</span> 
                        <ExternalLink size={12} className={styles.externalIcon} />
                    </a>
                )}
            </div>

            <h4 className={styles.sidebarSubtitle}>Social Profiles</h4>
            <div className={styles.socialLinksGrid}>
                {profile?.twitter && <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className={styles.socialBoxSlim}><Twitter size={16} /></a>}
                {profile?.github && <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className={styles.socialBoxSlim}><Github size={16} /></a>}
                {profile?.linkedin && <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className={styles.socialBoxSlim}><Linkedin size={16} /></a>}
                {!profile?.twitter && !profile?.github && !profile?.linkedin && (
                    <p className={styles.noSocials}>No social links connected.</p>
                )}
            </div>
        </div>
    );
};

export default ProfileAboutSidebar;
