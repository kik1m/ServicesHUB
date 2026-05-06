import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { toolsService } from '../services/toolsService';
import { categoriesService } from '../services/categoriesService';
import { storageService } from '../services/storageService';
import { sendNotification } from '../utils/notifications';
import { SUBMIT_TOOL_CONSTANTS } from '../constants/toolFormConstants';

const STORAGE_KEY = 'hubly_tool_submission_draft';

/**
 * Unified Hook for Tool Creation and Editing
 * Elite Standard v3.0
 * Rule #11: Single Responsibility Logic
 * Rule #12: Strategic Persistence
 * Rule #27: Isolated Validation
 */
export const useToolForm = ({ mode = 'submit' } = {}) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();

    // UI States
    const [currentStep, setCurrentStep] = useState(1);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFetchingInitialData, setIsFetchingInitialData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    // Data States
    const [categories, setCategories] = useState([]);
    const [isLimitReached, setIsLimitReached] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [useManualUrl, setUseManualUrl] = useState(false);

    const [formData, setFormData] = useState(() => {
        if (mode === 'submit') {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : {
                name: '', url: '', short_description: '', description: '',
                category_id: '', pricing_type: 'Free', pricing_details: '',
                image_url: '', features: [], use_cases: []
            };
        }
        return {
            name: '', url: '', short_description: '', description: '',
            category_id: '', pricing_type: 'Free', pricing_details: '',
            image_url: '', features: [], use_cases: [], is_approved: false
        };
    });

    // 1. Initial Data Fetching & Authorization
    useEffect(() => {
        const initialize = async () => {
            if (authLoading) return;
            if (!user) {
                navigate('/auth');
                return;
            }

            setIsFetchingInitialData(true);
            setError(null);
            try {
                // Fetch Categories (Shared)
                const { data: catData } = await categoriesService.getAllCategories();
                setCategories(catData || []);

                if (mode === 'submit') {
                    // Check Limits for Submit Mode
                    const isReached = await toolsService.checkSubmissionLimit(user.id);
                    setIsLimitReached(isReached);
                    if (catData?.length > 0 && !formData.category_id) {
                        setFormData(prev => ({ ...prev, category_id: catData[0].id }));
                    }
                } else {
                    // Fetch Tool Data for Edit Mode
                    const { data: tool, error: toolErr } = await toolsService.getToolByIdOrSlug(id);
                    if (toolErr) throw toolErr;

                    // Auth Check
                    if (tool.user_id !== user.id && user.role !== 'admin') {
                        throw new Error('Unauthorized access to this tool');
                    }

                    setFormData({
                        name: tool.name,
                        url: tool.url,
                        short_description: tool.short_description,
                        description: tool.description,
                        category_id: tool.category_id,
                        pricing_type: tool.pricing_type,
                        pricing_details: tool.pricing_details || '',
                        features: tool.features || [],
                        use_cases: tool.use_cases || [],
                        image_url: tool.image_url,
                        is_approved: tool.is_approved
                    });
                    setImagePreview(tool.image_url);
                    if (tool.image_url && !tool.image_url.includes('supabase.co')) {
                        setUseManualUrl(true);
                    }
                }
            } catch (err) {
                setError(err.message);
                showToast(err.message, 'error');
            } finally {
                setIsFetchingInitialData(false);
            }
        };

        initialize();
    }, [id, user, authLoading, navigate, mode]);

    // 2. Draft Persistence (Submit Mode Only)
    useEffect(() => {
        if (mode === 'submit' && formData && !isSuccess) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        }
    }, [formData, isSuccess, mode]);

    // 3. Validation Logic (Rule #27)
    const validateStep = (step) => {
        const errors = {};
        const rules = SUBMIT_TOOL_CONSTANTS.validation;

        if (step === 1) {
            if (!formData.name || formData.name.length < rules.name.min) errors.name = rules.name.error;
            if (!formData.url) errors.url = rules.url.error;
            if (!formData.category_id) errors.category_id = rules.category.error;
        }
        if (step === 2) {
            if (!formData.short_description || formData.short_description.length < rules.shortDesc.min) errors.short_description = rules.shortDesc.error;
            if (!formData.description || formData.description.length < rules.fullDesc.min) errors.description = rules.fullDesc.error;
            if (!formData.image_url) errors.image_url = rules.image.error;
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // 4. Navigation Handlers
    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            showToast(SUBMIT_TOOL_CONSTANTS.notifications.validationError, 'error');
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToStep = (step) => {
        if (step < currentStep || (step > currentStep && validateStep(currentStep))) {
            setCurrentStep(step);
        }
    };

    // 5. Dynamic Features Logic
    const handleFeatureChange = useCallback((index, value) => {
        setFormData(prev => {
            const newFeatures = [...prev.features];
            newFeatures[index] = value;
            return { ...prev, features: newFeatures };
        });
    }, []);

    const addFeature = useCallback(() => {
        setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
    }, []);

    const removeFeature = useCallback((index) => {
        setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
    }, []);

    // 5.1 Use Cases Logic
    const handleUseCaseChange = useCallback((index, value) => {
        setFormData(prev => {
            const newUseCases = [...(prev.use_cases || [])];
            newUseCases[index] = value;
            return { ...prev, use_cases: newUseCases };
        });
    }, []);

    const addUseCase = useCallback(() => {
        setFormData(prev => ({ ...prev, use_cases: [...(prev.use_cases || []), ''] }));
    }, []);

    const removeUseCase = useCallback((index) => {
        setFormData(prev => ({ ...prev, use_cases: (prev.use_cases || []).filter((_, i) => i !== index) }));
    }, []);

    // 6. Media Upload Logic
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);

        setIsUploading(true);
        try {
            const publicUrl = await storageService.uploadToolImage(file);
            setFormData(prev => ({ ...prev, image_url: publicUrl }));
            showToast('Image uploaded successfully!', 'success');
        } catch (err) {
            showToast(err.message || 'Upload failed', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    // 7. Final Submission Logic
    const handleSubmit = async (e) => {
        if (e?.preventDefault) e.preventDefault();

        if (mode === 'submit' && isLimitReached) {
            showToast(SUBMIT_TOOL_CONSTANTS.notifications.limitReached, 'warning');
            return;
        }

        if (!validateStep(1) || !validateStep(2)) {
            showToast(SUBMIT_TOOL_CONSTANTS.notifications.validationError, 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            if (mode === 'submit') {
                const { error: submitErr } = await toolsService.createTool({ ...formData, user_id: user.id });
                if (submitErr) throw submitErr;

                await sendNotification(
                    user.id,
                    'Submission Successfully Logged!',
                    `We've received your request for "${formData.name}". Our curators will review it for elite quality standards within 24-48 hours.`,
                    'info'
                );
                localStorage.removeItem(STORAGE_KEY);
                setIsSuccess(true);
            } else {
                const isApproved = formData.is_approved;
                const { error: updateErr } = await toolsService.updateTool(id, formData, isApproved);
                if (updateErr) throw updateErr;

                await sendNotification(
                    user.id,
                    'Modifications Received',
                    `The updates for "${formData.name}" have been submitted for review. They will appear live once verified.`,
                    'info'
                );
                showToast(isApproved ? 'Submitted for review!' : 'Updated successfully!', 'success');
                navigate('/dashboard');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError(err.message);
            showToast(`Operation failed: ${err.message}`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setFormData({
            name: '', url: '', short_description: '', description: '',
            category_id: categories[0]?.id || '', pricing_type: 'Free',
            pricing_details: '', image_url: '', features: [], use_cases: []
        });
        setImagePreview(null);
        setCurrentStep(1);
        setIsSuccess(false);
    }, [categories]);

    return {
        formData, setFormData, categories, isFetchingInitialData, isSubmitting,
        isUploading, isSuccess, isLimitReached, fieldErrors, imagePreview,
        useManualUrl, setUseManualUrl, addFeature, removeFeature,
        handleFeatureChange, handleUseCaseChange, addUseCase, removeUseCase,
        handleFileChange, handleSubmit, setImagePreview,
        currentStep, nextStep, prevStep, goToStep, error, resetForm
    };
};
