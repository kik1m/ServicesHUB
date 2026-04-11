import React from 'react';
import { Camera, Globe, Twitter, Github, Linkedin, Save, Loader2 } from 'lucide-react';
import styles from './SettingsProfile.module.css';

const SettingsProfile = ({ 
    profile, 
    setProfile, 
    handleProfileUpdate, 
    handleAvatarUpload, 
    saving, 
    uploading,
    authUser 
}) => {
    return (
        <form onSubmit={handleProfileUpdate} className={styles.fadeIn}>
            <div className={styles.settingsCard}>
                <h3 className={styles.settingsSectionTitle}>Personal Information</h3>
                
                {/* Avatar Section */}
                <div className={styles.settingsAvatarSection}>
                    <div className={styles.settingsAvatarWrapper}>
                        <div className={styles.settingsAvatarDisplay}>
                            {uploading ? (
                                <Loader2 className="animate-spin" size={30} />
                            ) : profile.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" />
                            ) : (
                                profile.full_name?.charAt(0) || authUser?.email?.charAt(0).toUpperCase()
                            )}
                        </div>
                        <label htmlFor="avatar-upload" className={styles.settingsAvatarUploadBtn}>
                            <Camera size={18} color="white" />
                            <input type="file" id="avatar-upload" hidden accept="image/*" onChange={handleAvatarUpload} />
                        </label>
                    </div>
                    <div className={styles.settingsAvatarInfo}>
                        <h4>Profile Picture</h4>
                        <p>Recommend 400x400 JPG or PNG.</p>
                        <label htmlFor="avatar-upload" className={styles.settingsAvatarChangeLink}>Change Avatar</label>
                    </div>
                </div>

                {/* Form Grid */}
                <div className={styles.settingsFormGrid}>
                    <div className={styles.settingsInputGroup}>
                        <label className={styles.settingsLabel}>Full Name</label>
                        <input 
                            type="text" 
                            className={styles.settingsInput}
                            value={profile.full_name}
                            onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div className={styles.settingsInputGroup}>
                        <label className={styles.settingsLabel}>Professional Role</label>
                        <input 
                            type="text" 
                            className={styles.settingsInput}
                            value={profile.role}
                            onChange={(e) => setProfile({...profile, role: e.target.value})}
                            placeholder="e.g. AI Researcher / SaaS Owner"
                        />
                    </div>
                </div>

                <div className={styles.settingsInputGroup} style={{ marginBottom: '3rem' }}>
                    <label className={styles.settingsLabel}>Short Bio</label>
                    <textarea 
                        className={`${styles.settingsInput} ${styles.settingsTextarea}`}
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        placeholder="Write a brief intro for your public profile..."
                    />
                </div>

                <h3 className={styles.settingsSectionTitle}>Online Presence</h3>
                <div className={styles.settingsPresenceGrid}>
                    <div className={styles.settingsInputGroup}>
                        <label className={styles.settingsLabel}>
                            <Globe size={14} /> Website
                        </label>
                        <input 
                            type="url" 
                            className={styles.settingsInput}
                            value={profile.website}
                            onChange={(e) => setProfile({...profile, website: e.target.value})}
                            placeholder="https://yourwebsite.com"
                        />
                    </div>
                    <div className={styles.settingsInputGroup}>
                        <label className={styles.settingsLabel}>
                            <Twitter size={14} /> Twitter (X)
                        </label>
                        <input 
                            type="text" 
                            className={styles.settingsInput}
                            value={profile.twitter}
                            onChange={(e) => setProfile({...profile, twitter: e.target.value})}
                            placeholder="Username"
                        />
                    </div>
                    <div className={styles.settingsInputGroup}>
                        <label className={styles.settingsLabel}>
                            <Github size={14} /> GitHub
                        </label>
                        <input 
                            type="text" 
                            className={styles.settingsInput}
                            value={profile.github}
                            onChange={(e) => setProfile({...profile, github: e.target.value})}
                            placeholder="Username"
                        />
                    </div>
                    <div className={styles.settingsInputGroup}>
                        <label className={styles.settingsLabel}>
                            <Linkedin size={14} /> LinkedIn
                        </label>
                        <input 
                            type="text" 
                            className={styles.settingsInput}
                            value={profile.linkedin}
                            onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                            placeholder="Username"
                        />
                    </div>
                </div>
            </div>

            <div className={styles.settingsActions}>
                <button type="submit" disabled={saving || uploading} className={`btn-primary ${styles.btnSettingsSave}`}>
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Save Changes
                </button>
            </div>
        </form>
    );
};

export default SettingsProfile;
