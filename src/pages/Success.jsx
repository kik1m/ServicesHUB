import React from 'react';
import useSEO from '../hooks/useSEO';
import Skeleton from '../components/ui/Skeleton';
import { useSuccessData } from '../hooks/useSuccessData';

// Import Modular Components
import SuccessHero from '../components/Success/SuccessHero';
import SuccessMessage from '../components/Success/SuccessMessage';
import SuccessActions from '../components/Success/SuccessActions';

// Import Modular CSS
import styles from './Success.module.css';

/**
 * Success Page - Transaction Confirmation
 * Rule #34/41: Unified SEO Hardening
 */
const Success = () => {
    const { loading, type, toolName } = useSuccessData();

    // 1. SEO Hardening (v2.0)
    useSEO({ pageKey: 'success' });

    return (
        <div className={`page-wrapper ${styles.successViewWrapper} fade-in`}>
            <div className={`glass-card ${styles.successGlassCard}`}>
                
                <SuccessHero type={type} isLoading={loading} />
                
                <SuccessMessage 
                    type={type} 
                    toolName={toolName} 
                    isLoading={loading}
                />

                <SuccessActions isLoading={loading} />
                
            </div>
        </div>
    );
};

export default Success;
