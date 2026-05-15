import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './SuccessHero.module.css';

const SuccessHero = ({ type, isLoading, error, onRetry }) => {
    if (isLoading) {
        return (
            <div className={styles.successPulseIcon}>
                <Skeleton className={styles.skeletonCircle} />
            </div>
        );
    }

    const Icon = type === 'account_premium' ? Sparkles : CheckCircle2;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.successPulseIcon}>
                <Icon size={60} />
            </div>
        </Safeguard>
    );
};

export default SuccessHero;




