import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import styles from './SubmitSuccess.module.css';

const SubmitSuccess = ({ toolName, onNavigateDashboard, onReset }) => {
    return (
        <div className={styles.successWrapper}>
            <div className={styles.successCard}>
                <div className={styles.iconBg}>
                    <CheckCircle2 size={60} />
                </div>
                <h2>Success!</h2>
                <p>
                    Your tool <strong>{toolName}</strong> has been submitted. Our team will review and publish it within 24-48 hours.
                </p>
                <div className={styles.actionsRow}>
                    <button onClick={onNavigateDashboard} className={`btn-primary ${styles.dashboardBtn}`}>Dashboard</button>
                    <button onClick={onReset} className={styles.resetBtn}>Add Another</button>
                </div>
            </div>
        </div>
    );
};

export default SubmitSuccess;
