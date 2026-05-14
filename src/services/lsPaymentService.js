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
            variantId: params.variantId // Required from LS Dashboard
        });
        
        return data;
    }
};
