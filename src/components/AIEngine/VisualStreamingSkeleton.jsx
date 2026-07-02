'use client';
import React from 'react';
import Skeleton from '../ui/Skeleton';
import { useVisualStreamingSkeleton } from '../../hooks/useVisualStreamingSkeleton';
import styles from './VisualStreamingSkeleton.module.css';

const MESSAGES = [
    'Architecting component...',
    'Applying design system...',
    'Rendering visual layout...',
];

export default function VisualStreamingSkeleton({ absolute = false }) {
    const msgIdx = useVisualStreamingSkeleton(MESSAGES.length);

    return (
        <div className={`${styles.container} ${absolute ? styles.absolute : styles.relative}`}>
            {/* Top scanning animation line */}
            <div className={styles.scanLine} />

            {/* Glowing Loading Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.pulseDot} />
                    <span className={styles.statusText}>
                        {MESSAGES[msgIdx]}
                    </span>
                </div>
                <span className={styles.logoText}>
                    HUBly AI
                </span>
            </div>

            {/* Organized Skeleton Layout (Mocking a real dashboard/card component) */}
            <div className={styles.content}>
                {/* Upper row: Avatar/Icon + text lines */}
                <div className={styles.rowTop}>
                    <Skeleton width="40px" height="40px" borderRadius="10px" />
                    <div className={styles.textLines}>
                        <Skeleton width="60%" height="12px" borderRadius="4px" />
                        <Skeleton width="35%" height="8px" borderRadius="3px" className={styles.op60} />
                    </div>
                </div>
                
                {/* Middle row: Content shimmers */}
                <div className={styles.rowMiddle}>
                    <Skeleton width="100%" height="10px" borderRadius="4px" className={styles.op80} />
                    <Skeleton width="85%" height="10px" borderRadius="4px" className={styles.op50} />
                </div>
            </div>

            {/* Bottom Row: Controls / Action mockup */}
            <div className={styles.rowBottom}>
                <Skeleton width="80px" height="24px" borderRadius="6px" className={styles.op40} />
                <Skeleton width="60px" height="24px" borderRadius="6px" className={styles.op70} />
            </div>
        </div>
    );
}

