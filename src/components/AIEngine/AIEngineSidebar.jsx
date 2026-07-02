import React from 'react';
import Image from 'next/image';
import { Search, History, MessageSquare, Edit2, Trash2, Plus, ChevronLeft, Settings, Layout, X, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import { AI_ENGINE_CONSTANTS } from '../../constants/aiEngineConstants';
import styles from './AIEngineSidebar.module.css';

export default function AIEngineSidebar({
    user,
    router,
    sessions,
    sessionsLoading,
    searchQuery,
    setSearchQuery,
    activeSessionId,
    setActiveSessionId,
    setActionModal,
    setEditingTitle,
    handleSessionClick,
    onNewChatClick,
    isOpen,
    setIsOpen,
    workspaceProps
}) {
    const filteredSessions = sessions.filter(session => {
        if (!searchQuery) return true;
        const label = session.title || (session.tool1 && session.tool2 ? `${session.tool1.name} vs ${session.tool2.name}` : 'AI Session');
        return label.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diff = now - d;
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
            <div className={styles.sidebarHeaderRow}>
                <div className={styles.sidebarHeader}>
                    <Image src="/logo.png" alt={AI_ENGINE_CONSTANTS.sidebar.brandWatermark} width={24} height={24} className={styles.sparkleIcon} />
                    <h2>{AI_ENGINE_CONSTANTS.sidebar.title}</h2>
                </div>
                <div className={styles.headerActions}>
                    <Button 
                        variant="ghost" 
                        icon={ChevronLeft} 
                        onClick={() => router.push('/')} 
                        className={styles.backButton} 
                        title="Back to Platform" 
                    />
                    <Button 
                        variant="ghost" 
                        icon={X} 
                        onClick={() => setIsOpen && setIsOpen(false)} 
                        className={styles.backButton} 
                        title="Close Sidebar" 
                    />
                </div>
            </div>

            <Button
                className={styles.newSessionBtn}
                icon={Plus}
                onClick={onNewChatClick}
            >
                {AI_ENGINE_CONSTANTS.sidebar.newChat}
            </Button>

            {(() => {
                const isWorkflow = typeof window !== 'undefined' && window.location.pathname.includes('/workflow');
                return (
                    <div className={styles.modeToggleContainer}>
                        <button
                            className={`${styles.modeToggleBtn} ${!isWorkflow ? styles.modeToggleBtnActive : ''}`}
                            onClick={() => !isWorkflow ? null : router.push('/ai-engine')}
                        >
                            <MessageSquare size={14} className={styles.modeToggleIcon} />
                            <span>Chat</span>
                        </button>
                        <button
                            className={`${styles.modeToggleBtn} ${isWorkflow ? styles.modeToggleBtnActiveWorkflow : ''}`}
                            onClick={() => isWorkflow ? null : router.push('/ai-engine/workflow')}
                        >
                            <Sparkles size={14} className={styles.modeToggleIcon} />
                            <span>Workflow</span>
                        </button>
                    </div>
                );
            })()}

            <div className={styles.historySection}>
                <h3><History size={14} /> {AI_ENGINE_CONSTANTS.sidebar.recentSessions}</h3>

                {user && !sessionsLoading && sessions.length > 0 && (
                    <div className={styles.searchContainer}>
                        <Search size={14} className={styles.searchIcon} />
                        <input 
                            type="text" 
                            placeholder={AI_ENGINE_CONSTANTS.sidebar.searchPlaceholder} 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                )}

                {!user ? (
                    <div className={styles.emptyHistory}>
                        <p>{AI_ENGINE_CONSTANTS.sidebar.signInPrompt}</p>
                    </div>
                ) : sessionsLoading ? (
                    <div className={styles.sessionsLoadingList}>
                        <Skeleton height="64px" width="100%" borderRadius="12px" className={styles.skeletonItem} />
                        <Skeleton height="64px" width="100%" borderRadius="12px" className={styles.skeletonItem} />
                        <Skeleton height="64px" width="100%" borderRadius="12px" />
                    </div>
                ) : filteredSessions.length === 0 ? (
                    <div className={styles.emptyHistory}>
                        {searchQuery ? (
                            <p>{AI_ENGINE_CONSTANTS.sidebar.noSessionsSearch} "{searchQuery}"</p>
                        ) : (
                            <>
                                <MessageSquare size={28} className={styles.emptyHistoryIcon} />
                                <p>{AI_ENGINE_CONSTANTS.sidebar.noSessionsDefault}</p>
                            </>
                        )}
                    </div>
                ) : (
                    <ul className={styles.sessionsList}>
                        {filteredSessions.map((session) => {
                            const isComparison = session.tool1 && session.tool2;
                            const sessionLabel = session.title
                                || (isComparison ? `${session.tool1.name} vs ${session.tool2.name}` : 'AI Session');
                            const icon1 = session.tool1?.image_url;
                            const icon2 = session.tool2?.image_url;
                            return (
                                <li
                                    key={session.id}
                                    className={`${styles.sessionItem} ${activeSessionId === session.id ? styles.sessionItemActive : ''}`}
                                    onClick={() => handleSessionClick(session)}
                                >
                                    <div className={styles.sessionContent}>
                                        <div className={styles.sessionToolIcons}>
                                            {isComparison ? (
                                                <>
                                                    {icon1 ? (
                                                        <Image src={icon1} alt={session.tool1.name} width={20} height={20} className={styles.sessionToolImg} />
                                                    ) : (
                                                        <span className={styles.sessionToolFallback}>{session.tool1.name?.[0] || 'A'}</span>
                                                    )}
                                                    <span className={styles.sessionVs}>vs</span>
                                                    {icon2 ? (
                                                        <Image src={icon2} alt={session.tool2.name} width={20} height={20} className={styles.sessionToolImg} />
                                                    ) : (
                                                        <span className={styles.sessionToolFallback}>{session.tool2.name?.[0] || 'B'}</span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className={`${styles.sessionToolFallback} ${styles.sessionToolFallbackLarge}`}>✦</span>
                                            )}
                                        </div>
                                        
                                        <div className={styles.sessionInfo}>
                                            <span className={styles.sessionTitle}>{sessionLabel}</span>
                                            <span className={styles.sessionDate}>{formatDate(session.created_at)}</span>
                                        </div>

                                        <div className={styles.sessionActions}>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingTitle(sessionLabel);
                                                    setActionModal({ type: 'rename', session });
                                                }}
                                                className={styles.actionBtn}
                                            ><Edit2 size={14}/></button>
                                            {activeSessionId !== session.id && (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActionModal({ type: 'delete', session });
                                                    }}
                                                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                ><Trash2 size={14}/></button>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
            
            {/* ── Settings Section ── */}
            <div className={styles.sidebarFooter}>
                <button className={styles.footerBtn} onClick={() => workspaceProps?.setIsWorkspaceModalOpen(true)}>
                    <Layout size={16} />
                    Workspace Settings
                </button>
                <button className={styles.footerBtn} onClick={() => setActionModal({ type: 'settings' })}>
                    <Settings size={16} />
                    AI Configuration
                </button>
            </div>

            {/* ── Brand Watermark ── */}
            <div className={styles.brandWatermark}>
                <div className={styles.brandTextContainer}>
                    <Image src="/logo.png" alt="HUBly" width={14} height={14} className={styles.brandMiniLogo} />
                    <span>{AI_ENGINE_CONSTANTS.sidebar.brandWatermark}</span>
                </div>
                {user?.is_premium && (
                    <div className={styles.premiumWatermark}>
                        <Sparkles size={11} className={styles.premiumIcon} />
                        <span>Premium: Unlimited Messages</span>
                    </div>
                )}
            </div>
        </aside>
    );
}
