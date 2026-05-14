/**
 * PREMIUM_UI_CONSTANTS
 * Rule #14: Centralized UI labels and SEO data for Premium Page
 */
export const PREMIUM_UI_CONSTANTS = {
    seo: {
        title: "Go Premium | Unlock Elite AI Features on ServicesHUB",
        description: "Upgrade to ServicesHUB Premium to showcase your tools with elite badges, priority support, and exclusive directory features."
    },
    hero: {
        title: "Join the Elite",
        highlight: "Circle",
        subtitle: "Unlock professional-grade visibility and community access with our Prime membership.",
        badge: "PRIME MEMBER",
        icon: "zap",
        breadcrumbs: [
            { label: 'Home', path: '/' },
            { label: 'Premium' }
        ]
    },
    pricing: {
        planName: "Prime Member",
        price: "99",
        period: "/one-time",
        features: [
            "Elite Verified Badge",
            "Priority Tool Approval",
            "Advanced Profile Analytics",
            "Unlimited Tool Submissions",
            "Exclusive 'Prime' Community Access"
        ],
        buttonText: "Upgrade Now",
        buttonLoading: "Preparing Checkout...",
        guarantee: "Safe & Secure Checkout via Lemon Squeezy",
        variantId: "1597126"
    },
    faq: {
        title: "Common",
        highlight: "Questions",
        items: [
            {
                q: "What is the Elite Verified Badge?",
                a: "A professional badge that appears on your profile and next to your published tools, signaling trust to the community."
            },
            {
                q: "Is this a monthly subscription?",
                a: "No. This is a one-time payment for lifetime access to all current and future Premium features."
            },
            {
                q: "How fast is priority approval?",
                a: "Premium submissions are reviewed within 24 hours, compared to the standard 3-5 days."
            }
        ]
    },
    messages: {
        error: "Failed to initiate checkout. Please try again.",
        successRedirect: "Redirecting to secure payment..."
    },
    trust: {
        title: "Trusted by thousands of makers",
        badges: {
            secure: "Secure Payments",
            growth: "Instant Visibility",
            support: "Elite Support"
        }
    }
};
