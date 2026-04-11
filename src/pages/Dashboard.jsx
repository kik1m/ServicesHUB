import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useSEO from '../hooks/useSEO';
import { useDashboardData } from '../hooks/useDashboardData';
import SkeletonLoader from '../components/SkeletonLoader';

// Import Modular Components
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import DashboardStats from '../components/Dashboard/DashboardStats';
import DashboardViewsChart from '../components/Dashboard/DashboardViewsChart';
import DashboardToolsTable from '../components/Dashboard/DashboardToolsTable';
import DashboardFavorites from '../components/Dashboard/DashboardFavorites';
import DashboardWelcomeCTA from '../components/Dashboard/DashboardWelcomeCTA';

// Import Modular Styles
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user, loading: authLoading } = useAuth();
    
    const {
        userTools,
        favorites,
        isLoading,
        error,
        handleDeleteTool
    } = useDashboardData(user, authLoading);

    useSEO({
        title: userTools.length > 0 ? 'Creator Dashboard | HUBly' : 'My Dashboard | HUBly',
        description: 'Manage your submissions, track views, and explore your favorite tools all in one place.',
        url: typeof window !== 'undefined' ? window.location.href : 'https://hubly.com/dashboard'
    });

    if (isLoading) {
        return (
            <div className={`container ${styles.dashboardPage}`}>
                <div style={{ marginBottom: '3rem' }}>
                    <SkeletonLoader type="title" width="300px" style={{ marginBottom: '1rem' }} />
                    <SkeletonLoader type="text" width="60%" />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <SkeletonLoader type="stat" />
                    <SkeletonLoader type="stat" />
                    <SkeletonLoader type="stat" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '3rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <SkeletonLoader height="150px" borderRadius="24px" />
                        <SkeletonLoader height="400px" borderRadius="24px" />
                    </div>
                    <SkeletonLoader height="500px" borderRadius="24px" />
                </div>
            </div>
        );
    }

    const isCreator = userTools.length > 0;

    return (
        <div className={`container ${styles.dashboardPage}`}>
            
            <DashboardHeader 
                isCreator={isCreator} 
                user={user} 
                showToast={showToast} 
            />

            {error && (
                <div className={styles.alertBox}>
                    <AlertCircle size={18} /> {error}
                </div>
            )}

            <DashboardStats 
                isCreator={isCreator} 
                userTools={userTools} 
                favorites={favorites} 
                user={user}
            />

            {isCreator ? (
                <div className={styles.creatorGrid}>
                    <DashboardViewsChart userTools={userTools} />
                    
                    <div style={{ marginBottom: '1.5rem', marginTop: '3rem' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: '900' }}>Active Listings</h2>
                    </div>
                    
                    <DashboardToolsTable 
                        userTools={userTools} 
                        navigate={navigate} 
                        handleDeleteTool={(id, name) => handleDeleteTool(id, name, showToast)} 
                    />
                </div>
            ) : (
                <div className={styles.discoveryGrid}>
                    <DashboardFavorites favorites={favorites} />
                    <DashboardWelcomeCTA />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
