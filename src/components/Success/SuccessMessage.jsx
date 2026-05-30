import React from 'react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import { SUCCESS_UI_CONSTANTS } from '../../constants/successConstants';
import styles from './SuccessMessage.module.css';

const SuccessMessage = ({ type, tierId, toolName, isLoading, error, onRetry }) => {
    const getMessages = SUCCESS_UI_CONSTANTS?.getMessages;

    if (isLoading) {
        return (
            <div className={styles.skeletonContainer}>
                <div className={styles.skeletonHeader}>
                    <Skeleton className={styles.skeletonTitle} />
                </div>
                <div className={styles.skeletonBody}>
                    <Skeleton className={styles.skeletonLine} />
                    <Skeleton className={styles.skeletonLineSmall} />
                </div>
            </div>
        );
    }

    const content = getMessages ? getMessages(type, tierId, toolName) : { title: "Success!", description: "Operation completed." };

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.messageContent}>
                <h1 className={styles.successTitle}>
                    <span className="gradient-text">{content.title}</span>
                </h1>
                <p className={styles.successMessageText}>
                    {content.description}
                </p>
            </div>
        </Safeguard>
    );
};

export default SuccessMessage;




