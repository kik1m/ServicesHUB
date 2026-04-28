import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import Safeguard from '../ui/Safeguard';
import styles from './ResetPasswordSuccess.module.css';

/**
 * ResetPasswordSuccess - Elite feedback component
 * Rule #13: Atomic Button standardization
 */
const ResetPasswordSuccess = memo(({ content, error, onRetry }) => {
    const navigate = useNavigate();

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.successContainer}>
                <div className={styles.iconWrapper}>
                    <CheckCircle2 size={48} className={styles.successIcon} />
                </div>
                
                <h2 className={styles.title}>{content?.title}</h2>
                <p className={styles.subtitle}>{content?.subtitle}</p>

                <Button 
                    onClick={() => navigate('/auth')} 
                    variant="primary" 
                    size="lg"
                    icon={ArrowRight}
                    iconPosition="right"
                    className={styles.actionBtn}
                >
                    {content?.action}
                </Button>
            </div>
        </Safeguard>
    );
});

export default ResetPasswordSuccess;
