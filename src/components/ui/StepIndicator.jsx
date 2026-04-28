import React from 'react';
import { Check } from 'lucide-react';
import styles from './StepIndicator.module.css';

/**
 * 🚀 Elite Step Indicator
 * Rule #14: Atomic UI for progress tracking
 */
const StepIndicator = ({ steps, currentStep, onStepClick }) => {
    return (
        <div className={styles.container}>
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isCompleted = currentStep > stepNumber;
                const isActive = currentStep === stepNumber;

                return (
                    <React.Fragment key={stepNumber}>
                        <div 
                            className={`${styles.stepWrapper} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
                            onClick={() => onStepClick?.(stepNumber)}
                        >
                            <div className={styles.circle}>
                                {isCompleted ? <Check size={16} strokeWidth={3} /> : stepNumber}
                            </div>
                            <span className={styles.label}>{step}</span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`${styles.line} ${isCompleted ? styles.lineCompleted : ''}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default StepIndicator;
