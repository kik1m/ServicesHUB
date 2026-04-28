import React, { memo } from 'react';
import { Mail } from 'lucide-react';
import Button from '../ui/Button';
import Safeguard from '../ui/Safeguard';
import { FAQ_UI_CONSTANTS } from '../../constants/faqConstants';
import styles from './FAQContactCTA.module.css';

/**
 * FAQContactCTA - Elite Component
 * Rule #14: Data-Driven UI
 * Rule #112: Zero inline styles
 * Rule #5: Atomic UI Components
 * Rule #31: Component Resilience
 */
const FAQContactCTA = ({ error, onRetry }) => {
    const { cta } = FAQ_UI_CONSTANTS;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={`${styles.helpCTA} glass-card`}>
                <h2 className={styles.title}>
                    {cta?.title} <span className="gradient-text">{cta?.highlight}</span>
                </h2>
                <p className={styles.description}>
                    {cta?.description}
                </p>
                <Button 
                    to="/contact" 
                    variant="primary" 
                    icon={Mail} 
                    iconPosition="right"
                    size="lg"
                >
                    {cta?.button}
                </Button>
            </div>
        </Safeguard>
    );
};

export default memo(FAQContactCTA);
