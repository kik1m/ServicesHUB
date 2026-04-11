import axios from 'axios';

/**
 * Service for handling premium account upgrades and billing operations.
 */
export const premiumService = {
    /**
     * Creates a Stripe checkout session for a premium account upgrade.
     * @param {string} userId - The ID of the user upgrading.
     * @returns {Promise<Object>} The checkout session data including the URL.
     */
    async createPremiumCheckout(userId) {
        const { data } = await axios.post('/api/create-checkout-session', {
            userId: userId,
            itemType: 'account_premium',
            planName: 'Lifetime Premium',
            priceAmount: 120
        });
        
        return data;
    }
};
