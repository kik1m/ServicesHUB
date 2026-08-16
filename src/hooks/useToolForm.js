import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    
    const userId = user?.id;
    const userRole = user?.role;

    // UI States
    const [currentStep, setCurrentStep] = useState(1);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFetchingInitialData, setIsFetchingInitialData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    // Dirty Check: Track original data to detect real changes
    const originalDataRef = useRef(null);

    // Data States
    const [categories, setCategories] = useState([]);
    const [isLimitReached, setIsLimitReached] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [useManualUrl, setUseManualUrl] = useState(false);

    const [formData, setFormData] = useState(() => {
        if (mode === 'submit') {
            const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
            return saved ? JSON.parse(saved) : {
                name: '', url: '', short_description: '', description: '',
                category_id: '', pricing_type: 'Free', pricing_details: '', pricing_details_full: '',
                image_url: '', features: [], use_cases: [],
                content_sections: [{ title: 'Overview', contentText: '' }, { title: 'Innovation', contentText: '' }, { title: 'Impact', contentText: '' }],
                pricing_plans: [{ name: 'Freemium', features: [''] }]
            };
        }
        return {
            name: '', url: '', short_description: '', description: '',
            category_id: '', pricing_type: 'Free', pricing_details: '', pricing_details_full: '',
            image_url: '', features: [], use_cases: [], is_approved: false,
            content_sections: [],
            pricing_plans: []
        };
    });

    const hasInitializedRef = useRef(false);
    const previousIdRef = useRef(id);

    // 1. Initial Data Fetching & Authorization
    useEffect(() => {
        const initialize = async () => {
            if (authLoading) return;
            if (!userId) {
                router.push('/auth');
                return;
            }

            // Prevent re-fetching if already initialized for the same tool ID (fixes tab-switch reload bug)
            if (hasInitializedRef.current && previousIdRef.current === id) {
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
                    const isReached = await toolsService.checkSubmissionLimit(userId);
                    setIsLimitReached(isReached);
                    if (catData?.length > 0 && !formData.category_id) {
                        setFormData(prev => ({ ...prev, category_id: catData[0].id }));
                    }
                    hasInitializedRef.current = true;
                    previousIdRef.current = id;
                } else {
                    // Fetch Tool Data for Edit Mode
                    const { data: tool, error: toolErr } = await toolsService.getToolByIdOrSlug(id);
                    if (toolErr) throw toolErr;

                    // Auth Check
                    if (tool.user_id !== userId && userRole !== 'admin') {
                        throw new Error('Unauthorized access to this tool');
                    }

                    // Parse existing description into sections if formatted
                    let initialSections = [{ title: 'Overview', contentText: '' }, { title: 'Innovation', contentText: '' }, { title: 'Impact', contentText: '' }];
                    if (tool.description) {
                        try {
                            if (tool.description.includes('[TITLE]')) {
                                const rawSections = tool.description.split('[TITLE]').filter(Boolean);
                                initialSections = rawSections.map(sec => {
                                    const parts = sec.split('[CONTENT]');
                                    return { title: parts[0]?.trim(), contentText: parts[1]?.trim() || '' };
                                });
                            }
                        } catch (e) {
                            // fallback
                        }
                    }

                    // Parse existing pricing plans
                    let initialPlans = [{ name: 'Freemium', features: [''] }];
                    if (tool.pricing_details_full) {
                        try {
                            const planParts = tool.pricing_details_full.split('[SPLIT]');
                            initialPlans = planParts.map(part => {
                                const planMatch = part.match(/\[(.*?)\]/);
                                const name = planMatch ? planMatch[1] : 'Plan';
                                const remainingText = part.replace(/\[.*?\]/, '').trim();
                                const features = remainingText.split('|').map(f => f.trim()).filter(Boolean);
                                return { name, features: features.length > 0 ? features : [''] };
                            });
                        } catch (e) {
                            // fallback
                        }
                    }

                    const toolSnapshot = {
                        name: tool.name,
                        url: tool.url,
                        short_description: tool.short_description,
                        description: tool.description,
                        category_id: tool.category_id,
                        pricing_type: tool.pricing_type,
                        pricing_details: tool.pricing_details || '',
                        pricing_details_full: tool.pricing_details_full || '',
                        features: tool.features || [],
                        use_cases: tool.use_cases || [],
                        image_url: tool.image_url,
                        is_approved: tool.is_approved,
                        content_sections: initialSections,
                        pricing_plans: initialPlans
                    };
                    // Store a deep copy of the original data for dirty checking
                    originalDataRef.current = JSON.parse(JSON.stringify(toolSnapshot));
                    setFormData(toolSnapshot);
                    setImagePreview(tool.image_url);
                    if (tool.image_url && !tool.image_url.includes('supabase.co')) {
                        setUseManualUrl(true);
                    }
                    hasInitializedRef.current = true;
                    previousIdRef.current = id;
                }
            } catch (err) {
                setError(err.message);
                showToast(err.message, 'error');
            } finally {
                setIsFetchingInitialData(false);
            }
        };

        initialize();
    }, [id, userId, userRole, authLoading, router, mode, formData.category_id, showToast]);

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
            
            let tempDesc = formData.description || '';
            if (formData.content_sections && formData.content_sections.length > 0) {
                tempDesc = formData.content_sections
                    .filter(sec => sec.title?.trim() || sec.contentText?.trim())
                    .map(sec => `[TITLE]${sec.title?.trim() || 'Section'}[CONTENT]${sec.contentText?.trim() || ''}`)
                    .join('\n\n');
            }
            
            if (!tempDesc || tempDesc.length < rules.fullDesc.min) errors.description = rules.fullDesc.error;
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

    // 5.2 Content Sections Logic
    const handleSectionChange = useCallback((index, field, value) => {
        setFormData(prev => {
            const newSections = [...(prev.content_sections || [])];
            newSections[index] = { ...newSections[index], [field]: value };
            return { ...prev, content_sections: newSections };
        });
    }, []);

    const addSection = useCallback(() => {
        setFormData(prev => ({ ...prev, content_sections: [...(prev.content_sections || []), { title: '', contentText: '' }] }));
    }, []);

    const removeSection = useCallback((index) => {
        setFormData(prev => ({ ...prev, content_sections: (prev.content_sections || []).filter((_, i) => i !== index) }));
    }, []);

    // 5.3 Pricing Plans Logic
    const handlePlanChange = useCallback((planIndex, field, value) => {
        setFormData(prev => {
            const newPlans = [...(prev.pricing_plans || [])];
            newPlans[planIndex] = { ...newPlans[planIndex], [field]: value };
            return { ...prev, pricing_plans: newPlans };
        });
    }, []);

    const handlePlanFeatureChange = useCallback((planIndex, featureIndex, value) => {
        setFormData(prev => {
            const newPlans = JSON.parse(JSON.stringify(prev.pricing_plans || [])); // deep copy
            if (newPlans[planIndex]) {
                newPlans[planIndex].features[featureIndex] = value;
            }
            return { ...prev, pricing_plans: newPlans };
        });
    }, []);

    const addPlan = useCallback(() => {
        setFormData(prev => ({ ...prev, pricing_plans: [...(prev.pricing_plans || []), { name: '', features: [''] }] }));
    }, []);

    const removePlan = useCallback((planIndex) => {
        setFormData(prev => ({ ...prev, pricing_plans: (prev.pricing_plans || []).filter((_, i) => i !== planIndex) }));
    }, []);

    const addPlanFeature = useCallback((planIndex) => {
        setFormData(prev => {
            const newPlans = JSON.parse(JSON.stringify(prev.pricing_plans || []));
            if (newPlans[planIndex]) {
                newPlans[planIndex].features.push('');
            }
            return { ...prev, pricing_plans: newPlans };
        });
    }, []);

    const removePlanFeature = useCallback((planIndex, featureIndex) => {
        setFormData(prev => {
            const newPlans = JSON.parse(JSON.stringify(prev.pricing_plans || []));
            if (newPlans[planIndex]) {
                newPlans[planIndex].features = newPlans[planIndex].features.filter((_, i) => i !== featureIndex);
            }
            return { ...prev, pricing_plans: newPlans };
        });
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

        // Prepare finalized string fields before submitting
        const finalizedData = { ...formData };
        
        // 1. Serialize Description
        if (finalizedData.content_sections && finalizedData.content_sections.length > 0) {
            const serializedDesc = finalizedData.content_sections
                .filter(sec => sec.title?.trim() || sec.contentText?.trim())
                .map(sec => `[TITLE]${sec.title?.trim() || 'Section'}[CONTENT]${sec.contentText?.trim() || ''}`)
                .join('\n\n');
            if (serializedDesc) {
                finalizedData.description = serializedDesc;
            }
        }

        // 2. Serialize Pricing Plans
        if (finalizedData.pricing_plans && finalizedData.pricing_plans.length > 0) {
            const serializedPlans = finalizedData.pricing_plans
                .filter(plan => plan.name?.trim() || plan.features?.some(f => f.trim()))
                .map(plan => {
                    const name = plan.name?.trim() || 'Plan';
                    const features = plan.features.filter(f => f.trim()).join(' | ');
                    return `[${name}] ${features}`;
                })
                .join(' [SPLIT] ');
            
            if (serializedPlans) {
                finalizedData.pricing_details_full = serializedPlans;
            }
        }

        setIsSubmitting(true);
        try {
            if (mode === 'submit') {
                const { submitToolAction } = await import('../actions/submitToolAction');
                const result = await submitToolAction({ ...finalizedData, user_id: userId }, 'submit');
                
                if (!result.success) throw new Error(result.error);

                await sendNotification(
                    userId,
                    'Submission Successfully Logged!',
                    `We've received your request for "${formData.name}". Our curators will review it for elite quality standards within 24-48 hours.`,
                    'info'
                );
                localStorage.removeItem(STORAGE_KEY);
                setIsSuccess(true);
            } else {
                // Dirty Check: Compare current form data with original snapshot
                const orig = originalDataRef.current;
                const COMPARABLE_FIELDS = ['name', 'url', 'short_description', 'description', 'category_id', 'pricing_type', 'pricing_details', 'pricing_details_full', 'image_url'];
                const hasFieldChanges = orig && COMPARABLE_FIELDS.some(k => (formData[k] || '').toString().trim() !== (orig[k] || '').toString().trim());
                const hasFeaturesChanges = orig && JSON.stringify(formData.features || []) !== JSON.stringify(orig.features || []);
                const hasUseCasesChanges = orig && JSON.stringify(formData.use_cases || []) !== JSON.stringify(orig.use_cases || []);

                if (orig && !hasFieldChanges && !hasFeaturesChanges && !hasUseCasesChanges) {
                    showToast('No changes detected. Your tool data is already up to date.', 'info');
                    router.push('/dashboard');
                    return;
                }

                const isApproved = finalizedData.is_approved;
                const { submitToolAction } = await import('../actions/submitToolAction');
                const result = await submitToolAction(finalizedData, 'edit', id);
                
                if (!result.success) throw new Error(result.error);

                await sendNotification(
                    userId,
                    'Modifications Received',
                    `The updates for "${formData.name}" have been submitted for review. They will appear live once verified.`,
                    'info'
                );
                showToast(isApproved ? 'Submitted for review!' : 'Updated successfully!', 'success');
                router.push('/dashboard');
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
            pricing_details: '', pricing_details_full: '', image_url: '', features: [], use_cases: [],
            content_sections: [{ title: 'Overview', contentText: '' }, { title: 'Innovation', contentText: '' }, { title: 'Impact', contentText: '' }],
            pricing_plans: [{ name: 'Freemium', features: [''] }]
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
        handleSectionChange, addSection, removeSection,
        handlePlanChange, handlePlanFeatureChange, addPlan, removePlan, addPlanFeature, removePlanFeature,
        handleFileChange, handleSubmit, setImagePreview,
        currentStep, nextStep, prevStep, goToStep, error, resetForm, router
    };
};
