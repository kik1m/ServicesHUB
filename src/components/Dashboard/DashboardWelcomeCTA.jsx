import React from 'react';
import { Rocket, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './DashboardWelcomeCTA.module.css';

const DashboardWelcomeCTA = () => {
    return (
        <div className={`glass-card ${styles.welcomeCard}`}>
            <div className={styles.iconWrapper}>
                <Rocket size={36} />
            </div>
            <h2 className={styles.title}>Ready to <span className="gradient-text">Launch</span>?</h2>
            <p className={styles.description}>
                Join our community of creators. Submit your tool today to get featured and reach thousands of makers worldwide.
            </p>
            <Link to="/submit" className="btn-primary" style={{ width: '100%', padding: '15px' }}>
                <PlusCircle size={20} style={{ marginRight: '10px' }} />
                Submit Your First Tool
            </Link>
        </div>
    );
};

export default DashboardWelcomeCTA;
