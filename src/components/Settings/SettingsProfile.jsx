import React, { memo } from 'react';
import { Camera, Globe, Twitter, Github, Linkedin, Save, User, Briefcase, FileText } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import SmartImage from '../ui/SmartImage';
import styles from './SettingsProfile.module.css';

/**
 * SettingsProfile - Elite Modular Component
 * Rule #18: Memoized for performance
 * Rule #19: Atomic Component Integration
 */
const SettingsProfile = memo(({ 
    profile, 
    setProfile, 
    handleProfileUpdate, 
    handleAvatarUpload, 
    saving, 
    uploading,
    authUser,
    isLoading,
    content
}) => {
    // Rule #11: Unified Skeleton Pattern
    if (isLoading) {
        return (
            <div className={styles.fadeIn}>
                <div className={styles.settingsCard}>
                    <Skeleton className={styles.skeletonTitle} />
                    
                    <div className={styles.settingsAvatarSection}>
                        <Skeleton className={styles.skeletonAvatar} />
                        <div className={styles.settingsAvatarInfo}>
                            <Skeleton className={styles.skeletonAvatarLabel} />
                            <Skeleton className={styles.skeletonAvatarDesc} />
                            <Skeleton className={styles.skeletonAvatarAction} />
                        </div>
                    </div>

                    <div className={styles.settingsFormGrid}>
                        <Skeleton className={styles.skeletonInput} />
                        <Skeleton className={styles.skeletonInput} />
                    </div>
                    <Skeleton className={styles.skeletonTextArea} />

                    <Skeleton className={styles.skeletonSectionTitle} />
                    <div className={styles.settingsPresenceGrid}>
                        <Skeleton className={styles.skeletonInput} />
                        <Skeleton className={styles.skeletonInput} />
                        <Skeleton className={styles.skeletonInput} />
                        <Skeleton className={styles.skeletonInput} />
                    </div>
                </div>
                <div className={styles.settingsActions}>
                    <Skeleton className={styles.skeletonButton} />
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleProfileUpdate} className={styles.fadeIn}>
            <div className={styles.settingsCard}>
                <h3 className={styles.settingsSectionTitle}>{content.title}</h3>
                
                {/* Avatar Section */}
                <div className={styles.settingsAvatarSection}>
                    <div className={styles.settingsAvatarWrapper}>
                        <div className={styles.settingsAvatarDisplay}>
                            {uploading ? (
                                <Skeleton width="100%" height="100%" borderRadius="100px" />
                            ) : (
                                <SmartImage 
                                    src={profile.avatar_url} 
                                    alt="Avatar" 
                                    fallbackIcon={User}
                                    className={styles.avatarImg}
                                    containerClassName={styles.avatarContainer}
                                />
                            )}
                        </div>
                        <label htmlFor="avatar-upload" className={styles.settingsAvatarUploadBtn}>
                            <Camera size={18} color="white" />
                            <input 
                                type="file" 
                                id="avatar-upload" 
                                hidden 
                                accept="image/*" 
                                onChange={handleAvatarUpload} 
                                disabled={uploading}
                            />
                        </label>
                    </div>
                    <div className={styles.settingsAvatarInfo}>
                        <h4>{content.avatarTitle}</h4>
                        <p>{content.avatarDesc}</p>
                        <label htmlFor="avatar-upload" className={styles.settingsAvatarChangeLink}>
                            {content.avatarAction}
                        </label>
                    </div>
                </div>

                {/* Form Grid - Rule #19: Correct Atomic Icon Usage */}
                <div className={styles.settingsFormGrid}>
                    <Input 
                        label="Full Name"
                        icon={User}
                        value={profile.full_name || ''}
                        onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                        placeholder="e.g. John Doe"
                        className={styles.settingsInputGroup}
                    />
                    <Input 
                        label="Professional Role"
                        icon={Briefcase}
                        value={profile.role || ''}
                        onChange={(e) => setProfile({...profile, role: e.target.value})}
                        placeholder="e.g. AI Researcher / SaaS Owner"
                        className={styles.settingsInputGroup}
                    />
                </div>

                <Input 
                    label="Short Bio"
                    icon={FileText}
                    multiline={true}
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    placeholder="Write a brief intro for your public profile..."
                    className={`${styles.settingsInputGroup} ${styles.mb3rem}`}
                />

                <h3 className={styles.settingsSectionTitle}>{content.presenceTitle}</h3>
                <div className={styles.settingsPresenceGrid}>
                    <Input 
                        label="Website"
                        icon={Globe}
                        type="url"
                        value={profile.website || ''}
                        onChange={(e) => setProfile({...profile, website: e.target.value})}
                        placeholder="https://yourwebsite.com"
                        className={styles.settingsInputGroup}
                    />
                    <Input 
                        label="Twitter (X)"
                        icon={Twitter}
                        value={profile.twitter || ''}
                        onChange={(e) => setProfile({...profile, twitter: e.target.value})}
                        placeholder="Username"
                        className={styles.settingsInputGroup}
                    />
                    <Input 
                        label="GitHub"
                        icon={Github}
                        value={profile.github || ''}
                        onChange={(e) => setProfile({...profile, github: e.target.value})}
                        placeholder="Username"
                        className={styles.settingsInputGroup}
                    />
                    <Input 
                        label="LinkedIn"
                        icon={Linkedin}
                        value={profile.linkedin || ''}
                        onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                        placeholder="Username"
                        className={styles.settingsInputGroup}
                    />
                </div>
            </div>

            <div className={styles.settingsActions}>
                <Button 
                    type="submit" 
                    isLoading={saving} 
                    disabled={uploading}
                    className={styles.btnSettingsSave}
                    icon={Save}
                >
                    {content.saveBtn}
                </Button>
            </div>
        </form>
    );
});

export default SettingsProfile;
