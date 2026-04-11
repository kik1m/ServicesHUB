import { useState, useCallback, useEffect } from 'react';
import { contactService } from '../services/contactService';
import { useToast } from '../context/ToastContext';

/**
 * Hook for managing the contact form state and submission logic
 */
export const useContactData = () => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [subject, setSubject] = useState('General Inquiry');

    // Simulate initial loading as in the original page
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleFormSubmit = useCallback(async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const { success, error } = await contactService.submitMessage({ ...data, subject });
            
            if (success) {
                showToast('Message sent! We will get back to you soon.', 'success');
                e.target.reset();
                setSubject('General Inquiry');
            } else {
                throw error;
            }
        } catch (err) {
            showToast('Failed to send message. Please try again.', 'error');
            console.error('Contact submission error:', err);
        } finally {
            setSubmitting(false);
        }
    }, [subject, showToast]);

    return {
        loading,
        submitting,
        subject,
        setSubject,
        handleFormSubmit
    };
};
