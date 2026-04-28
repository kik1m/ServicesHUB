import React from 'react';
import { Sparkles, Rocket } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import styles from './SuccessHero.module.css';

const SuccessHero = ({ type, isLoading }) => {
    if (isLoading) {
        return (
            <div className={styles.successPulseIcon}>
                <Skeleton className={styles.skeletonCircle} />
            </div>
        );
    }

    const Icon = type === 'account_premium' ? Sparkles : Rocket;

    return (
        <div className={styles.successPulseIcon}>
            <Icon size={100} />
        </div>
    );
};

export default SuccessHero;




