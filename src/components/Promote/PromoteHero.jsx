import React from 'react';
import styles from './PromoteHero.module.css';

const PromoteHero = () => {
    return (
        <header className={styles.promoteHeaderSlim}>
            <div className={styles.promoteStatusBadge}>ADVERTISING & GROWTH</div>
            <h1>
                Scale Your <span className={styles.purpleMagentaGradient}>Visibility</span>
            </h1>
            <p>
                Reach thousands of AI enthusiasts, developers, and founders every day. Choose the boost your tool deserves.
            </p>
        </header>
    );
};

export default PromoteHero;
