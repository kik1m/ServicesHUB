import React from 'react';
import { CheckCircle, Rocket, Sparkles } from 'lucide-react';
import styles from './SuccessHero.module.css';

const SuccessHero = ({ type }) => {
    const Icon = type === 'account_premium' ? Sparkles : Rocket;

    return (
        <div className={styles.successPulseIcon}>
            <Icon size={100} />
        </div>
    );
};

export default SuccessHero;
