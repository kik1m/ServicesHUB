import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { lsPaymentService } from '../services/lsPaymentService';
import { PREMIUM_UI_CONSTANTS } from '../constants/premiumConstants';

/**
 * usePremiumData - Elite Logic Layer
 * Rule #1: Logic Isolation
 * Rule #14: Constants SSOT
 */
export const usePremiumData = () => {
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { messages, plans } = PREMIUM_UI_CONSTANTS;

    const handleUpgrade = async (variantId) => {
        if (!user) {
            router.push('/auth');
            return;
        }

        setLoading(true);
        try {
            const plan = plans.find(p => p.variantId === variantId);
            
            const data = await lsPaymentService.createCheckout({
                userId: user.id,
                itemType: 'account_premium',
                planName: plan?.planName || 'Premium Plan',
                variantId: variantId,
                tierId: plan?.id || 'pro'
            });

            if (data?.url) {
                showToast(messages.successRedirect, 'success');
                // Rule #41: Smooth transition to external gateway
                setTimeout(() => {
                    window.location.href = data.url;
                }, 800);
            } else {
                throw new Error('No checkout URL');
            }
        } catch (err) {
            console.error('Premium checkout error:', err);
            showToast(messages.error, 'error');
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        authLoading,
        loading,
        handleUpgrade
    };
};
