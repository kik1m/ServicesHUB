import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import PremiumHero from '../components/Premium/PremiumHero';
import PremiumPricingCard from '../components/Premium/PremiumPricingCard';
import PremiumFAQ from '../components/Premium/PremiumFAQ';
import { usePremiumData } from '../hooks/usePremiumData';
import styles from './Premium.module.css';

const Premium = () => {
    const { user, loading, handleUpgrade } = usePremiumData();

    return (
        <div className={`${styles.premiumViewWrapper} container`}>
            <div className={styles.premiumContent}>
                
                <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Premium' }]} />

                <PremiumHero />

                <PremiumPricingCard 
                    user={user}
                    loading={loading}
                    onUpgrade={handleUpgrade}
                />

                <PremiumFAQ />

            </div>
        </div>
    );
};

export default Premium;
