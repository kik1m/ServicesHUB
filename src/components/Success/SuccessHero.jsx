import React from 'react';
import { Sparkles, Rocket } from 'lucide-react';
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

    const Icon = type === 'account_premium' ? Sparkles : Rocket;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.successPulseIcon}>
                <Icon size={100} />
            </div>
        </Safeguard>
    );
};

export default SuccessHero;




