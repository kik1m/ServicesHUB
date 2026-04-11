import React from 'react';
import SkeletonLoader from '../components/SkeletonLoader';
import { useSuccessData } from '../hooks/useSuccessData';

// Import Modular Components
import SuccessHero from '../components/Success/SuccessHero';
import SuccessMessage from '../components/Success/SuccessMessage';
import SuccessActions from '../components/Success/SuccessActions';

// Import Modular CSS
import styles from './Success.module.css';

const Success = () => {
    const { loading, type, toolName } = useSuccessData();

    if (loading) {
        return (
            <div className={`page-wrapper ${styles.successViewWrapper}`}>
                <div className={`glass-card ${styles.successGlassCard}`}>
                    <SkeletonLoader height="300px" borderRadius="16px" />
                </div>
            </div>
        );
    }

    return (
        <div className={`page-wrapper ${styles.successViewWrapper}`}>
            <div className={`glass-card ${styles.successGlassCard}`}>
                
                <SuccessHero type={type} />
                
                <SuccessMessage 
                    type={type} 
                    toolName={toolName} 
                />

                <SuccessActions />
                
            </div>
        </div>
    );
};

export default Success;
