import React from 'react';
import { Bell } from 'lucide-react';

const SettingsNotifications = ({ profile }) => {
    return (
        <div className="fade-in">
            <div className="settings-card">
                <h3 className="settings-section-title">Notification Preferences</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>
                    Manage how you want to be notified about activity on your account and tools.
                </p>
                
                <div className="notif-preferences-list">
                    {[
                        { id: 'email_notif', label: 'Email Notifications', desc: 'Receive important updates via your registered email.' },
                        { id: 'review_notif', label: 'New Review Alerts', desc: 'Get notified when someone leaves a review on your tools.' },
                        { id: 'promo_notif', label: 'Promotion Updates', desc: 'Receive alerts about your active tool promotions and status.' }
                    ].map(item => (
                        <div key={item.id} className="notif-item">
                            <div className="notif-item-info">
                                <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>{item.label}</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                            </div>
                            {/* Toggle Switch */}
                            <div className="toggle-switch">
                                <div className="toggle-switch-handle"></div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="notif-status-box">
                    <Bell size={20} color="var(--accent)" style={{ flexShrink: 0 }} />
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Note: Real-time notifications are currently active. Permanent notification history is coming soon!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SettingsNotifications;
