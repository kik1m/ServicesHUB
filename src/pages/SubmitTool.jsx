import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { sendNotification } from '../utils/notifications';
import useSEO from '../hooks/useSEO';

// Import Modular Components
import SubmitSuccess from '../components/SubmitTool/SubmitSuccess';
import ToolFormHeader from '../components/ToolForm/ToolFormHeader';
import ToolFormBasicInfo from '../components/ToolForm/ToolFormBasicInfo';
import ToolFormMedia from '../components/ToolForm/ToolFormMedia';
import ToolFormFeatures from '../components/ToolForm/ToolFormFeatures';
import ToolFormActions from '../components/ToolForm/ToolFormActions';

// Import Modular CSS
import '../styles/pages/SubmitTool.css';

const SubmitTool = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();

    useSEO({
        title: "Submit New Tool - HUBly",
        description: "Join the ultimate directory for modern AI and SaaS tools.",
        url: typeof window !== 'undefined' ? window.location.href : ''
    });

    // States
    const [isSuccess, setIsSuccess] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [toolCount, setToolCount] = useState(0);
    const [isLimitReached, setIsLimitReached] = useState(false);
    const [useManualUrl, setUseManualUrl] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const [formData, setFormData] = useState({
        name: '', url: '', short_description: '', description: '',
        category_id: '', pricing_type: 'Free', pricing_details: '',
        image_url: '', features: []
    });

    useEffect(() => {
        const checkLimitAndFetch = async () => {
            if (authLoading) return;
            if (!user) { navigate('/auth'); return; }

            setIsLoading(true);
            try {
                const { data: catData } = await supabase.from('categories').select('*').order('name');
                setCategories(catData || []);
                if (catData?.length > 0) setFormData(prev => ({ ...prev, category_id: catData[0].id }));

                const { data: profile } = await supabase.from('profiles').select('is_premium').eq('id', user.id).single();
                const { count } = await supabase.from('tools').select('*', { count: 'exact', head: true }).eq('user_id', user.id);

                setToolCount(count || 0);
                if ((count || 0) >= 2 && !profile?.is_premium) setIsLimitReached(true);
            } catch (err) {
                console.error('Initial Fetch Error:', err);
            } finally {
                setIsLoading(false);
            }
        };
        checkLimitAndFetch();
    }, [user, authLoading, navigate]);

    // Dynamic Features Logic
    const handleFeatureChange = (index, value) => {
        const newFeatures = [...(formData.features || [])];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        setFormData(prev => ({ 
            ...prev, 
            features: [...(prev.features || []), ''] 
        }));
    };

    const removeFeature = (index) => {
        setFormData(prev => ({ 
            ...prev, 
            features: (prev.features || []).filter((_, i) => i !== index) 
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) { showToast('File too large (Max 2MB)', 'error'); return; }

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
            const filePath = `tool-thumbnails/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('tool-images').upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('tool-images').getPublicUrl(filePath);
            setFormData(prev => ({ ...prev, image_url: publicUrl }));
            showToast('Image uploaded successfully!', 'success');
        } catch (err) {
            showToast('Failed to upload image', 'error');
        } finally {
            setUploading(false);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name || formData.name.length < 2) errors.name = "Name is too short";
        if (!formData.url) errors.url = "Website URL is required";
        if (!formData.short_description || formData.short_description.length < 10) errors.short_description = "Min 10 characters";
        if (!formData.description || formData.description.length < 50) errors.description = "Min 50 characters";
        if (!formData.category_id) errors.category_id = "Category required";
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLimitReached) { showToast('Submission limit reached. Upgrade to Premium!', 'warning'); return; }
        if (!validateForm()) { showToast('Please fix errors in the form.', 'error'); return; }

        setLoading(true);
        try {
            const slug = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const { error: submitError } = await supabase.from('tools').insert([{
                ...formData, slug, user_id: user.id, is_approved: false,
                rating: 5.0, reviews_count: 0, view_count: 0, created_at: new Date().toISOString()
            }]);

            if (submitError) throw submitError;

            await sendNotification(user.id, 'Submission Received', `Your request to add "${formData.name}" has been received.`, 'info');
            setIsSuccess(true);
            window.scrollTo(0, 0);
        } catch (err) {
            showToast(`Error: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) return (
        <div className="submit-container">
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
        <div className="submit-container">
            <ToolFormHeader 
                title="Submit New Tool" 
                subtitle="Join the ultimate directory for modern AI and SaaS tools."
                onBack={() => navigate('/dashboard')}
                breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Submit Tool' }]}
            />

            <form 
                onSubmit={handleSubmit} 
                className={`submit-wrapper submit-form ${isLimitReached ? 'limit-reached-lock' : ''}`}
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
                    saving={loading} 
                    uploading={uploading} 
                    onCancel={() => navigate('/dashboard')} 
                />
            </form>
        </div>
    );
};

export default SubmitTool;
