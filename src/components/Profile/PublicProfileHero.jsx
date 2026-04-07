import React from 'react';
import { ShieldCheck, Calendar, Globe, Twitter, Github, Linkedin, Share2, Check, LayoutGrid } from 'lucide-react';

const PublicProfileHero = ({ profile, toolCount, handleCopyLink, copied }) => {
    return (
        <div className="public-view-hero-card fade-in">
            {/* Background Accent */}
            <div className="hero-ethereal-glow"></div>

            <div className="public-hero-flex-layout">
                {/* 1. Profile Core Identity Section (Avatar + Main Info) */}
                <div className="public-identity-column">
                    <div className="public-avatar-container">
                        <div className="public-avatar-glow"></div>
                        <div className="public-avatar-box">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.full_name} />
                            ) : (
                                profile.full_name?.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="public-verification-badge">
                            <ShieldCheck size={18} />
                        </div>
                    </div>

                    <div className="public-content-stack">
                        <div className="public-name-badges-row">
                            <h1 className="public-user-name">{profile.full_name}</h1>
                            <span className="public-pill role">{profile.role || 'Member'}</span>
                        </div>

                        <div className="public-meta-info-row">
                            <span className="public-meta-item join">
                                <Calendar size={12} /> Joined {profile?.created_at ? new Date(profile.created_at).getFullYear() : '2026'}
                            </span>
                            {profile.website && (
                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="public-meta-item web">
                                    <Globe size={12} /> Website
                                </a>
                            )}
                        </div>

                        <p className="public-bio-statement">
                            {profile.bio || 'Hubly professional contributor.'}
                        </p>

                        <div className="public-social-minimal-row">
                            {profile.twitter && <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="public-social-icon"><Twitter size={16} /></a>}
                            {profile.github && <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="public-social-icon"><Github size={16} /></a>}
                            {profile.linkedin && <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="public-social-icon"><Linkedin size={16} /></a>}
                        </div>
                    </div>
                </div>

                {/* 2. Actions & Minimal Stats Section (Right Aligned) */}
                <div className="public-actions-analytics-hub">
                    <div className="public-stat-minimal-pill">
                        <LayoutGrid size={16} />
                        <span className="stat-v">{toolCount}</span>
                        <span className="stat-l">Tools Built</span>
                    </div>

                    <button 
                        onClick={handleCopyLink} 
                        className={`public-hero-share-btn ${copied ? 'copied' : ''}`}
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
