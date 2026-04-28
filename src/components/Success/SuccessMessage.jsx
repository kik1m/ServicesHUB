import React from 'react';
import Skeleton from '../ui/Skeleton';
import { SUCCESS_UI_CONSTANTS } from '../../constants/successConstants';
import styles from './SuccessMessage.module.css';

const SuccessMessage = ({ type, toolName, isLoading }) => {
    const { messages, types } = SUCCESS_UI_CONSTANTS;

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

    const isPremium = type === types.PREMIUM;
    const content = isPremium ? messages.premium : messages.promotion;

    return (
        <div className={styles.messageContent}>
            <h1 className={styles.successTitle}>
                <span className="gradient-text">{content.title}</span>
            </h1>
            <p className={styles.successMessageText}>
                {isPremium 
                    ? content.description 
                    : content.description.replace('Your tool', `Your tool "${toolName || 'your tool'}"`)
                }
            </p>
        </div>
    );
};

export default SuccessMessage;




