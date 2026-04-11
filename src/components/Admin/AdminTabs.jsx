import React from 'react';
import { Clock, Users, FileText, Star, PlusCircle, Package, Mail } from 'lucide-react';
import styles from './AdminTabs.module.css';

const AdminTabs = ({ activeTab, setActiveTab, pendingCount, blogCount, userCount, newsCount }) => {
    const tabs = [
        { id: 'pending', label: 'Approvals', icon: Clock, count: pendingCount },
        { id: 'featured', label: 'Featured', icon: Star },
        { id: 'blogs', label: 'Blogs', icon: FileText, count: blogCount },
        { id: 'add-tool', label: 'Quick Add', icon: PlusCircle },
        { id: 'categories', label: 'Tools Cat', icon: Package },
        { id: 'blog-categories', label: 'Blog Cat', icon: Package },
        { id: 'users', label: 'Users', icon: Users, count: userCount },
        { id: 'newsletter', label: 'Newsletter', icon: Mail, count: newsCount },
    ];

    return (
        <div className={styles.tabsWrapper}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
                >
                    <tab.icon size={18} />
                    {tab.label}
                    {tab.count > 0 && <span className={styles.badge}>{tab.count}</span>}
                </button>
            ))}
        </div>
    );
};

export default AdminTabs;
