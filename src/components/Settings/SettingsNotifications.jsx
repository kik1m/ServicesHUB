'use client';
import React, { memo } from 'react';
import Skeleton from '../ui/Skeleton';
import Toggle from '../ui/Toggle';
import Safeguard from '../ui/Safeguard';
import { SETTINGS_UI_CONSTANTS } from '../../constants/settingsConstants';
import styles from './SettingsNotifications.module.css';

/**
 * SettingsNotifications - Elite Hardened Card (Next.js Port)
 */
const SettingsNotifications = memo(({ profile, onToggle, isLoading, error, onRetry }) => {
    if (isLoading) {
        // ... (skeletons remain the same)
        return (
            <div className={styles.fadeIn}>
                <div className={styles.settingsCard}>
                    <Skeleton className={styles.skeletonTitle} />
                    <Skeleton className={styles.skeletonSubtitle} />
                    <div className={styles.notifPreferencesList}>
                        {[1, 2, 3].map(i => (
                            <div key={i} className={styles.notifItem}>
                                <div className={styles.notifItemInfo}>
                                    <Skeleton className={styles.skeletonNotifLabel} />
                                    <Skeleton className={styles.skeletonNotifDesc} />
                                </div>
                                <Skeleton className={styles.skeletonToggle} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const items = [
        { id: 'email_updates', label: 'Email Updates', desc: 'Receive weekly digests and platform news.' },
        { id: 'tool_alerts', label: 'Tool Alerts', desc: 'Get notified when your tools are reviewed or updated.' },
        { id: 'security_alerts', label: 'Security Alerts', desc: 'Get notified about important account security events.' }
    ];

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.fadeIn}>
                <div className={styles.settingsCard}>
                    <h2 className={styles.settingsSectionTitle}>Notification Preferences</h2>
                    <p className={styles.settingsSectionSubtitle}>Manage how and when you receive updates from HUBly.</p>
                    
                    <div className={styles.notifPreferencesList}>
                        {items.map(item => (
                            <div key={item.id} className={styles.notifItem}>
                                <div className={styles.notifItemInfo}>
                                    <h3>{item.label}</h3>
                                    <p>{item.desc}</p>
                                </div>
                                <Toggle 
                                    checked={!!profile?.[item.id]}
                                    onChange={(val) => onToggle(item.id, val)} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Safeguard>
    );
});

export default SettingsNotifications;
