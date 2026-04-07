import React from 'react';
import { Camera, Globe, Twitter, Github, Linkedin, Save, Loader2 } from 'lucide-react';

const SettingsProfile = ({ 
    profile, 
    setProfile, 
    handleProfileUpdate, 
    handleAvatarUpload, 
    saving, 
    authUser 
}) => {
    return (
        <form onSubmit={handleProfileUpdate} className="fade-in">
            <div className="settings-card">
                <h3 className="settings-section-title">Personal Information</h3>
                
                {/* Avatar Section */}
                <div className="settings-avatar-section">
                    <div className="settings-avatar-wrapper">
                        <div className="settings-avatar-display">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" />
                            ) : (
                                profile.full_name?.charAt(0) || authUser?.email?.charAt(0).toUpperCase()
                            )}
                        </div>
                        <label htmlFor="avatar-upload" className="settings-avatar-upload-btn">
                            <Camera size={18} color="white" />
                            <input type="file" id="avatar-upload" hidden accept="image/*" onChange={handleAvatarUpload} />
                        </label>
                    </div>
                    <div className="settings-avatar-info">
                        <h4>Profile Picture</h4>
                        <p>Recommend 400x400 JPG or PNG.</p>
                        <label htmlFor="avatar-upload" className="settings-avatar-change-link">Change Avatar</label>
                    </div>
                </div>

                {/* Form Grid */}
                <div className="settings-form-grid">
                    <div className="settings-input-group">
                        <label className="settings-label">Full Name</label>
                        <input 
                            type="text" 
                            className="settings-input"
                            value={profile.full_name}
                            onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div className="settings-input-group">
                        <label className="settings-label">Professional Role</label>
                        <input 
                            type="text" 
                            className="settings-input"
                            value={profile.role}
                            onChange={(e) => setProfile({...profile, role: e.target.value})}
                            placeholder="e.g. AI Researcher / SaaS Owner"
                        />
                    </div>
                </div>

                <div className="settings-input-group" style={{ marginBottom: '3rem' }}>
                    <label className="settings-label">Short Bio</label>
                    <textarea 
                        className="settings-input settings-textarea"
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        placeholder="Write a brief intro for your public profile..."
                    />
                </div>

                <h3 className="settings-section-title">Online Presence</h3>
                <div className="settings-presence-grid">
                    <div className="settings-input-group">
                        <label className="settings-label">
                            <Globe size={14} /> Website
                        </label>
                        <input 
                            type="url" 
                            className="settings-input"
                            value={profile.website}
                            onChange={(e) => setProfile({...profile, website: e.target.value})}
                            placeholder="https://yourwebsite.com"
                        />
                    </div>
                    <div className="settings-input-group">
                        <label className="settings-label">
                            <Twitter size={14} /> Twitter (X)
                        </label>
                        <input 
                            type="text" 
                            className="settings-input"
                            value={profile.twitter}
                            onChange={(e) => setProfile({...profile, twitter: e.target.value})}
                            placeholder="Username"
                        />
                    </div>
                    <div className="settings-input-group">
                        <label className="settings-label">
                            <Github size={14} /> GitHub
                        </label>
                        <input 
                            type="text" 
                            className="settings-input"
                            value={profile.github}
                            onChange={(e) => setProfile({...profile, github: e.target.value})}
                            placeholder="Username"
                        />
                    </div>
                    <div className="settings-input-group">
                        <label className="settings-label">
                            <Linkedin size={14} /> LinkedIn
                        </label>
                        <input 
                            type="text" 
                            className="settings-input"
                            value={profile.linkedin}
                            onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                            placeholder="Username"
                        />
                    </div>
                </div>
            </div>

            <div className="settings-actions">
                <button type="submit" disabled={saving} className="btn-primary btn-settings-save">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Save Changes
                </button>
            </div>
        </form>
    );
};

export default SettingsProfile;
