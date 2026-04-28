import React from 'react';
import { LayoutDashboard, Compass } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import { SUCCESS_UI_CONSTANTS } from '../../constants/successConstants';
import styles from './SuccessActions.module.css';

const SuccessActions = ({ isLoading }) => {
    const { actions } = SUCCESS_UI_CONSTANTS;

    if (isLoading) {
        return (
            <div className={styles.successActionsRow}>
                <Skeleton className={styles.skeletonBtnLarge} />
                <Skeleton className={styles.skeletonBtnSmall} />
            </div>
        );
    }
    return (
        <div className={styles.successActionsRow}>
            <Button 
                to="/dashboard" 
                variant="primary" 
                icon={LayoutDashboard}
                iconPosition="right"
                size="lg"
            >
                {actions.dashboard}
            </Button>
            <Button 
                to="/tools" 
                variant="secondary" 
                icon={Compass}
                iconPosition="right"
                size="lg"
            >
                {actions.explore}
            </Button>
        </div>
    );
};

export default SuccessActions;




