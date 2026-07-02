import React from 'react';
import SmartImage from '../ui/SmartImage';
import styles from './VersusCard.module.css';

/**
 * 🚀 Elite Versus Card Component
 * Compact and modern visualization for the AI Studio initial message.
 */
export default function VersusCard({ tool1, tool2 }) {
    return (
        <div className={styles.versusCard}>
            <div className={styles.toolSide}>
                {tool1?.image_url ? (
                    <div className={styles.toolImageWrapper}>
                        <SmartImage src={tool1.image_url} alt={tool1.name} width={32} height={32} className={styles.toolIcon} />
                    </div>
                ) : (
                    <div className={styles.toolIconFallback}>{tool1?.name?.charAt(0)}</div>
                )}
                <span className={styles.toolName}>{tool1?.name}</span>
            </div>
            <div className={styles.vsBadge}>VS</div>
            <div className={styles.toolSide}>
                {tool2?.image_url ? (
                    <div className={styles.toolImageWrapper}>
                        <SmartImage src={tool2.image_url} alt={tool2.name} width={32} height={32} className={styles.toolIcon} />
                    </div>
                ) : (
                    <div className={styles.toolIconFallback}>{tool2?.name?.charAt(0)}</div>
                )}
                <span className={styles.toolName}>{tool2?.name}</span>
            </div>
        </div>
    );
}
