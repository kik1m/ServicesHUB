import React from 'react';
import { CheckCircle2, LayoutDashboard, PlusCircle } from 'lucide-react';
import Button from '../ui/Button';
import styles from './SubmitSuccess.module.css';

/**
 * SubmitSuccess - Elite Success State
 * Rule #14: Centralized Constants Pattern
 */
const SubmitSuccess = ({ toolName, onNavigateDashboard, onReset, content }) => {
    const successContent = content.success;

    return (
        <div className={styles.successWrapper}>
            <div className={styles.successCard}>
                <div className={styles.iconBg}>
                    <CheckCircle2 size={54} />
                </div>
                <h2 className={styles.successTitle}>{successContent.title}</h2>
                <p className={styles.successDesc}>
                    Your tool <strong>{toolName}</strong> has been received. {successContent.desc}
                </p>
                <div className={styles.actionsRow}>
                    <Button 
                        onClick={onNavigateDashboard} 
                        className={styles.dashboardBtn}
                        icon={LayoutDashboard}
                    >
                        {successContent.actions.dashboard}
                    </Button>
                    <Button 
                        variant="ghost"
                        onClick={onReset} 
                        className={styles.resetBtn}
                        icon={PlusCircle}
                    >
                        {successContent.actions.another}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SubmitSuccess;




