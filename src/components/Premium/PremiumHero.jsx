import React from 'react';
import { Gem } from 'lucide-react';
import styles from './PremiumHero.module.css';

const PremiumHero = () => {
    return (
        <header className={styles.premiumCustomHeader}>
            <div className={styles.premiumDiamondBadge}>
                <Gem size={12} style={{ marginRight: '6px' }} />
                DIAMOND ACCESS
            </div>
            <h1>
                Unlock the <span className={styles.goldGradientText}>Full Potential</span>
            </h1>
            <p>
                Join the most exclusive tier of HUBly. One-time investment for a lifetime of growth.
            </p>
        </header>
    );
};

export default PremiumHero;
