import React from 'react';
import { Shield, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import { AI_ENGINE_CONSTANTS } from '../../constants/aiEngineConstants';
import styles from './AIChatLimitAlert.module.css';

export default function AIChatLimitAlert({ isGuestLimitReached, countdown }) {
    if (isGuestLimitReached) {
        return (
            <div className={styles.limitReachedContainer}>
                <p className={styles.limitReachedText}>
                    <Shield size={16} />
                    <span><strong>{AI_ENGINE_CONSTANTS.limitAlerts.guestLimitTitle}</strong> {AI_ENGINE_CONSTANTS.limitAlerts.guestLimitMessage}</span>
                </p>
                <div className={styles.limitActions}>
                    <Button 
                        className={styles.limitButton}
                        as="a" 
                        href="/auth"
                        icon={Sparkles}
                    >
                        {AI_ENGINE_CONSTANTS.limitAlerts.guestLimitCta}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.limitReachedContainer}>
            <p className={styles.limitReachedText}>
                <Shield size={16} />
                <span><strong>{AI_ENGINE_CONSTANTS.limitAlerts.authLimitTitle}</strong> {AI_ENGINE_CONSTANTS.limitAlerts.authLimitMessage} {countdown || '...'}</span>
            </p>
            <div className={styles.limitActions}>
                <Button 
                    className={styles.limitButton}
                    as="a" 
                    href="/premium"
                    icon={Sparkles}
                >
                    {AI_ENGINE_CONSTANTS.limitAlerts.authLimitCta}
                </Button>
            </div>
        </div>
    );
}
