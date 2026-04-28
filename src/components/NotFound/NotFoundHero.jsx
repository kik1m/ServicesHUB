import React from 'react';
import { Ghost } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import { NOT_FOUND_UI_CONSTANTS } from '../../constants/notFoundConstants';
import styles from './NotFoundHero.module.css';

const NotFoundHero = ({ isLoading, error, onRetry }) => {
    const { hero } = NOT_FOUND_UI_CONSTANTS;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            {isLoading ? (
                <div className={styles.hero}>
                    <div className={styles.iconBox}>
                        <Skeleton className={styles.skeletonIcon} />
                    </div>
                    <Skeleton className={styles.skeletonCode} />
                    <Skeleton className={styles.skeletonTitle} />
                    <div className={styles.skeletonBody}>
                        <Skeleton className={styles.skeletonLine} />
                        <Skeleton className={styles.skeletonLineSmall} />
                    </div>
                </div>
            ) : (
                <div className={styles.hero}>
                    <div className={styles.iconBox}>
                        <Ghost size={40} color="white" />
                    </div>
                    
                    <h1 className={styles.title404}>{hero?.code}</h1>
                    <h2 className={styles.title}>{hero?.title}</h2>
                    <p className={styles.subtitle}>
                        {hero?.subtitle}
                    </p>
                </div>
            )}
        </Safeguard>
    );
};

export default NotFoundHero;




