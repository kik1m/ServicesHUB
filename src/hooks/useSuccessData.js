import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { sendNotification } from '../utils/notifications';
import { useQueryClient } from '@tanstack/react-query';

import { lsPaymentService } from '../services/lsPaymentService';
import { promotionService } from '../services/promotionService';
import { SUCCESS_UI_CONSTANTS } from '../constants/successConstants';

/**
 * Hook for managing Success page logic and side effects
 */
export const useSuccessData = () => {
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const { types, getMessages } = SUCCESS_UI_CONSTANTS;
    
    // Ref to prevent double execution in Strict Mode or re-renders
    const hasRun = useRef(false);
    
    const type = searchParams.get('type') || types.PROMOTION;
    const tierId = searchParams.get('tierId') || 'pro';
    const [toolName, setToolName] = useState(searchParams.get('toolName') || '');
    const toolId = searchParams.get('toolId');
    const shouldSync = searchParams.get('sync') === 'true';

    const handleSuccessEffect = useCallback(async () => {
        // 1. Wait for auth to settle
        if (authLoading) return;

        // 2. Prevent double execution
        if (hasRun.current) return;

        hasRun.current = true;

        let resolvedToolName = toolName;

        // 🚀 Fetch real tool name if missing (Rule #101)
        if (toolId && !resolvedToolName) {
            setLoading(true);
            try {
                const name = await promotionService.fetchToolName(toolId);
                if (name) {
                    resolvedToolName = name;
                    setToolName(name);
                }
            } catch (e) {
                console.error('Failed to fetch tool name:', e);
            }
        }

        // 3. Get localized content dynamically
        const isPremium = type === types.PREMIUM;
        const content = getMessages(type, tierId, resolvedToolName);

        if (user) {
            try {
                // 🚀 Rule #99: Fallback Sync for Localhost
                if (shouldSync) {
                    console.log('🔄 Initiating local payment sync...');
                    await lsPaymentService.syncLocalPayment({
                        userId: user.id,
                        itemType: type,
                        toolId: toolId,
                        tierId: tierId
                    });
                }
                
                // 🚀 Invalidate Profile Cache to update UI (Premium Badge, Tier, etc) instantly
                queryClient.invalidateQueries({ queryKey: ['profile', user.id] });

                // 🔔 Persistent Notification
                const finalNotif = content.notification;

                await sendNotification(user.id, content.toast, finalNotif, 'subscription');
                showToast(content.toast, 'success');

                // 📧 Elite Email Delivery
                const planName = isPremium ? (tierId === 'elite' ? 'Elite Tier' : 'Pro Tier') : (toolId ? 'Featured' : 'Promotion');
                
                await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: user.email,
                        subject: isPremium ? 'Welcome to HUBly Premium 💎' : 'Promotion Activated 🚀',
                        type: isPremium ? 'premium_upgrade' : 'subscription_success',
                        data: {
                            userName: user.user_metadata?.full_name || user.email.split('@')[0],
                            toolName: resolvedToolName,
                            planName: planName
                        }
                    })
                });

            } catch (error) {
                console.error('Error in success flow:', error);
            }
        }
        
        setLoading(false);
    }, [user, authLoading, showToast, toolName, toolId, type, tierId, types, getMessages, shouldSync, queryClient]);

    useEffect(() => {
        handleSuccessEffect();
    }, [handleSuccessEffect]);

    return {
        loading,
        type,
        toolName,
        tierId,
        user
    };
};
