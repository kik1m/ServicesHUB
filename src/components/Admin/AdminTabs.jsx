
import React, { memo } from 'react';
import { ADMIN_UI_CONSTANTS } from '../../constants/adminConstants';
import { Clock, Users, FileText, Star, PlusCircle, FolderTree, Tags, Mail, LayoutGrid, Bot } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './AdminTabs.module.css';

/**
 * AdminTabs - Elite Tab Navigator
 * Rule #18: Memoized
 */
const AdminTabs = memo(({ activeTab, setActiveTab, pendingCount, blogCount, userCount, newsCount, isLoading, error, onRetry }) => {
    const labels = ADMIN_UI_CONSTANTS.tabs;

    // Mapping icons to tab IDs - Rule #14
    const iconMap = {
        'ai-manager': Bot,
        pending: Clock,
        'manage-tools': LayoutGrid,
        featured: Star,
        blog: FileText,
        'add-tool': PlusCircle,
        categories: FolderTree,
        'blog-categories': Tags,
        users: Users,
        newsletter: Mail
    };

    // Mapping counts to tab IDs
    const countMap = {
        pending: pendingCount,
        blog: blogCount,
        users: userCount,
        newsletter: newsCount
    };

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.tabsWrapper}>
                {isLoading ? (
                    Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className={styles.tabBtnSkeleton}>
                            <Skeleton className={styles.skeletonTab} />
                        </div>
                    ))
                ) : (
                    labels?.map(tab => {
                        const Icon = iconMap[tab.id];
                        const count = countMap[tab.id];
                        
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
                            >
                                {Icon && <Icon size={16} />}
                                <span className={styles.tabLabel}>{tab?.label}</span>
                                {count > 0 && <span className={styles.badge}>{count}</span>}
                            </button>
                        );
                    })
                )}
            </div>
        </Safeguard>
    );
});

export default AdminTabs;
