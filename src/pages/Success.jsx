import React from 'react';
import useSEO from '../hooks/useSEO';
import { useSuccessData } from '../hooks/useSuccessData';

// Import Modular Components
import SuccessHero from '../components/Success/SuccessHero';
import SuccessMessage from '../components/Success/SuccessMessage';
import SuccessActions from '../components/Success/SuccessActions';

// Import Modular CSS
import styles from './Success.module.css';

/**
 * Success Page - Transaction Confirmation
 * Rule #34/41: Unified SEO Hardening (Nuclear NoIndex)
 */
const Success = () => {
    const { loading, type, toolName } = useSuccessData();

    // 1. Elite Transactional Security (v3.0)
    // Rule #34: Success pages must never be indexed or cached
    useSEO({ 
        title: 'Success | HUBly',
        description: 'Operation completed successfully.',
        noindex: true, // Critical: Prevent tracking/analytics pollution
        robots: "noindex, nofollow, noarchive",
        ogType: 'website',
        schema: null 
    });

    return (
        <main className={styles.successPage} aria-live="polite">
            <SuccessHero 
                type={type} 
                toolName={toolName}
                isLoading={loading}
            />
            
            <div className={styles.contentWrapper}>
                <SuccessMessage type={type} isLoading={loading} />
                <SuccessActions type={type} isLoading={loading} />
            </div>
        </main>
    );
};

export default Success;
