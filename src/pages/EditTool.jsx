import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import { useToolForm } from '../hooks/useToolForm';

// Import UI Atoms
import PageHero from '../components/ui/PageHero';
import StepIndicator from '../components/ui/StepIndicator';
import Safeguard from '../components/ui/Safeguard';

// Import Form Sections
import ToolFormBasicInfo from '../components/ToolForm/ToolFormBasicInfo';
import ToolFormMedia from '../components/ToolForm/ToolFormMedia';
import ToolFormFeatures from '../components/ToolForm/ToolFormFeatures';
import ToolFormActions from '../components/ToolForm/ToolFormActions';

import styles from './SubmitTool.module.css'; // Reusing layout styles
import { EDIT_TOOL_CONSTANTS, SUBMIT_TOOL_CONSTANTS } from '../constants/toolFormConstants';

/**
 * EditTool - Elite Standard Orchestrator (10/10)
 * Rule #16: Pure Orchestration Pattern
 * Rule #31: Component Resilience via Safeguard
 */
const EditTool = () => {
    const navigate = useNavigate();
    const {
        formData, setFormData, categories, isFetchingInitialData,
        isSubmitting, isUploading, fieldErrors, imagePreview, setImagePreview,
        useManualUrl, setUseManualUrl, addFeature, removeFeature, handleFeatureChange,
        handleFileChange, handleSubmit, currentStep, nextStep, prevStep, goToStep, error, refresh
    } = useToolForm({ mode: 'edit' });

    // 1. SEO Hardening (v2.0)
    useSEO({ 
        title: formData.name ? `Edit ${formData.name}` : 'Edit Tool',
        description: 'Update your tool details on HUBly.' 
    });

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
                content={SUBMIT_TOOL_CONSTANTS}
            />
    }), [
        formData, setFormData, categories, fieldErrors, isFetchingInitialData,
        imagePreview, setImagePreview, isUploading, useManualUrl, setUseManualUrl,
        handleFileChange, addFeature, removeFeature, handleFeatureChange
    ]);

    return (
        <div className={styles.submitContainer}>
            <PageHero 
                title={EDIT_TOOL_CONSTANTS.hero.title} 
                highlight={formData.name || EDIT_TOOL_CONSTANTS.hero.highlight} 
                isLoading={isFetchingInitialData}
                breadcrumbs={EDIT_TOOL_CONSTANTS.hero.breadcrumbs}
                subtitle={EDIT_TOOL_CONSTANTS.hero.subtitle}
                icon={<Settings size={24} />}
            />

            <div className={styles.submitWrapper}>
                <StepIndicator 
                    steps={EDIT_TOOL_CONSTANTS.steps} 
                    currentStep={currentStep} 
                    onStepClick={goToStep}
                />

                <Safeguard error={error} onRetry={refresh} title="Update Operation Failed">
                    <form onSubmit={handleSubmit} className={styles.submitForm}>
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
                                content={EDIT_TOOL_CONSTANTS}
                            />
                        </div>
                    </form>
                </Safeguard>
            </div>
        </div>
    );
};

export default EditTool;
