import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { sendNotification } from '../utils/notifications';
import { Loader2 } from 'lucide-react';

// Import Modular Components
import ToolFormHeader from '../components/ToolForm/ToolFormHeader';
import ToolFormBasicInfo from '../components/ToolForm/ToolFormBasicInfo';
import ToolFormMedia from '../components/ToolForm/ToolFormMedia';
import ToolFormFeatures from '../components/ToolForm/ToolFormFeatures';
import ToolFormActions from '../components/ToolForm/ToolFormActions';

// Import Unified CSS
import '../styles/Pages/SubmitTool.css';

const EditTool = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    
    // States
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [useManualUrl, setUseManualUrl] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        image_url: '',
        is_approved: false
    });

    useEffect(() => {
        const fetchData = async () => {
            if (authLoading) return;
            if (!user) {
                navigate('/auth');
                return;
            }

            setLoading(true);
            try {
                const { data: catData } = await supabase.from('categories').select('*').order('name');
                setCategories(catData || []);

                const { data: tool, error: toolError } = await supabase
                    .from('tools')
                    .select('*, categories(name)')
                    .or(`id.eq.${id},slug.eq.${id}`)
                    .single();

                if (toolError) throw toolError;

                // Security Check
                if (tool.user_id !== user.id) {
                    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
                    if (profile?.role !== 'admin') {
                        throw new Error('Unauthorized');
                    }
                }

                setFormData({
                    name: tool.name,
                    short_description: tool.short_description,
                    description: tool.description,
                    category_id: tool.category_id,
                    url: tool.url,
                    pricing_type: tool.pricing_type,
                    pricing_details: tool.pricing_details || '',
                    features: tool.features || [],
                    image_url: tool.image_url,
                    is_approved: tool.is_approved
                });
                setImagePreview(tool.image_url);
                if (tool.image_url && !tool.image_url.includes('supabase.co')) {
                    setUseManualUrl(true);
                }
            } catch (err) {
                console.error('Fetch error:', err);
                showToast('Failed to load tool data', 'error');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate, user, authLoading, showToast]);

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

        if (file.size > 2 * 1024 * 1024) {
            showToast('File too large (Max 2MB)', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
            const filePath = `tool-thumbnails/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('tool-images')
                .upload(filePath, file, { cacheControl: '3600', upsert: false });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('tool-images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
            showToast('Image uploaded!', 'success');
        } catch (err) {
            console.error('Upload failed:', err);
            showToast(`Upload failed: ${err.message}`, 'error');
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
        if (!validateForm()) {
            showToast('Check for errors in the form.', 'error');
            return;
        }

        setSaving(true);
        try {
            const isApproved = formData.is_approved;
            let updatePayload = {};

            if (isApproved) {
                updatePayload = {
                    pending_changes: {
                        ...formData,
                        updated_at: new Date().toISOString()
                    }
                };
            } else {
                updatePayload = {
                    ...formData,
                    is_approved: false, 
                    updated_at: new Date().toISOString()
                };
            }

            const { error: updateError } = await supabase
                .from('tools')
                .update(updatePayload)
                .eq('id', id);

            if (updateError) throw updateError;
            
            await sendNotification(
                user.id, 
                'Update Under Review', 
                `The modifications for "${formData.name}" have been submitted for moderation. The live listing will remain unchanged until these updates are approved by our team.`, 
                'pending'
            );
            
            const successMsg = isApproved 
                ? 'Changes submitted for review. The live version remains visible!' 
                : 'Tool updated and pending initial review!';
                
            showToast(successMsg, 'success');
            navigate('/dashboard');
        } catch (err) {
            console.error('Update Error:', err);
            showToast(`Save failed: ${err.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="submit-container" style={{ minHeight: '80vh', justifyContent: 'center' }}>
            <Loader2 className="animate-spin text-primary" size={40} />
        </div>
    );

    return (
        <div className="submit-container">
            <ToolFormHeader 
                title="Edit Listing" 
                subtitle={formData.name}
                onBack={() => navigate('/dashboard')}
                breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Edit Tool' }]}
            />

            <form onSubmit={handleSubmit} className="submit-wrapper submit-form">
                
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
                />
                
            </form>
        </div>
    );
};

export default EditTool;
