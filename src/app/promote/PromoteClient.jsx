'use client';
import React from 'react';
import Link from 'next/link';
import { Rocket, Info, ArrowRight } from 'lucide-react';
import { usePromoteData } from '@/hooks/usePromoteData';

// Import Global UI Components
import PageHero from '@/components/ui/PageHero';
import Safeguard from '@/components/ui/Safeguard';

// Import Modular Components
import ToolSelector from '@/components/Promote/ToolSelector';
import PromotionPlans from '@/components/Promote/PromotionPlans';
import PromoteTrustFooter from '@/components/Promote/PromoteTrustFooter';

// Import Constants & Styles
import { PROMOTE_UI_CONSTANTS } from '@/constants/promoteConstants';
import styles from './page.module.css';

export default function PromoteClient() {
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
}
