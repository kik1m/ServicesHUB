import React from 'react';
import { Bell } from 'lucide-react';
import styles from './SettingsNotifications.module.css';

const SettingsNotifications = ({ profile }) => {
    return (
        <div className={styles.fadeIn}>
            <div className={styles.settingsCard}>
                <h3 className={styles.settingsSectionTitle}>Notification Preferences</h3>
                <p className={styles.description}>
                    Manage how you want to be notified about activity on your account and tools.
                </p>
                
                <div className={styles.notifPreferencesList}>
                    {[
                        { id: 'email_notif', label: 'Email Notifications', desc: 'Receive important updates via your registered email.' },
                        { id: 'review_notif', label: 'New Review Alerts', desc: 'Get notified when someone leaves a review on your tools.' },
                        { id: 'promo_notif', label: 'Promotion Updates', desc: 'Receive alerts about your active tool promotions and status.' }
                    ].map(item => (
                        <div key={item.id} className={styles.notifItem}>
                            <div className={styles.notifItemInfo}>
                                <h4>{item.label}</h4>
                                <p>{item.desc}</p>
                            </div>
                            {/* Toggle Switch */}
                            <div className={styles.toggleSwitch}>
                                <div className={styles.toggleSwitchHandle}></div>
                            </div>
                        </div>
                    ))}
                </div>
                
            </div>
        </div>
    );
};

export default SettingsNotifications;
