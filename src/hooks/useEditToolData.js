import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { toolsService } from '../services/toolsService';
import { categoriesService } from '../services/categoriesService';
import { storageService } from '../services/storageService';
import { sendNotification } from '../utils/notifications';

/**
 * Custom hook for managing the tool edit logic
 */
export const useEditToolData = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    
    // UI States
    const [isLoading, setIsLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    
    // Data States
    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState('');
    const [useManualUrl, setUseManualUrl] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        short_description: '',
        description: '',
        category_id: '',
        pricing_type: 'Free',
        pricing_details: '',
        image_url: '',
        features: [],
        is_approved: false
    });

    useEffect(() => {
        const fetchData = async () => {
            if (authLoading) return;
            if (!user) {
                navigate('/auth');
                return;
            }

            setIsLoading(true);
            try {
                // Fetch Categories via Service
                const { data: catData } = await categoriesService.getAllCategories();
                setCategories(catData || []);

                // Fetch Tool Data via Service
                const { data: tool, error: toolError } = await toolsService.getToolByIdOrSlug(id);

                if (toolError) throw toolError;

                // Security Check: Only Owner or Admin (role is provided by AuthContext)
                if (tool.user_id !== user.id && user.role !== 'admin') {
                    throw new Error('Unauthorized access');
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
                
                // Determine if Image is manual URL
                if (tool.image_url && !tool.image_url.includes('supabase.co')) {
                    setUseManualUrl(true);
                }
            } catch (err) {
                console.error('EditTool Fetch error:', err);
                showToast(err.message || 'Failed to load tool data', 'error');
                navigate('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, navigate, user, authLoading]);

    // Features Logic
    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        setFormData(prev => ({ 
            ...prev, 
            features: [...prev.features, ''] 
        }));
    };

    const removeFeature = (index) => {
        setFormData(prev => ({ 
            ...prev, 
            features: prev.features.filter((_, i) => i !== index) 
        }));
    };

    // Image Upload Logic
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);

        setUploading(true);
        try {
            const publicUrl = await storageService.uploadToolImage(file);
            setFormData(prev => ({ ...prev, image_url: publicUrl }));
            showToast('Image uploaded successfully!', 'success');
        } catch (err) {
            showToast(err.message || 'Failed to upload image', 'error');
        } finally {
            setUploading(false);
        }
    };

    // Validation
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

    // Submit Changes
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        if (!validateForm()) {
            showToast('Please fix errors in the form.', 'error');
            return;
        }

        setSaving(true);
        try {
            const isApproved = formData.is_approved;

            // Use the centralized updateTool logic from the service
            const { error: updateError } = await toolsService.updateTool(id, formData, isApproved);

            if (updateError) throw updateError;
            
            await sendNotification(
                user.id, 
                'Update Under Review', 
                `The modifications for "${formData.name}" have been submitted for moderation.`, 
                'pending'
            );
            
            showToast(isApproved ? 'Changes submitted for review!' : 'Tool updated successfully!', 'success');
            navigate('/dashboard');
        } catch (err) {
            console.error('Update Error:', err);
            showToast(`Save failed: ${err.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    return {
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
    };
};
