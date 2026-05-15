'use client';
import React from 'react';
import { useSuccessData } from '@/hooks/useSuccessData';

// Import Modular Components
import SuccessHero from '@/components/Success/SuccessHero';
import SuccessMessage from '@/components/Success/SuccessMessage';
import SuccessActions from '@/components/Success/SuccessActions';

// Import Modular CSS
import styles from './page.module.css';

export default function SuccessClient() {
    const { loading, type, toolName } = useSuccessData();

    return (
        <main className={styles.successPage} aria-live="polite">
            <div className={styles.contentWrapper}>
                <SuccessHero 
                    type={type} 
                    toolName={toolName}
                    isLoading={loading}
                />
                <SuccessMessage type={type} toolName={toolName} isLoading={loading} />
                <SuccessActions type={type} isLoading={loading} />
            </div>
        </main>
    );
}
