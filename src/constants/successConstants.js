/**
 * SUCCESS_UI_CONSTANTS
 * Rule #14: Centralized UI labels for Success Page
 */
export const SUCCESS_UI_CONSTANTS = {
    types: {
        PREMIUM: 'account_premium',
        PROMOTION: 'tool_promotion'
    },
    getMessages: (type, tierId, toolName) => {
        if (type === 'account_premium') {
            const isElite = tierId === 'elite';
            return {
                title: "Payment Successful! 🎉",
                description: `Congratulations! Your account has been upgraded to the ${isElite ? 'Elite' : 'Pro'} tier. Enjoy your advanced AI features and higher limits.`,
                toast: "Subscription Activated",
                notification: `Congratulations! Your ${isElite ? 'Elite' : 'Pro'} subscription is now active.`
            };
        } else {
            return {
                title: "Payment Successful! 🎉",
                description: `Your tool ${toolName ? `"${toolName}"` : ''} is now successfully promoted. It will be featured on our platform for the next 30 days.`,
                toast: "Promotion Activated",
                notification: `Your tool promotion for ${toolName ? `"${toolName}"` : 'the tool'} is now active and featured on the homepage.`
            };
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
