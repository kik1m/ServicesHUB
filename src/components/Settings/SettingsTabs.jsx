import React from 'react';
import { ChevronRight } from 'lucide-react';

const SettingsTabs = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <aside className="settings-sidebar">
            {tabs.map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                >
                    <div className="settings-tab-btn-content">
                        {tab.icon}
                        {tab.label}
                    </div>
                    <ChevronRight size={16} className="lucide-chevron-right" />
                </button>
            ))}
        </aside>
    );
};

export default SettingsTabs;
