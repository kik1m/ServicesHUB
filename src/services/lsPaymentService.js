import axios from 'axios';

/**
 * Service for handling Lemon Squeezy payments and checkouts.
 */
export const lsPaymentService = {
    /**
     * Creates a Lemon Squeezy checkout session.
     * @param {Object} params - Checkout parameters.
     * @returns {Promise<Object>} The checkout session data including the URL.
     */
    async createCheckout(params) {
        const { data } = await axios.post('/api/create-ls-checkout', {
            userId: params.userId,
            itemType: params.itemType,
            planName: params.planName,
            toolId: params.toolId,
            variantId: params.variantId,
            tierId: params.tierId
        });
        
        return data;
    },

    /**
     * Synchronizes a payment manually (fallback for localhost/webhook delays).
     */
    async syncLocalPayment(params) {
        const { data } = await axios.post('/api/sync-payment', {
            userId: params.userId,
            itemType: params.itemType,
            toolId: params.toolId,
            tierId: params.tierId
        });
        return data;
    }
};
