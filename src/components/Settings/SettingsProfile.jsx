'use client';
import React, { memo } from 'react';
import { Camera, Globe, Twitter, Github, Linkedin, Save, User, Briefcase, FileText, Target, Activity } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import SmartImage from '../ui/SmartImage';
import Safeguard from '../ui/Safeguard';
import styles from './SettingsProfile.module.css';

/**
 * SettingsProfile - Elite Modular Component (Next.js Port)
 */
const SettingsProfile = memo(({ 
    profile, 
    setProfile, 
    handleProfileUpdate, 
    handleAvatarUpload, 
    saving, 
    uploading,
    isLoading,
    error,
    onRetry
}) => {

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
                        </div>
                    </div>
                    <div className={styles.settingsFormGrid}>
                        <Skeleton className={styles.skeletonInput} />
                        <Skeleton className={styles.skeletonInput} />
                    </div>
                    <Skeleton className={styles.skeletonTextArea} />
                </div>
            </div>
        );
    }

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <form onSubmit={handleProfileUpdate} className={styles.fadeIn}>
                <div className={styles.settingsCard}>
                    <h2 className={styles.settingsSectionTitle}>Profile Information</h2>
                    
                    {/* Avatar Section */}
                    <div className={styles.settingsAvatarSection}>
                        <div className={styles.settingsAvatarWrapper}>
                            <div className={styles.settingsAvatarDisplay}>
                                {uploading ? (
                                    <Skeleton width="100%" height="100%" borderRadius="100px" />
                                ) : (
                                    <SmartImage 
                                        src={profile?.avatar_url} 
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
                            <h3>Profile Picture</h3>
                            <p>PNG, JPG or GIF. Max 2MB.</p>
                            <label htmlFor="avatar-upload" className={styles.settingsAvatarChangeLink}>
                                Change Photo
                            </label>
                        </div>
                    </div>

                    {/* Form Grid */}
                    <div className={styles.settingsFormGrid}>
                        <Input 
                            label="Full Name"
                            icon={User}
                            value={profile?.full_name || ''}
                            onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                            placeholder="John Doe"
                        />
                        <Input 
                            label="Professional Role"
                            icon={Briefcase}
                            value={profile?.job_title || ''}
                            onChange={(e) => setProfile({...profile, job_title: e.target.value})}
                            placeholder="e.g. AI Researcher"
                        />
                    </div>

                    <div className={styles.settingsFormGrid}>
                        <Input 
                            label="Experience Level"
                            icon={Activity}
                            value={profile?.experience_level || ''}
                            onChange={(e) => setProfile({...profile, experience_level: e.target.value})}
                            placeholder="e.g. Intermediate, Advanced"
                        />
                    </div>

                    <Input 
                        label="Primary Goal"
                        icon={Target}
                        multiline={true}
                        rows={2}
                        value={profile?.primary_goal || ''}
                        onChange={(e) => setProfile({...profile, primary_goal: e.target.value})}
                        placeholder="What are you trying to build or discover?"
                        className={styles.mb3rem}
                    />

                    <Input 
                        label="Short Bio"
                        icon={FileText}
                        multiline={true}
                        rows={4}
                        value={profile?.bio || ''}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        placeholder="Tell the community about yourself..."
                        className={styles.mb3rem}
                    />

                    <h2 className={styles.settingsSectionTitle}>Social Presence</h2>
                    <div className={styles.settingsPresenceGrid}>
                        <Input 
                            label="Website"
                            icon={Globe}
                            type="url"
                            value={profile?.website || ''}
                            onChange={(e) => setProfile({...profile, website: e.target.value})}
                            placeholder="https://..."
                        />
                        <Input 
                            label="Twitter (X)"
                            icon={Twitter}
                            value={profile?.twitter || ''}
                            onChange={(e) => setProfile({...profile, twitter: e.target.value})}
                            placeholder="Username"
                        />
                        <Input 
                            label="GitHub"
                            icon={Github}
                            value={profile?.github || ''}
                            onChange={(e) => setProfile({...profile, github: e.target.value})}
                            placeholder="Username"
                        />
                        <Input 
                            label="LinkedIn"
                            icon={Linkedin}
                            value={profile?.linkedin || ''}
                            onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                            placeholder="Username"
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
                        Save Changes
                    </Button>
                </div>
            </form>
        </Safeguard>
    );
});

export default SettingsProfile;
