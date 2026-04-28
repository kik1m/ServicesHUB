/**
 * SETTINGS_UI_CONSTANTS
 * Rule #16/34: Centralized UI labels and SEO data for Settings Page
 */
export const SETTINGS_UI_CONSTANTS = {
    seo: {
        title: "Account Settings | HUBLy",
        description: "Manage your profile, security, and notification preferences."
    },
    header: {
        title: "Account",
        titleHighlight: "Settings",
        subtitle: "Customize your profile, secure your account, and manage your subscription.",
        breadcrumbs: [
            { label: 'Home', path: '/' },
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Settings' }
        ]
    },
    tabs: [
        { id: 'profile', label: 'Profile Details' },
        { id: 'security', label: 'Password & Security' },
        { id: 'billing', label: 'Billing & Plan' },
        { id: 'notifications', label: 'Notifications' }
    ],
    profile: {
        title: "Profile Information",
        avatarTitle: "Profile Picture",
        avatarDesc: "Update your avatar. Recommended size: 400x400px.",
        avatarAction: "Change Photo",
        presenceTitle: "Online Presence",
        saveBtn: "Save Profile"
    },
    security: {
        title: "Account Security",
        subtitle: "Update your password and manage session security.",
        newPassword: "New Password",
        confirmPassword: "Confirm New Password",
        saveBtn: "Update Security"
    },
    billing: {
        title: "Free Account Plan",
        premiumActiveTitle: "Premium Subscription Active",
        premiumActiveDesc: "You are currently on the Premium plan. Enjoy full access to professional tools, featured listings, and priority support.",
        freeDesc: "You are currently on the Free plan. Upgrade to unlock premium features and increase your visibility.",
        upgradeBtn: "Upgrade Account",
        verifiedBadge: "Verified Premium Member"
    },
    notifications: {
        title: "Notification Preferences",
        subtitle: "Choose how and when you want to be notified.",
        items: [
            { id: 'email_notif', label: 'Email Notifications', desc: 'Receive important updates via your registered email.' },
            { id: 'review_notif', label: 'New Review Alerts', desc: 'Get notified when someone leaves a review on your tools.' },
            { id: 'promo_notif', label: 'Promotion Updates', desc: 'Receive alerts about your active tool promotions and status.' }
        ]
    }
};
