'use client';
import React, { useMemo } from 'react';
import { useToolForm } from '@/hooks/useToolForm';

// Import UI Atoms
import PageHero from '@/components/ui/PageHero';
import StepIndicator from '@/components/ui/StepIndicator';
import SubmitSuccess from '@/components/SubmitTool/SubmitSuccess';
import Safeguard from '@/components/ui/Safeguard';

// Import Form Sections
import ToolFormBasicInfo from '@/components/ToolForm/ToolFormBasicInfo';
import ToolFormMedia from '@/components/ToolForm/ToolFormMedia';
import ToolFormFeatures from '@/components/ToolForm/ToolFormFeatures';
import ToolFormActions from '@/components/ToolForm/ToolFormActions';

import styles from './page.module.css';
import { SUBMIT_TOOL_CONSTANTS } from '@/constants/toolFormConstants';

/**
 * SubmitTool - Ultimate Elite Wizard (10/10)
 * Rule #16: Pure Orchestration Pattern
 * Rule #34: Submission forms MUST be invisible to search engines (via layout)
 */
export default function SubmitToolPage() {
    const {
        formData, setFormData, categories, isFetchingInitialData,
        isSubmitting, isUploading, isSuccess, isLimitReached, fieldErrors,
        imagePreview, setImagePreview, useManualUrl, setUseManualUrl,
        addFeature, removeFeature, handleFeatureChange,
        addUseCase, removeUseCase, handleUseCaseChange,
        handleSectionChange, addSection, removeSection,
        handlePlanChange, handlePlanFeatureChange, addPlan, removePlan, addPlanFeature, removePlanFeature,
        handleFileChange, handleSubmit, currentStep, nextStep, prevStep, goToStep, error, resetForm, router
    } = useToolForm({ mode: 'submit' });

    if (isSuccess) return (
        <SubmitSuccess 
            toolName={formData.name} 
            onNavigateDashboard={() => router.push('/dashboard')} 
            onReset={resetForm} 
            content={SUBMIT_TOOL_CONSTANTS}
        />
    );

    const STEPS_MAP = {
        1: <ToolFormBasicInfo 
                formData={formData} setFormData={setFormData} categories={categories} 
                fieldErrors={fieldErrors} isFetchingInitialData={isFetchingInitialData}
                handlePlanChange={handlePlanChange} handlePlanFeatureChange={handlePlanFeatureChange}
                addPlan={addPlan} removePlan={removePlan} 
                addPlanFeature={addPlanFeature} removePlanFeature={removePlanFeature}
                content={SUBMIT_TOOL_CONSTANTS}
            />,
        2: <ToolFormMedia 
                formData={formData} setFormData={setFormData} imagePreview={imagePreview}
                setImagePreview={setImagePreview} isUploading={isUploading}
                useManualUrl={useManualUrl} setUseManualUrl={setUseManualUrl}
                handleFileChange={handleFileChange} fieldErrors={fieldErrors}
                handleSectionChange={handleSectionChange} addSection={addSection} removeSection={removeSection}
                isFetchingInitialData={isFetchingInitialData} content={SUBMIT_TOOL_CONSTANTS}
            />,
        3: <ToolFormFeatures 
                formData={formData} addFeature={addFeature} removeFeature={removeFeature}
                handleFeatureChange={handleFeatureChange} isFetchingInitialData={isFetchingInitialData}
                addUseCase={addUseCase} removeUseCase={removeUseCase} handleUseCaseChange={handleUseCaseChange}
                content={SUBMIT_TOOL_CONSTANTS}
            />
    };

    return (
        <main className={styles.submitContainer}>
            <PageHero 
                title={SUBMIT_TOOL_CONSTANTS.hero.title} 
                highlight={SUBMIT_TOOL_CONSTANTS.hero.highlight} 
                isLoading={isFetchingInitialData}
                breadcrumbs={SUBMIT_TOOL_CONSTANTS.hero.breadcrumbs}
                subtitle={SUBMIT_TOOL_CONSTANTS.hero.subtitle}
            />

            <div className={styles.submitWrapper}>
                <StepIndicator 
                    steps={SUBMIT_TOOL_CONSTANTS.steps} 
                    currentStep={currentStep} 
                    onStepClick={goToStep}
                />

                <Safeguard error={error} title="Submission Action Failed" onRetry={resetForm}>
                    <form 
                        onSubmit={(e) => e.preventDefault()} 
                        className={`${styles.submitForm} ${isLimitReached ? styles.limitReachedLock : ''}`}
                    >
                        {STEPS_MAP[currentStep]}

                        <div className={styles.actionContainer}>
                            <ToolFormActions 
                                saving={isSubmitting} 
                                uploading={isUploading} 
                                onCancel={currentStep === 1 ? () => router.push('/dashboard') : prevStep}
                                onNext={nextStep}
                                onSubmit={handleSubmit}
                                currentStep={currentStep}
                                isLastStep={currentStep === 3}
                                isLoading={isFetchingInitialData}
                                content={SUBMIT_TOOL_CONSTANTS}
                            />
                        </div>
                    </form>
                </Safeguard>
            </div>
        </main>
    );
}
