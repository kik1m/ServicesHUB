import React, { memo } from 'react';
import Skeleton from '../ui/Skeleton';
import Toggle from '../ui/Toggle';
import styles from './SettingsNotifications.module.css';

/**
 * SettingsNotifications - Elite Hardened Card
 * Rule #18: Memoized
 * Rule #34: Constant-driven
 */
const SettingsNotifications = memo(({ profile, isLoading, content }) => {
    if (isLoading) {
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

    return (
        <div className={styles.fadeIn}>
            <div className={styles.settingsCard}>
                <h3 className={styles.settingsSectionTitle}>{content.title}</h3>
                <p className={styles.settingsSectionSubtitle}>{content.subtitle}</p>
                
                <div className={styles.notifPreferencesList}>
                    {content.items.map(item => (
                        <div key={item.id} className={styles.notifItem}>
                            <div className={styles.notifItemInfo}>
                                <h4>{item.label}</h4>
                                <p>{item.desc}</p>
                            </div>
                            <Toggle 
                                checked={true} // Hardcoded for demo, would come from user state in real app
                                onChange={(val) => console.log(`Toggle ${item.id}:`, val)} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

export default SettingsNotifications;
