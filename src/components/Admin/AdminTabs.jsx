'use client';
import React, { memo } from 'react';
import { ADMIN_UI_CONSTANTS } from '../../constants/adminConstants';
import { Clock, Users, FileText, Star, PlusCircle, FolderTree, Tags, Mail, LayoutGrid, Bot, Sparkles, TestTube, ChevronLeft, ChevronRight } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './AdminTabs.module.css';

/**
 * AdminTabs - Elite Tab Navigator (Next.js Port)
 */
const AdminTabs = memo(({ activeTab, setActiveTab, pendingCount, blogCount, userCount, newsCount, isLoading, error, onRetry }) => {
    const labels = ADMIN_UI_CONSTANTS.tabs;

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
        newsletter: Mail,
        'newsletter-manager': Sparkles,
        lab: TestTube
    };

    const countMap = {
        pending: pendingCount,
        blog: blogCount,
        users: userCount,
        newsletter: newsCount
    };

    const scrollRef = React.useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.5;
            scrollRef.current.scrollTo({
                left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.container}>
                {!isLoading && (
                    <>
                        <button className={`${styles.scrollBtn} ${styles.left}`} onClick={() => scroll('left')}>
                            <ChevronLeft size={20} />
                        </button>
                        <button className={`${styles.scrollBtn} ${styles.right}`} onClick={() => scroll('right')}>
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}
                
                <div className={styles.tabsWrapper} ref={scrollRef}>
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
            </div>
        </Safeguard>
    );
});

export default AdminTabs;
