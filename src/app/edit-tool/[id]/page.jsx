'use client';
import React, { useMemo } from 'react';
import { Settings } from 'lucide-react';
import { useToolForm } from '@/hooks/useToolForm';

// Import UI Atoms
import PageHero from '@/components/ui/PageHero';
import StepIndicator from '@/components/ui/StepIndicator';
import Safeguard from '@/components/ui/Safeguard';

// Import Form Sections
import ToolFormBasicInfo from '@/components/ToolForm/ToolFormBasicInfo';
import ToolFormMedia from '@/components/ToolForm/ToolFormMedia';
import ToolFormFeatures from '@/components/ToolForm/ToolFormFeatures';
import ToolFormActions from '@/components/ToolForm/ToolFormActions';

import styles from './page.module.css';
import { EDIT_TOOL_CONSTANTS, SUBMIT_TOOL_CONSTANTS } from '@/constants/toolFormConstants';

/**
 * EditTool - Elite Standard Orchestrator (10/10)
 * Rule #16: Pure Orchestration Pattern
 * Rule #34: Administrative editors MUST be invisible to search engines
 */
export default function EditToolPage() {
    const {
        formData, setFormData, categories, isFetchingInitialData,
        isSubmitting, isUploading, fieldErrors, imagePreview, setImagePreview,
        useManualUrl, setUseManualUrl, addFeature, removeFeature, handleFeatureChange,
        addUseCase, removeUseCase, handleUseCaseChange,
        handleSectionChange, addSection, removeSection,
        handlePlanChange, handlePlanFeatureChange, addPlan, removePlan, addPlanFeature, removePlanFeature,
        handleFileChange, handleSubmit, currentStep, nextStep, prevStep, goToStep, error, refresh, router
    } = useToolForm({ mode: 'edit' });

    const STEPS_MAP = {
        1: <ToolFormBasicInfo 
                formData={formData} setFormData={setFormData} categories={categories} 
                fieldErrors={fieldErrors} isFetchingInitialData={isFetchingInitialData}
                handlePlanChange={handlePlanChange} handlePlanFeatureChange={handlePlanFeatureChange}
                addPlan={addPlan} removePlan={removePlan} 
                addPlanFeature={addPlanFeature} removePlanFeature={removePlanFeature}
                content={EDIT_TOOL_CONSTANTS}
            />,
        2: <ToolFormMedia 
                formData={formData} setFormData={setFormData} imagePreview={imagePreview}
                setImagePreview={setImagePreview} isUploading={isUploading}
                useManualUrl={useManualUrl} setUseManualUrl={setUseManualUrl}
                handleFileChange={handleFileChange} fieldErrors={fieldErrors}
                handleSectionChange={handleSectionChange} addSection={addSection} removeSection={removeSection}
                isFetchingInitialData={isFetchingInitialData} content={EDIT_TOOL_CONSTANTS}
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
                    <form onSubmit={(e) => e.preventDefault()} className={styles.submitForm}>
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
                                content={EDIT_TOOL_CONSTANTS}
                            />
                        </div>
                    </form>
                </Safeguard>
            </div>
        </main>
    );
}
