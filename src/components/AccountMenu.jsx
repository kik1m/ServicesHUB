import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, UserCircle, Settings, LogOut, Shield, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const AccountMenu = ({ onClose, handleLogout }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                setProfile({ ...data, email: user.email });
            }
            setLoading(false);
        };
        getProfile();
    }, []);

    return (
        <div className="account-dropdown glass-card shadow-lg" style={{
            position: 'absolute', top: '80px', right: '0px', width: '240px',
            zIndex: 10001, padding: '0.75rem', animation: 'slideUp 0.3s ease',
            background: 'rgba(15, 15, 18, 0.98)', backdropFilter: 'blur(40px)',
            border: '1px solid var(--border)'
        }}>
            <div style={{ padding: '10px 15px', borderBottom: '1px solid var(--border)', marginBottom: '8px' }}>
                {loading ? (
                    <Loader2 className="animate-spin" size={16} />
                ) : (
                    <>
                        <p style={{ fontSize: '0.85rem', fontWeight: '800', margin: 0 }}>{profile?.full_name || 'User'}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.email}</p>
                    </>
                )}
            </div>

            <Link to="/dashboard" onClick={onClose} className="account-menu-item">
                <LayoutDashboard size={18} /> Dashboard
            </Link>

            <Link to="/profile" onClick={onClose} className="account-menu-item">
                <UserCircle size={18} /> My Profile
            </Link>

            {profile?.role === 'admin' && (
                <Link to="/admin" onClick={onClose} className="account-menu-item">
                    <Shield size={18} /> Admin Center
                </Link>
            )}

            <Link to="/settings" onClick={onClose} className="account-menu-item">
                <Settings size={18} /> Settings
            </Link>

            <div style={{ borderTop: '1px solid var(--border)', marginTop: '8px', paddingTop: '8px' }}>
                <button 
                    onClick={() => { onClose(); handleLogout(); }}
                    className="account-menu-item logout-btn" 
                    style={{ background: 'transparent', border: 'none', color: '#ff5050', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </div>
    );
};

export default AccountMenu;
