import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import PromoteHero from '../components/Promote/PromoteHero';
import ToolSelector from '../components/Promote/ToolSelector';
import PromotionPlans from '../components/Promote/PromotionPlans';
import PromoteTrustFooter from '../components/Promote/PromoteTrustFooter';
import { usePromoteData } from '../hooks/usePromoteData';
import styles from './Promote.module.css';

const Promote = () => {
    const {
        PLANS,
        toolName,
        userTools,
        selectedToolId,
        setSelectedToolId,
        loadingPlan,
        loadingTools,
        handlePromote
    } = usePromoteData();

    return (
        <div className={`${styles.promoteViewContainer} container`}>
            <div className={styles.promoteContent}>
                
                <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Promote Tool' }]} />

                <PromoteHero />

                <ToolSelector 
                    toolName={toolName}
                    loadingTools={loadingTools}
                    userTools={userTools}
                    selectedToolId={selectedToolId}
                    setSelectedToolId={setSelectedToolId}
                />

                <PromotionPlans 
                    plans={PLANS}
                    handlePromote={handlePromote}
                    loadingPlan={loadingPlan}
                    selectedToolId={selectedToolId}
                />

                <PromoteTrustFooter />

            </div>
        </div>
    );
};

export default Promote;
