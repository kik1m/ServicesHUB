import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { premiumService } from '../services/premiumService';
import { PREMIUM_UI_CONSTANTS } from '../constants/premiumConstants';

/**
 * usePremiumData - Elite Logic Layer
 * Rule #1: Logic Isolation
 * Rule #14: Constants SSOT
 */
export const usePremiumData = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { messages } = PREMIUM_UI_CONSTANTS;

    const handleUpgrade = async () => {
        if (!user) {
            navigate('/auth');
            return;
        }

        setLoading(true);
        try {
            const data = await premiumService.createPremiumCheckout(user.id);

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
        loading,
        handleUpgrade
    };
};
