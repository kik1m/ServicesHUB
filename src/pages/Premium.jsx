import React from 'react';
import { Zap } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import { usePremiumData } from '../hooks/usePremiumData';

// Import Global UI Components
import PageHero from '../components/ui/PageHero';
import Safeguard from '../components/ui/Safeguard';

// Import Modular Components
import PremiumPricingCard from '../components/Premium/PremiumPricingCard';
import PremiumFAQ from '../components/Premium/PremiumFAQ';
import PromoteTrustFooter from '../components/Promote/PromoteTrustFooter';

// Import Constants & Styles
import { PREMIUM_UI_CONSTANTS } from '../constants/premiumConstants';
import styles from './Premium.module.css';

/**
 * Premium Page - Elite 10/10 Standard
 * Rule #16: Pure Orchestration Pattern
 * Rule #31: Component Resilience via Safeguard
 */
const Premium = () => {
    const { hero, trust } = PREMIUM_UI_CONSTANTS;
    const { user, loading, handleUpgrade, error } = usePremiumData();

    // 1. Elite Commercial SEO Hardening (v3.0)
    useSEO({ 
        pageKey: 'premium',
        entityId: 'premium',
        entityType: 'page',
        title: 'Upgrade to HUBly Premium | Unlock Advanced AI Features & Growth',
        description: 'Take your AI discovery to the next level. Upgrade to HUBly Premium for boosted visibility, expert analytics, priority listing, and exclusive tool insights.',
        ogType: 'website',
        schema: {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "HUBly Premium Membership",
            "description": "Professional subscription plan for advanced AI tool discovery and platform growth features.",
            "brand": {
                "@type": "Brand",
                "name": "HUBly"
            },
            "offers": {
                "@type": "Offer",
                "price": "9.99",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
            }
        }
    });

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
                            error={error} // Passed error explicitly
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
};

export default Premium;
