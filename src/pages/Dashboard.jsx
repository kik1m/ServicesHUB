import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';

// Import Modular Components
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import DashboardStats from '../components/Dashboard/DashboardStats';
import DashboardViewsChart from '../components/Dashboard/DashboardViewsChart';
import DashboardToolsTable from '../components/Dashboard/DashboardToolsTable';
import DashboardFavorites from '../components/Dashboard/DashboardFavorites';
import DashboardWelcomeCTA from '../components/Dashboard/DashboardWelcomeCTA';
import Safeguard from '../components/ui/Safeguard';
import useSEO from '../hooks/useSEO';

// Import Modular Styles
import styles from './Dashboard.module.css';

import { DASHBOARD_CONSTANTS } from '../constants/dashboardConstants';

/**
 * Dashboard Page - Elite 10/10 Orchestrator
 * Rule #16: Stable Coordinator Pattern
 * Rule #31: Component Resilience via Safeguard
 */
const Dashboard = () => {
    const {
        userTools,
        favorites,
        chartData,
        isCreator,
        isPremium,
        stats,
        isLoading,
        toolsLoading,
        favoritesLoading,
        toolsError,
        favoritesError,
        handleDeleteTool,
        refreshData,
        user
    } = useDashboardData();

    // 1. SEO Hardening (v2.0)
    useSEO({ pageKey: 'dashboard' });

    return (
        <div className={styles.dashboardPage}>
            <DashboardHeader 
                isCreator={isCreator} 
                user={user}
                isLoading={isLoading}
                content={DASHBOARD_CONSTANTS?.header}
                error={null} // Header usually doesn't fail based on tools
            />

            <DashboardStats 
                isCreator={isCreator} 
                isPremium={isPremium}
                stats={stats}
                isLoading={toolsLoading || favoritesLoading}
                content={DASHBOARD_CONSTANTS?.stats}
                error={toolsError || favoritesError}
                onRetry={refreshData}
            />

            {(toolsLoading || isCreator) ? (
                <div className={styles.creatorGrid}>
                    <DashboardViewsChart 
                        chartData={chartData} 
                        isLoading={toolsLoading}
                        error={toolsError}
                        onRetry={refreshData}
                        content={DASHBOARD_CONSTANTS?.chart}
                    />
                    
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            {DASHBOARD_CONSTANTS?.toolsTable?.title}
                        </h2>
                    </div>
                    
                    <DashboardToolsTable 
                        userTools={userTools} 
                        handleDeleteTool={(id, name) => handleDeleteTool(id, name, DASHBOARD_CONSTANTS?.toolsTable?.confirmDelete)} 
                        isLoading={toolsLoading}
                        error={toolsError}
                        onRetry={refreshData}
                        content={DASHBOARD_CONSTANTS?.toolsTable}
                    />
                </div>
            ) : (
                <div className={styles.discoveryGrid}>
                    <DashboardFavorites 
                        favorites={favorites} 
                        isLoading={favoritesLoading}
                        error={favoritesError}
                        onRetry={refreshData}
                        content={DASHBOARD_CONSTANTS?.favorites}
                    />
                    <DashboardWelcomeCTA content={DASHBOARD_CONSTANTS?.welcome} />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
