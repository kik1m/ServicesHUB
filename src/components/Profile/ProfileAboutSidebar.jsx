import React from 'react';
import { User, Award, Globe, ExternalLink, Twitter, Github, Linkedin } from 'lucide-react';

const ProfileAboutSidebar = ({ profile }) => {
    return (
        <div className="glass-card profile-sidebar-card fade-in">
            <h3 className="profile-sidebar-title">
                <User size={18} color="var(--primary)" /> About Me
            </h3>
            <p className="profile-bio-text">
                {profile?.bio || 'No bio provided yet. Add a bio in settings to tell the community about yourself.'}
            </p>

            <h4 className="profile-sidebar-subtitle">Identity</h4>
            <div className="profile-identity-list">
                <div className="profile-identity-item">
                    <div className="membership-icon-box" style={{ width: '32px', height: '32px' }}><Award size={14} color="var(--secondary)" /></div>
                    <span>{profile?.role || 'User / Seeker'}</span>
                </div>
                {profile?.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="profile-identity-item social-link-hover">
                        <div className="membership-icon-box" style={{ width: '32px', height: '32px' }}><Globe size={14} /></div>
                        <span>Website</span> <ExternalLink size={12} style={{ opacity: 0.5, marginLeft: 'auto' }} />
                    </a>
                )}
            </div>

            <h4 className="profile-sidebar-subtitle">Social Profiles</h4>
            <div className="social-links-grid">
                {profile?.twitter && <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="social-box-slim"><Twitter size={16} /></a>}
                {profile?.github && <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="social-box-slim"><Github size={16} /></a>}
                {profile?.linkedin && <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="social-box-slim"><Linkedin size={16} /></a>}
                {!profile?.twitter && !profile?.github && !profile?.linkedin && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>No social links connected.</p>
                )}
            </div>
        </div>
    );
};

export default ProfileAboutSidebar;
