import React from 'react';
import { Save, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ToolFormActions.module.css';

/**
 * ToolFormActions - Elite Wizard Navigation
 * Rule #22: Content Separation (Labels passed from parent)
 */
const ToolFormActions = ({ 
    saving, 
    uploading, 
    onCancel, 
    onNext, 
    onSubmit, 
    currentStep, 
    isLastStep, 
    isLoading,
    error,
    onRetry,
    content 
}) => {
    if (isLoading) {
        return (
            <div className={styles.formActionBar}>
                <div className={styles.mainActions}>
                    <Skeleton width="240px" height="54px" borderRadius="14px" />
                </div>
                <Skeleton width="120px" height="40px" borderRadius="12px" />
            </div>
        );
    }

    const labels = content?.actions || {
        next: "Continue to Step",
        submit: "Submit Tool & Review",
        cancel: "Cancel",
        prev: "Previous Step"
    };

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.formActionBar}>
                <div className={styles.mainActions}>
                    {isLastStep ? (
                        <Button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                onSubmit(e);
                            }}
                            isLoading={saving || uploading} 
                            className={styles.premiumSubmitBtn}
                            icon={Save}
                            iconSize={20}
                        >
                            {labels?.submit}
                        </Button>
                    ) : (
                        <Button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                onNext();
                            }}
                            className={styles.premiumSubmitBtn}
                            icon={ArrowRight}
                            iconPosition="right"
                            iconSize={20}
                        >
                            {labels?.next} {currentStep + 1}
                        </Button>
                    )}
                </div>

                <Button 
                    type="button"
                    variant="ghost" 
                    onClick={onCancel} 
                    className={styles.premiumCancelBtn}
                    icon={currentStep > 1 ? ArrowLeft : null}
                >
                    {currentStep > 1 ? labels?.prev : labels?.cancel}
                </Button>
            </div>
        </Safeguard>
    );
};

export default ToolFormActions;
