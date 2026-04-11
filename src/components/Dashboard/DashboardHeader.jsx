import React from 'react';
import { Plus, Share2, Home, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './DashboardHeader.module.css';

const DashboardHeader = ({ isCreator, user, showToast }) => {
    const handleShare = () => {
        const url = `${window.location.origin}/u/${user?.id}`;
        navigator.clipboard.writeText(url);
        showToast('Profile link copied!', 'success');
    };

    return (
        <header className={styles.headerPremium}>
            <div className={styles.breadcrumbWrapper}>
                <Link to="/" className={styles.breadcrumbItem}>
                    <Home size={14} className={styles.breadcrumbIcon} />
                    Home
                </Link>
                <ChevronRight size={14} className={styles.breadcrumbIcon} />
                <span className={styles.breadcrumbItem} style={{ color: 'var(--primary)', fontWeight: '700' }}>
                    Dashboard
                </span>
            </div>
            
            <div className={styles.headerMain}>
                <div className={styles.headerInfo}>
                    <span className={styles.badgePill}>MEMBER AREA</span>
                    <h1 className={styles.title}>
                        {isCreator ? 'Creator ' : 'My '}<span>Dashboard</span>
                    </h1>
                    <p className={styles.subtitle}>
                        {isCreator 
                            ? "Monitoring your tool clinical performance and listings" 
                            : "Explore your saved favorites and manage your discovery journey."}
                    </p>
                </div>

                <div className={styles.headerActions}>
                    <button onClick={handleShare} className={styles.btnShare}>
                        <Share2 size={18} />
                        Share Profile
                    </button>
                    <Link to="/submit" className={styles.btnSubmit}>
                        <Plus size={20} />
                        Submit Tool
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
