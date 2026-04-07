import React from 'react';
import { Shield, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileMembershipSidebar = ({ profile }) => {
    return (
        <div className="glass-card profile-sidebar-card fade-in">
            <h3 className="profile-sidebar-title">Plan & Status</h3>
            <div className={`membership-card-content ${profile?.is_premium ? 'premium' : ''}`}>
                <div className="membership-icon-box">
                    <Shield size={24} color={profile?.is_premium ? '#FFD700' : 'var(--primary)'} />
                </div>
                <div className="membership-info">
                    <h5>{profile?.is_premium ? 'PREMIUM MEMBER' : 'FREE PLAN'}</h5>
                    <p>{profile?.is_premium ? 'Elite Access Enabled' : 'Basic Community Access'}</p>
                </div>
            </div>
            {!profile?.is_premium ? (
                <Link to="/premium" className="btn-primary" style={{ width: '100%', marginBottom: '1.2rem', padding: '12px', fontSize: '0.8rem', fontWeight: '800', display: 'block', textAlign: 'center', textDecoration: 'none', borderRadius: '12px' }}>UPGRADE TO PRO</Link>
            ) : (
                <div className="premium-status-badge">PRIME ACTIVE</div>
            )}

            <div className="profile-sidebar-footer">
                <Link to="/settings" className="btn-secondary" style={{ padding: '12px', borderRadius: '14px', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}>
                    <Settings size={14} /> Profile Settings
                </Link>
            </div>
        </div>
    );
};

export default ProfileMembershipSidebar;
