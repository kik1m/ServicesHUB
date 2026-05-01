import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import Safeguard from '../ui/Safeguard';
import styles from './DirectorySubmitCTA.module.css';

/**
 * DirectorySubmitCTA - Standardized Community Call-to-Action
 */
const DirectorySubmitCTA = memo(({ error, onRetry, content }) => {
    const navigate = useNavigate();

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.ctaCard}>
                <div className={styles.iconBox}>
                    <Sparkles size={28} className={styles.ctaIcon} />
                </div>
                <div className={styles.ctaContent}>
                    <h3 className={styles.ctaTitle}>{content?.title}</h3>
                    <p className={styles.ctaDescription}>{content?.description}</p>
                </div>
                <Button 
                    onClick={() => navigate('/submit')} 
                    variant="primary"
                    className={styles.submitBtn}
                >
                    {content?.button}
                </Button>
            </div>
        </Safeguard>
    );
});

export default DirectorySubmitCTA;
