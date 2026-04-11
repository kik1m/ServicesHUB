import React from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { useSubmitToolData } from '../hooks/useSubmitToolData';

// Import Modular Components
import SubmitSuccess from '../components/SubmitTool/SubmitSuccess';
import ToolFormHeader from '../components/ToolForm/ToolFormHeader';
import ToolFormBasicInfo from '../components/ToolForm/ToolFormBasicInfo';
import ToolFormMedia from '../components/ToolForm/ToolFormMedia';
import ToolFormFeatures from '../components/ToolForm/ToolFormFeatures';
import ToolFormActions from '../components/ToolForm/ToolFormActions';

// Import Modular CSS
import styles from './SubmitTool.module.css';

const SubmitTool = () => {
    const navigate = useNavigate();
    const {
        formData,
        setFormData,
        categories,
        isLoading,
        loading,
        uploading,
        isSuccess,
        isLimitReached,
        fieldErrors,
        imagePreview,
        useManualUrl,
        setUseManualUrl,
        addFeature,
        removeFeature,
        handleFeatureChange,
        handleFileChange,
        handleSubmit
    } = useSubmitToolData();

    useSEO({
        title: "Submit New Tool - HUBly",
        description: "Join the ultimate directory for modern AI and SaaS tools.",
        url: typeof window !== 'undefined' ? window.location.href : ''
    });

    if (isLoading) return (
        <div className={styles.loadingWrapper}>
            <Loader2 className="animate-spin text-primary" size={40} />
        </div>
    );

    if (isSuccess) return (
        <SubmitSuccess 
            toolName={formData.name} 
            onNavigateDashboard={() => navigate('/dashboard')} 
            onReset={() => window.location.reload()} 
        />
    );

    return (
        <div className={styles.submitContainer}>
            <ToolFormHeader 
                title="Submit New Tool" 
                subtitle="Join the ultimate directory for modern AI and SaaS tools."
                onBack={() => navigate('/dashboard')}
                breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Submit Tool' }]}
            />

            <div className={styles.submitWrapper}>
                <form 
                    onSubmit={handleSubmit} 
                    className={`${styles.submitForm} ${isLimitReached ? styles.limitReachedLock : ''}`}
                >
                    <ToolFormBasicInfo 
                        formData={formData} 
                        setFormData={setFormData} 
                        categories={categories} 
                        fieldErrors={fieldErrors} 
                    />

                    <ToolFormMedia 
                        formData={formData}
                        setFormData={setFormData}
                        imagePreview={imagePreview}
                        uploading={uploading}
                        useManualUrl={useManualUrl}
                        setUseManualUrl={setUseManualUrl}
                        handleFileChange={handleFileChange}
                        fieldErrors={fieldErrors}
                    />

                    <ToolFormFeatures 
                        formData={formData}
                        addFeature={addFeature}
                        removeFeature={removeFeature}
                        handleFeatureChange={handleFeatureChange}
                    />

                    <ToolFormActions 
                        saving={loading} 
                        uploading={uploading} 
                        onCancel={() => navigate('/dashboard')} 
                    />
                </form>
            </div>
        </div>
    );
};

export default SubmitTool;
