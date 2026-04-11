import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useEditToolData } from '../hooks/useEditToolData';

// Import Modular Components
import ToolFormHeader from '../components/ToolForm/ToolFormHeader';
import ToolFormBasicInfo from '../components/ToolForm/ToolFormBasicInfo';
import ToolFormMedia from '../components/ToolForm/ToolFormMedia';
import ToolFormFeatures from '../components/ToolForm/ToolFormFeatures';
import ToolFormActions from '../components/ToolForm/ToolFormActions';

// Import Modular CSS (Reuse SubmitTool layout)
import styles from './EditTool.module.css';

const EditTool = () => {
    const navigate = useNavigate();
    const {
        formData,
        setFormData,
        categories,
        isLoading,
        saving,
        uploading,
        fieldErrors,
        imagePreview,
        useManualUrl,
        setUseManualUrl,
        addFeature,
        removeFeature,
        handleFeatureChange,
        handleFileChange,
        handleSubmit,
        setImagePreview
    } = useEditToolData();

    if (isLoading) return (
        <div className={styles.loadingWrapper}>
            <Loader2 className="animate-spin text-primary" size={40} />
        </div>
    );

    return (
        <div className={styles.submitContainer}>
            <ToolFormHeader 
                title="Edit Listing" 
                subtitle={formData.name}
                onBack={() => navigate('/dashboard')}
                breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Edit Tool' }]}
                isEdit={true}
            />

            <div className={styles.submitWrapper}>
                <form onSubmit={handleSubmit} className={styles.submitForm}>
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
                        setImagePreview={setImagePreview}
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
                        saving={saving} 
                        uploading={uploading} 
                        onCancel={() => navigate('/dashboard')} 
                        submitText="Update Tool & Review"
                    />
                </form>
            </div>
        </div>
    );
};

export default EditTool;
