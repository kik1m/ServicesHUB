/**
 * NOTIFICATIONS_UI_CONSTANTS
 * Rule #14: Centralized UI labels and SEO data for Notifications Page
 */
export const NOTIFICATIONS_UI_CONSTANTS = {
    seo: {
        title: "Activity Notifications | ServicesHUB",
        description: "Stay updated with your tool submissions, approval status, and account activity."
    },
    hero: {
        title: "My",
        highlight: "Activity",
        subtitle: "Stay updated with real-time alerts about your tools, reviews, and account milestones.",
        breadcrumbs: [
            { label: 'Home', path: '/' },
            { label: 'Notifications' }
        ]
    },
    empty: {
        title: "All Caught Up!",
        description: "You don't have any new notifications at the moment. We'll alert you when something important happens."
    },
    auth: {
        title: "Sign in for Updates",
        description: "Please log in to view your activity, tool approvals, and personalized notifications.",
        button: "Sign In to Continue"
    },
    actions: {
        clearAll: "Clear All",
        markAsRead: "Mark as read",
        confirmClear: "Are you sure you want to clear all notifications? This action cannot be undone.",
        successClear: "All notifications cleared successfully.",
        errorClear: "Failed to clear notifications. Please try again."
    }
};
