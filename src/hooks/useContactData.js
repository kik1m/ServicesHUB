import { useState, useCallback } from 'react';
import { contactService } from '../services/contactService';
import { useToast } from '../context/ToastContext';
import { CONTACT_UI_CONSTANTS } from '../constants/contactConstants';

/**
 * useContactData - Elite Logic Layer
 * Rule #1: Full Logic Isolation
 * Rule #14: Constants SSOT
 */
export const useContactData = () => {
    const { showToast } = useToast();
    const { form } = CONTACT_UI_CONSTANTS;
    
    // Instant render for static-base pages
    const [submitting, setSubmitting] = useState(false);
    const [subject, setSubject] = useState(form.fields.subject.options[0].value);

    const handleFormSubmit = useCallback(async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const { success, error } = await contactService.submitMessage({ ...data, subject });
            
            if (success) {
                showToast(form.messages.success, 'success');
                e.target.reset();
                setSubject(form.fields.subject.options[0].value);
            } else {
                throw error;
            }
        } catch (err) {
            showToast(form.messages.error, 'error');
            console.error('Contact submission error:', err);
        } finally {
            setSubmitting(false);
        }
    }, [subject, showToast, form]);

    return {
        loading: false, // Instant render
        submitting,
        subject,
        setSubject,
        handleFormSubmit
    };
};
