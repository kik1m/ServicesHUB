import React from 'react';
import styles from './SuccessMessage.module.css';

const SuccessMessage = ({ type, toolName }) => {
    const isPremium = type === 'account_premium';

    return (
        <>
            <h1 className={styles.successTitle}>
                <span className="gradient-text">Success!</span>
            </h1>
            <p className={styles.successMessageText}>
                {isPremium 
                    ? "Congratulations! Your account has been upgraded to Premium for life. Enjoy full access to all exclusive features."
                    : `Your tool "${toolName || 'your tool'}" has been successfully promoted. It is now featured on our homepage.`
                }
            </p>
        </>
    );
};

export default SuccessMessage;
