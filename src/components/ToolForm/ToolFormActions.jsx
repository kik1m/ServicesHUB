import React from 'react';
import { Save, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
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
    content // New prop
}) => {
    if (isLoading) {
        return (
            <div className={styles.formActionBar}>
                <Skeleton width="180px" height="54px" borderRadius="14px" />
                <Skeleton width="110px" height="24px" className={styles.skeletonAuto} />
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
        <div className={styles.formActionBar}>
            <div className={styles.mainActions}>
                {isLastStep ? (
                    <Button 
                        type="submit"
                        isLoading={saving || uploading} 
                        className={styles.premiumSubmitBtn}
                        icon={Save}
                        iconSize={20}
                    >
                        {labels.submit}
                    </Button>
                ) : (
                    <Button 
                        onClick={onNext}
                        className={styles.premiumSubmitBtn}
                        icon={ArrowRight}
                        iconPosition="right"
                        iconSize={20}
                    >
                        {labels.next} {currentStep + 1}
                    </Button>
                )}
            </div>

            <Button 
                variant="ghost" 
                onClick={onCancel} 
                className={styles.premiumCancelBtn}
                icon={currentStep > 1 ? ArrowLeft : null}
            >
                {currentStep > 1 ? labels.prev : labels.cancel}
            </Button>
        </div>
    );
};

export default ToolFormActions;
