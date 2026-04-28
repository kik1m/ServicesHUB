import React from 'react';
import { Home, Search } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import Safeguard from '../ui/Safeguard';
import { NOT_FOUND_UI_CONSTANTS } from '../../constants/notFoundConstants';
import styles from './NotFoundActions.module.css';

const NotFoundActions = ({ isLoading, error, onRetry }) => {
    const { actions } = NOT_FOUND_UI_CONSTANTS;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            {isLoading ? (
                <div className={styles.actionsRow}>
                    <Skeleton className={styles.skeletonBtnLarge} />
                    <Skeleton className={styles.skeletonBtnSmall} />
                </div>
            ) : (
                <div className={styles.actionsRow}>
                    <Button 
                        to="/" 
                        variant="primary" 
                        icon={Home}
                        iconPosition="right"
                        size="lg"
                    >
                        {actions?.home}
                    </Button>
                    <Button 
                        to="/tools" 
                        variant="secondary" 
                        icon={Search}
                        iconPosition="right"
                        size="lg"
                    >
                        {actions?.explore}
                    </Button>
                </div>
            )}
        </Safeguard>
    );
};

export default NotFoundActions;




