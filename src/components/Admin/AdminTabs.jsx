import React from 'react';
import { Clock, Layout, Package, Mail, Users, FileText, Star, PlusCircle } from 'lucide-react';

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
        <div className="admin-tabs-wrapper">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`admin-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                >
                    <tab.icon size={18} />
                    {tab.label}
                    {tab.count > 0 && <span className="tab-badge">{tab.count}</span>}
                </button>
            ))}
        </div>
    );
};

export default AdminTabs;
