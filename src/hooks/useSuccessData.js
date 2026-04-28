import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { sendNotification } from '../utils/notifications';

import { SUCCESS_UI_CONSTANTS } from '../constants/successConstants';

/**
 * Hook for managing Success page logic and side effects
 */
export const useSuccessData = () => {
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const [searchParams] = useSearchParams();
    const { types, messages } = SUCCESS_UI_CONSTANTS;
    
    // Ref to prevent double execution in Strict Mode or re-renders
    const hasRun = useRef(false);
    
    const type = searchParams.get('type') || types.PROMOTION;
    const toolName = searchParams.get('toolName');

    const handleSuccessEffect = useCallback(async () => {
        // 1. Wait for auth to settle
        if (authLoading) return;

        // 2. Prevent double execution
        if (hasRun.current) return;

        hasRun.current = true;

        // 3. Get localized content from SSOT
        const isPremium = type === types.PREMIUM;
        const content = isPremium ? messages.premium : messages.promotion;

        if (user) {
            try {
                const finalNotif = isPremium 
                    ? content.notification 
                    : content.notification.replace('Your tool', `Your tool "${toolName || 'the tool'}"`);

                await sendNotification(user.id, content.toast, finalNotif, 'subscription');
                showToast(content.toast, 'success');
            } catch (error) {
                console.error('Error sending success notification:', error);
            }
        }
        
        setLoading(false);
    }, [user, authLoading, showToast, toolName, type, types, messages]);

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
