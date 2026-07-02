'use client';
import React from 'react';
import Skeleton from '../ui/Skeleton';
import styles from './ChatLoadingSkeleton.module.css';

/**
 * ChatLoadingSkeleton
 * Placeholder displayed while historical messages are loading.
 * Extracted from AIEngineClient.jsx for cleanliness.
 */
export default function ChatLoadingSkeleton() {
    return (
        <div className={styles.container}>
            {/* AI message row */}
            <div className={styles.row}>
                <Skeleton width="32px" height="32px" borderRadius="50%" className={styles.avatar} />
                <div className={styles.messageContent}>
                    <Skeleton width="75%" height="18px" borderRadius="8px" />
                    <Skeleton width="55%" height="18px" borderRadius="8px" />
                    <Skeleton width="40%" height="18px" borderRadius="8px" />
                </div>
            </div>
            {/* User message row */}
            <div className={styles.rowUser}>
                <Skeleton width="32px" height="32px" borderRadius="50%" className={styles.avatar} />
                <div className={styles.messageContentUser}>
                    <Skeleton width="200px" height="18px" borderRadius="8px" />
                    <Skeleton width="140px" height="18px" borderRadius="8px" />
                </div>
            </div>
            {/* AI message row 2 */}
            <div className={styles.row}>
                <Skeleton width="32px" height="32px" borderRadius="50%" className={styles.avatar} />
                <div className={styles.messageContent}>
                    <Skeleton width="90%" height="18px" borderRadius="8px" />
                    <Skeleton width="70%" height="18px" borderRadius="8px" />
                    <Skeleton width="60%" height="18px" borderRadius="8px" />
                </div>
            </div>
        </div>
    );
}
