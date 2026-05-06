import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { useToolForm } from '../hooks/useToolForm';

// Import UI Atoms
import PageHero from '../components/ui/PageHero';
import StepIndicator from '../components/ui/StepIndicator';
import SubmitSuccess from '../components/SubmitTool/SubmitSuccess';
import Safeguard from '../components/ui/Safeguard';

// Import Form Sections
import ToolFormBasicInfo from '../components/ToolForm/ToolFormBasicInfo';
import ToolFormMedia from '../components/ToolForm/ToolFormMedia';
import ToolFormFeatures from '../components/ToolForm/ToolFormFeatures';
import ToolFormActions from '../components/ToolForm/ToolFormActions';

import styles from './SubmitTool.module.css';
import { SUBMIT_TOOL_CONSTANTS } from '../constants/toolFormConstants';

/**
 * SubmitTool - Ultimate Elite Wizard (10/10)
 * Rule #16: Pure Orchestration Pattern
 * Rule #31: Component Resilience via Safeguard
 */
const SubmitTool = () => {
    const navigate = useNavigate();
    const {
        formData, setFormData, categories, isFetchingInitialData,
        isSubmitting, isUploading, isSuccess, isLimitReached, fieldErrors,
        imagePreview, setImagePreview, useManualUrl, setUseManualUrl,
        addFeature, removeFeature, handleFeatureChange,
        addUseCase, removeUseCase, handleUseCaseChange,
        handleFileChange, handleSubmit, currentStep, nextStep, prevStep, goToStep, error, resetForm
    } = useToolForm({ mode: 'submit' });

    // 1. Elite Submission Security & UX Hardening (v3.0)
    // Rule #34: Submission forms MUST be invisible to search engines
    useSEO({ 
        title: 'Submit Tool | HUBly',
        description: 'Publish and submit your AI tools to the HUBly platform.',
        noindex: true, // Critical Security: Prevent indexing of form flows
        robots: "noindex, nofollow, noarchive", 
        ogType: 'website',
        schema: null 
    });

    if (isSuccess) return (
        <SubmitSuccess 
            toolName={formData.name} 
            onNavigateDashboard={() => navigate('/dashboard')} 
            onReset={resetForm} 
            content={SUBMIT_TOOL_CONSTANTS}
        />
    );

    const STEPS_MAP = useMemo(() => ({
        1: <ToolFormBasicInfo 
                formData={formData} setFormData={setFormData} categories={categories} 
                fieldErrors={fieldErrors} isFetchingInitialData={isFetchingInitialData}
                content={SUBMIT_TOOL_CONSTANTS}
            />,
        2: <ToolFormMedia 
                formData={formData} setFormData={setFormData} imagePreview={imagePreview}
                setImagePreview={setImagePreview} isUploading={isUploading}
                useManualUrl={useManualUrl} setUseManualUrl={setUseManualUrl}
                handleFileChange={handleFileChange} fieldErrors={fieldErrors}
                isFetchingInitialData={isFetchingInitialData} content={SUBMIT_TOOL_CONSTANTS}
            />,
        3: <ToolFormFeatures 
                formData={formData} addFeature={addFeature} removeFeature={removeFeature}
                handleFeatureChange={handleFeatureChange} isFetchingInitialData={isFetchingInitialData}
                addUseCase={addUseCase} removeUseCase={removeUseCase} handleUseCaseChange={handleUseCaseChange}
                content={SUBMIT_TOOL_CONSTANTS}
            />
    }), [
        formData, setFormData, categories, fieldErrors, isFetchingInitialData,
        imagePreview, setImagePreview, isUploading, useManualUrl, setUseManualUrl,
        handleFileChange, addFeature, removeFeature, handleFeatureChange,
        addUseCase, removeUseCase, handleUseCaseChange
    ]);

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
                                onCancel={currentStep === 1 ? () => navigate('/dashboard') : prevStep}
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
};

export default SubmitTool;
