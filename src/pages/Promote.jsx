import React, { memo } from 'react';
import { Rocket } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import { usePromoteData } from '../hooks/usePromoteData';

// Import Global UI Components
import PageHero from '../components/ui/PageHero';
import Safeguard from '../components/ui/Safeguard';

// Import Modular Components
import ToolSelector from '../components/Promote/ToolSelector';
import PromotionPlans from '../components/Promote/PromotionPlans';
import PromoteTrustFooter from '../components/Promote/PromoteTrustFooter';

// Import Constants & Styles
import { PROMOTE_UI_CONSTANTS } from '../constants/promoteConstants';
import styles from './Promote.module.css';

/**
 * Promote Page - Elite 10/10 Standard
 * Rule #16: Pure Orchestration Pattern
 * Rule #31: Component Resilience via Safeguard
 */
const Promote = () => {
    const {
        PLANS,
        toolName,
        userTools,
        selectedToolId,
        setSelectedToolId,
        loadingPlan,
        loadingTools,
        handlePromote,
        activePlan,
        checkingPlan,
        error,
        refresh
    } = usePromoteData();

    const { hero } = PROMOTE_UI_CONSTANTS;

    // 2. Elite Service-Oriented SEO Hardening (v3.0)
    useSEO({ 
        pageKey: 'promote',
        entityId: 'promote',
        entityType: 'page',
        title: 'Promote Your AI Tool | Boost Visibility & Reach More Users | HUBly',
        description: 'Maximize your AI tool reach. Promote your software on HUBly to get featured listings, increased traffic, and targeted visibility within the AI community.',
        ogType: 'website',
        schema: {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Elite AI Tool Promotion Service",
            "provider": {
                "@type": "Organization",
                "name": "HUBly"
            },
            "areaServed": "Worldwide",
            "serviceType": "Digital Growth & Visibility Promotion"
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
                icon={<Rocket size={24} />}
            />

            <div className={styles.container}>
                    <main className={styles.mainContent}>
                        <section className={styles.selectionArea}>
                            <ToolSelector 
                                toolName={toolName}
                                loadingTools={loadingTools}
                                userTools={userTools}
                                selectedToolId={selectedToolId}
                                setSelectedToolId={setSelectedToolId}
                                isLoading={loadingTools}
                                content={PROMOTE_UI_CONSTANTS.selector}
                                error={error}
                                onRetry={refresh}
                            />
                        </section>

                        <section className={styles.plansArea}>
                            <PromotionPlans 
                                plans={PLANS}
                                handlePromote={handlePromote}
                                loadingPlan={loadingPlan}
                                selectedToolId={selectedToolId}
                                activePlan={activePlan}
                                checkingPlan={checkingPlan}
                                isLoading={loadingTools}
                                content={PROMOTE_UI_CONSTANTS.plans}
                                error={error}
                                onRetry={refresh}
                            />
                        </section>

                        <PromoteTrustFooter 
                            isLoading={loadingTools} 
                            content={PROMOTE_UI_CONSTANTS.trust}
                            error={error}
                            onRetry={refresh}
                        />
                    </main>
            </div>
        </div>
    );
};

export default memo(Promote);
