'use client';
import React, { useState } from 'react';
import DocsSidebar from '../../components/Docs/DocsSidebar';
import { Menu } from 'lucide-react';
import styles from './docsLayout.module.css';

export default function DocsLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={styles.docsContainer}>
            {/* Mobile Header for Sidebar Toggle */}
            <div className={styles.mobileHeader}>
                <button className={styles.menuBtn} onClick={() => setIsSidebarOpen(true)}>
                    <Menu size={24} />
                </button>
                <span className={styles.mobileTitle}>Documentation</span>
            </div>

            <div className={styles.layout}>
                <DocsSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <main className={styles.mainContent}>
                    <div className={styles.contentWrapper}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
