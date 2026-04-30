import React, { memo } from 'react';
import { ChevronRight } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './SettingsTabs.module.css';

/**
 * SettingsTabs - Elite Sidebar Component
 * Rule #18: Memoized for performance
 */
const SettingsTabs = memo(({ tabs = [], activeTab, setActiveTab, isLoading, error, onRetry }) => {
    return (
        <Safeguard error={error} onRetry={onRetry} title="Tabs Unavailable">
            <aside className={styles.settingsSidebar}>
                {isLoading ? (
                    // Unified Skeleton Pattern - Rule #11
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={`sk-tab-${i}`} className={styles.tabSkeleton}>
                            <Skeleton className={styles.skeletonIcon} />
                            <Skeleton className={styles.skeletonLabel} />
                        </div>
                    ))
                ) : (
                    tabs?.map(tab => (
                        <button 
                            key={tab?.id}
                            type="button"
                            onClick={() => setActiveTab(tab?.id)}
                            className={`${styles.settingsTabBtn} ${activeTab === tab?.id ? styles.active : ''}`}
                        >
                            <div className={styles.settingsTabBtnContent}>
                                <span className={styles.tabIcon}>{tab?.icon}</span>
                                <span className={styles.tabLabel}>{tab?.label}</span>
                            </div>
                            <ChevronRight size={16} className={styles.chevron} />
                        </button>
                    ))
                )}
            </aside>
        </Safeguard>
    );
});

export default SettingsTabs;
