import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Compass } from 'lucide-react';
import styles from './SuccessActions.module.css';

const SuccessActions = () => {
    return (
        <div className={styles.successActionsRow}>
            <Link to="/dashboard" className="btn-primary">
                Go to Dashboard <LayoutDashboard size={18} />
            </Link>
            <Link to="/tools" className="btn-secondary">
                Explore Tools <Compass size={18} />
            </Link>
        </div>
    );
};

export default SuccessActions;
