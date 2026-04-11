import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { sendNotification } from '../utils/notifications';

/**
 * Hook for managing Success page logic and side effects
 */
export const useSuccessData = () => {
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Ref to prevent double execution in Strict Mode or re-renders
    const hasRun = useRef(false);
    
    const type = searchParams.get('type');
    const toolName = searchParams.get('toolName');

    const handleSuccessEffect = useCallback(async () => {
        // 1. Wait for auth to settle
        if (authLoading) return;

        // 2. Prevent double execution
        if (hasRun.current) return;

        // 3. Validation: If no type is provided, this might be an invalid access
        if (!type) {
            setLoading(false);
            // Optional: navigate('/') if you want to force valid access
            return;
        }

        hasRun.current = true;

        // Visual feedback
        const message = type === 'account_premium'
            ? 'Premium account activated'
            : `Promotion activated for ${toolName || 'your tool'}`;

        const notifBody = type === 'account_premium'
            ? 'Congratulations. Your lifetime premium membership is now active.'
            : `Your tool "${toolName || 'the tool'}" is now featured on the homepage.`;

        if (user) {
            try {
                await sendNotification(user.id, message, notifBody, 'subscription');
                showToast(message, 'success');
            } catch (error) {
                console.error('Error sending success notification:', error);
            }
        }
        
        setLoading(false);
    }, [user, authLoading, showToast, toolName, type]);

    useEffect(() => {
        handleSuccessEffect();
    }, [handleSuccessEffect]);

    return {
        loading,
        type,
        toolName,
        user
    };
};
