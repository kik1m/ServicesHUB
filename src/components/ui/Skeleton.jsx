import React from 'react';
import styles from './Skeleton.module.css';

/**
 * Highly modular Skeleton atom
 * Supports built-in types (card, stat, blog, etc.) for backwards compatibility
 * or custom sizing for atomic design.
 */
const Skeleton = ({ 
    type = 'text', 
    width, 
    height, 
    borderRadius, 
    style, 
    className = '' 
}) => {
    // Shared base styles for atomic usage
    // We only apply default text/title dimensions if NO width/height AND NO className are provided.
    // This allows CSS Modules to take full control when a className is used.
    const baseStyle = {
        width: width || (type === 'title' ? '60%' : (type === 'text' && !className) ? '100%' : undefined),
        height: height || (type === 'title' ? '2.5rem' : (type === 'text' && !className) ? '1.2rem' : undefined),
        borderRadius: borderRadius || (type === 'avatar' ? '30px' : type === 'image' ? '16px' : undefined),
        ...style
    };

    // Compound Card Skeleton
    if (type === 'card') {
        return (
            <div className={`${styles.skeletonCard} ${className}`}>
                <div className={styles.cardHead}>
                    <Skeleton width="60px" height="60px" borderRadius="16px" />
                    <div className={styles.flexCol}>
                        <Skeleton width="70%" height="20px" className={styles.mb8} />
                        <Skeleton width="40%" height="14px" />
                    </div>
                </div>
                <div className={styles.cardBody}>
                    <Skeleton width="100%" height="40px" className={styles.mb15} style={{ opacity: 0.6 }} />
                </div>
                <div className={styles.cardFooter}>
                    <Skeleton width="60px" height="14px" />
                    <Skeleton width="100px" height="14px" />
                </div>
            </div>
        );
    }

    // Stat Item Skeleton
    if (type === 'stat') {
        return (
            <div className={`${styles.statItem} ${className}`}>
                <Skeleton width="50px" height="50px" borderRadius="15px" />
                <div className={styles.flexCol}>
                    <Skeleton width="40%" height="12px" className={styles.mb8} />
                    <Skeleton width="60%" height="24px" />
                </div>
            </div>
        );
    }

    // Category Item Skeleton
    if (type === 'category') {
        return (
            <div className={`${styles.categoryItem} ${className}`}>
                <Skeleton width="40px" height="40px" borderRadius="50%" className={styles.shrink0} />
                <div className={styles.flexCol}>
                    <Skeleton width="60%" height="14px" className={styles.mb8} />
                    <Skeleton width="30%" height="10px" />
                </div>
            </div>
        );
    }

    // Trending Item Skeleton
    if (type === 'trending') {
        return (
            <div className={`${styles.trendingItem} ${className}`}>
                <Skeleton width="56px" height="56px" borderRadius="14px" className={styles.shrink0} />
                <div className={styles.flexCol}>
                    <Skeleton width="50%" height="16px" className={styles.mb8} />
                    <Skeleton width="30%" height="12px" />
                </div>
                <Skeleton width="24px" height="24px" borderRadius="50%" />
            </div>
        );
    }

    // Blog Card Skeleton
    if (type === 'blog') {
        return (
            <div className={`${styles.blogCard} ${className}`}>
                <Skeleton width="100%" height="200px" borderRadius="0" />
                <div className={styles.blogContent}>
                    <div className={styles.blogMeta}>
                        <Skeleton width="80px" height="14px" />
                        <Skeleton width="80px" height="14px" />
                    </div>
                    <Skeleton width="90%" height="24px" className={styles.mb20} />
                    <Skeleton width="100px" height="14px" />
                </div>
            </div>
        );
    }

    return (
        <div 
            className={`${styles.skeleton} ${className}`} 
            style={baseStyle}
        />
    );
};

export default Skeleton;




