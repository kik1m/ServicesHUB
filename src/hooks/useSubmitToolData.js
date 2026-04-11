import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toolsService } from '../services/toolsService';
import { storageService } from '../services/storageService';
import { categoriesService } from '../services/categoriesService';
import { sendNotification } from '../utils/notifications';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for managing the tool submission form logic
 */
export const useSubmitToolData = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();

    // UI States
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    // Data States
    const [categories, setCategories] = useState([]);
    const [isLimitReached, setIsLimitReached] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
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
        features: []
    });

    // Initial Data Fetching
    useEffect(() => {
        const checkLimitAndFetch = async () => {
            if (authLoading) return;
            if (!user) {
                navigate('/auth');
                return;
            }

            setIsLoading(true);
            try {
                // Fetch Categories
                const { data: catData } = await categoriesService.getAllCategories();
                setCategories(catData || []);
                if (catData?.length > 0) {
                    setFormData(prev => ({ ...prev, category_id: catData[0].id }));
                }

                // Check Submission Limit via Service
                const isReached = await toolsService.checkSubmissionLimit(user.id);
                setIsLimitReached(isReached);
            } catch (err) {
                console.error('SubmitTool Initialization Error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        checkLimitAndFetch();
    }, [user, authLoading, navigate]);

    // Features Management Logic
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

        // Local Preview
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

    // Validation Logic
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

    // Submission Logic
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (isLimitReached) {
            showToast('Submission limit reached. Upgrade to Premium!', 'warning');
            return;
        }

        if (!validateForm()) {
            showToast('Please fix errors in the form.', 'error');
            return;
        }

        setLoading(true);
        try {
            const { error } = await toolsService.createTool({
                ...formData,
                user_id: user.id
            });

            if (error) throw error;

            // Send notification
            await sendNotification(
                user.id, 
                'Submission Received', 
                `Your request to add "${formData.name}" has been received and is pending approval.`, 
                'info'
            );

            setIsSuccess(true);
            window.scrollTo(0, 0);
        } catch (err) {
            showToast(`Error: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    return {
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
        handleSubmit,
        setImagePreview
    };
};
