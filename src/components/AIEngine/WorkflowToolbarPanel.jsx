'use client';
import React from 'react';
import { Plus, Layers, MessageSquare, History, Sparkles } from 'lucide-react';
import styles from './WorkflowToolbarPanel.module.css';

/**
 * WorkflowToolbarPanel
 * The 60px left vertical icon toolbar for the workflow page.
 */
export default function WorkflowToolbarPanel({
    activeView,
    setActiveView,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isChatCollapsed,
    setIsChatCollapsed,
    isLoading,
    onAddPhase,
}) {
    return (
        <div className={styles.container}>
            {/* Logo mark */}
            <div className={styles.logo}>H</div>

            <div className={styles.spacer} />

            {/* Guide view */}
            <button
                onClick={() => setActiveView('presenter')}
                className={`${styles.btn} ${activeView === 'presenter' ? styles.btnActive : ''}`}
                title="Interactive Walkthrough"
            >
                <Sparkles size={18} />
            </button>



            {/* Add phase */}
            <button
                onClick={onAddPhase}
                className={styles.btn}
                title="Add New Phase"
            >
                <Plus size={18} />
            </button>

            {/* Bottom: sessions history + chat toggle */}
            <div className={styles.bottomGroup}>
                <button
                    onClick={() => setIsSidebarCollapsed(prev => !prev)}
                    className={`${styles.btn} ${!isSidebarCollapsed ? styles.btnActiveSidebar : ''}`}
                    title="Session History"
                >
                    <History size={18} />
                </button>

                <button
                    onClick={() => setIsChatCollapsed(prev => !prev)}
                    className={`${styles.btn} ${!isChatCollapsed ? styles.btnActive : ''}`}
                    title="AI Assistant Chat"
                >
                    <MessageSquare size={18} />
                    {isLoading && (
                        <span className={styles.ping} />
                    )}
                </button>
            </div>
        </div>
    );
}
