import React from 'react';
import { ShieldCheck, Sparkles, Calendar, Globe, Twitter, Github, Linkedin, ExternalLink, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileHero = ({ profile }) => {
    return (
        <div className="glass-card priv-hero-card fade-in">
            {/* 1. Identity Layout (Row Based) */}
            <div className="priv-hero-flex">
                {/* Avatar Section */}
                <div className="priv-avatar-wrapper">
                    <div className="priv-avatar-box">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.full_name} />
                        ) : (
                            profile.full_name?.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="priv-verification-mark">
                        <ShieldCheck size={18} color="#0099ff" />
                    </div>
                </div>

                {/* Info Text Section */}
                <div className="priv-info-stack">
                    <div className="priv-title-row">
                        <h1 className="priv-name-text">{profile.full_name}</h1>
                        {profile.is_premium && <Sparkles size={20} className="priv-premium-icon" />}
                    </div>

                    <div className="priv-meta-pill-group">
                        <span className="priv-pill role">{profile.role || 'Member'}</span>
                        <span className="priv-pill date">
                            <Calendar size={12} /> Joined {profile?.created_at ? new Date(profile.created_at).getFullYear() : '2026'}
                        </span>
                        {profile.bio && <span className="priv-pill-bio">{profile.bio}</span>}
                    </div>
                </div>

                {/* Quick Actions (Right Aligned) */}
                <div className="priv-quick-actions">
                    <Link to="/dashboard" className="priv-btn-action secondary">
                        <LayoutDashboard size={14} /> Dashboard
                    </Link>
                    <Link to={`/u/${profile.id}`} className="priv-btn-action primary">
                        <ExternalLink size={14} /> View Public
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProfileHero;
