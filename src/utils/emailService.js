/**
 * HUBly Elite Email Service Utility
 * Rule #1: Logic Isolation
 * Rule #88: Unified API Communication
 */

/**
 * Send a dynamic email using the internal API
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.type - Template type ('welcome', 'tool_status', 'security_alert', 'new_review')
 * @param {Object} options.data - Dynamic data to inject into template
 */
export const sendEmail = async ({ to, subject, type, data }) => {
    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ to, subject, type, data }),
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to send email');
        }

        return { success: true, id: result.id };
    } catch (err) {
        console.error(`[Email Service Error - ${type}]:`, err);
        return { success: false, error: err.message };
    }
};

/**
 * Predefined Elite Email Triggers
 */
export const emailTriggers = {
    // 1. Welcome Email
    sendWelcome: (email, name) => sendEmail({
        to: email,
        subject: 'Welcome to the Elite AI Community! 🚀',
        type: 'welcome',
        data: { name }
    }),

    // 2. Tool Status Update (Approval/Rejection)
    sendToolStatus: (email, toolName, status, slug, feedback = '') => sendEmail({
        to: email,
        subject: `Update on your tool: ${toolName}`,
        type: 'tool_status',
        data: { toolName, status, slug, feedback }
    }),

    // 3. Security Alert
    sendSecurityAlert: (email, name, action, location = 'Unknown Device') => sendEmail({
        to: email,
        subject: 'Security Alert: Profile Update Detected',
        type: 'security_alert',
        data: { name, action, location }
    }),

    // 4. New Review Notification
    sendReviewNotification: (email, toolName, slug, rating, comment, userName) => sendEmail({
        to: email,
        subject: `New ${rating}-Star Review for ${toolName}`,
        type: 'new_review',
        data: { toolName, slug, rating, comment, userName }
    })
};
