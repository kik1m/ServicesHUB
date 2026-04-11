import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { premiumService } from '../services/premiumService';

/**
 * Custom hook to manage logic and state for the Premium upgrade page.
 */
export const usePremiumData = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    /**
     * Handles the upgrade button click.
     * Redirects to auth if not logged in, otherwise initiates checkout.
     */
    const handleUpgrade = async () => {
        if (!user) {
            navigate('/auth');
            return;
        }

        setLoading(true);
        try {
            const data = await premiumService.createPremiumCheckout(user.id);

            if (data?.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL returned from server.');
            }
        } catch (err) {
            console.error('Upgrade orchestration error:', err);
            showToast('Failed to initiate checkout. Please try again.', 'error');
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
