import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import Skeleton from './ui/Skeleton';
import styles from './Breadcrumbs.module.css';

const Breadcrumbs = ({ items, isLoading }) => {
    // Rule #32: Defensive Filtering
    const safeItems = React.useMemo(() => 
        (items?.filter(Boolean) ?? []), 
        [items]
    );

    if (isLoading) {
        return (
            <div className={styles.wrapper}>
                <div className={styles.skeletonWrapper}>
                    <Skeleton width="150px" height="14px" borderRadius="100px" />
                </div>
            </div>
        );
    }

    // Rule #36: Component Resilience
    if (safeItems.length === 0) return null;

    return (
        <div className={styles.wrapper}>
            <nav className={styles.nav}>
                <Link to="/" className={styles.homeLink}>
                    <Home size={14} />
                </Link>
                
                {safeItems.map((item) => (
                    <React.Fragment key={item.path || item.label}>
                        <ChevronRight size={14} className={styles.separator} />
                        {item.path ? (
                            <Link to={item.path} className={styles.link}>
                                {item.label}
                            </Link>
                        ) : (
                            <span className={styles.current}>{item.label}</span>
                        )}
                    </React.Fragment>
                ))}
            </nav>
        </div>
    );
};

export default Breadcrumbs;


