/**
 * Service for handling contact form submissions
 */
export const contactService = {
    /**
     * Submit a contact message
     * @param {Object} formData - The contact form data
     */
    async submitMessage(formData) {
        // Placeholder for real API/Supabase call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Contact form submitted:', formData);
                resolve({ success: true, error: null });
            }, 1000);
        });
    }
};
