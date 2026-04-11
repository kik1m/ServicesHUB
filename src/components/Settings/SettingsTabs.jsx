import React from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './SettingsTabs.module.css';

const SettingsTabs = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <aside className={styles.settingsSidebar}>
            {tabs.map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${styles.settingsTabBtn} ${activeTab === tab.id ? styles.active : ''}`}
                >
                    <div className={styles.settingsTabBtnContent}>
                        {tab.icon}
                        {tab.label}
                    </div>
                    <ChevronRight size={16} className={styles.chevron} />
                </button>
            ))}
        </aside>
    );
};

export default SettingsTabs;
