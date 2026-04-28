/**
 * SUCCESS_UI_CONSTANTS
 * Rule #14: Centralized UI labels for Success Page
 */
export const SUCCESS_UI_CONSTANTS = {
    types: {
        PREMIUM: 'account_premium',
        PROMOTION: 'tool_promotion'
    },
    messages: {
        premium: {
            title: "Success!",
            description: "Congratulations! Your account has been upgraded to Premium for life. Enjoy full access to all exclusive features.",
            toast: "Premium account activated",
            notification: "Congratulations. Your lifetime premium membership is now active."
        },
        promotion: {
            title: "Success!",
            description: "Your tool is now successfully promoted. It will be featured on our platform according to your selected plan.",
            toast: "Promotion activated",
            notification: "Your tool promotion is now active and featured on the homepage."
        }
    },
    actions: {
        dashboard: "Go to Dashboard",
        explore: "Explore Tools"
    },
    SKELETON_COUNTS: {
        actions: [1, 2]
    }
};
