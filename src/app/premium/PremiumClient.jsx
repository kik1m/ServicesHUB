'use client';
import React from 'react';
import { Zap } from 'lucide-react';
import { usePremiumData } from '@/hooks/usePremiumData';

// Import Global UI Components
import PageHero from '@/components/ui/PageHero';
import Safeguard from '@/components/ui/Safeguard';

// Import Modular Components
import PremiumPricingCard from '@/components/Premium/PremiumPricingCard';
import PremiumFAQ from '@/components/Premium/PremiumFAQ';
import PromoteTrustFooter from '@/components/Promote/PromoteTrustFooter';

// Import Constants & Styles
import { PREMIUM_UI_CONSTANTS } from '@/constants/premiumConstants';
import styles from './page.module.css';

export default function PremiumClient() {
    const { hero, trust } = PREMIUM_UI_CONSTANTS;
    const { user, loading, handleUpgrade, error } = usePremiumData();

    return (
        <div className={styles.viewWrapper}>
            <PageHero 
                title={hero.title}
                highlight={hero.highlight}
                subtitle={hero.subtitle}
                breadcrumbs={hero.breadcrumbs}
                badge={hero.badge}
                icon={<Zap size={24} />}
                isLoading={loading}
            />

            <div className={styles.container}>
                <section className={styles.pricingSection}>
                    <PremiumPricingCard 
                        user={user}
                        loading={loading}
                        onUpgrade={handleUpgrade}
                        error={error}
                    />
                </section>

                <PromoteTrustFooter 
                    isLoading={loading}
                    content={trust}
                />

                <PremiumFAQ />
            </div>
        </div>
    );
}
