/**
 * PREMIUM_UI_CONSTANTS
 * Rule #14: Centralized UI labels and SEO data for Premium Page
 */
export const PREMIUM_UI_CONSTANTS = {
    seo: {
        title: "Go Premium | Unlock Elite AI Features on HUBly",
        description: "Upgrade to HUBly Premium to showcase your tools with elite badges, priority support, and exclusive directory features."
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
    plans: [
        {
            id: 'free',
            planName: "Basic Member",
            price: "0",
            period: "/forever",
            features: [
                "Standard Directory Access",
                "10 AI Messages / 12 Hours",
                "Gemini Flash 2.5 Model",
                "Standard Support"
            ],
            buttonText: "Current Plan",
            variantId: null
        },
        {
            id: 'pro',
            planName: "Pro Tier",
            price: "19.9",
            period: "/month",
            features: [
                "Elite Verified Badge",
                "Fast Tool Approval",
                "120 AI Messages / 6 Hours",
                "GPT-4o & Claude Access",
                "Priority Support"
            ],
            buttonText: "Upgrade to Pro",
            buttonLoading: "Preparing Checkout...",
            guarantee: "Secure Checkout",
            variantId: "1714775",
            isRecommended: true
        },
        {
            id: 'elite',
            planName: "Elite Tier",
            price: "69",
            period: "/month",
            features: [
                "All Pro Features",
                "Instant Tool Approval",
                "500 AI Messages / 6 Hours",
                "Priority Model Access (O1, Opus)",
                "24/7 Dedicated Support"
            ],
            buttonText: "Upgrade to Elite",
            buttonLoading: "Preparing Checkout...",
            guarantee: "Secure Checkout",
            variantId: "1714789"
        }
    ],
    faq: {
        title: "Common",
        highlight: "Questions",
        items: [
            {
                q: "What is the Elite Verified Badge?",
                a: "A professional badge that appears on your profile and next to your published tools, signaling trust to the community."
            },
            {
                q: "How does the AI Quota work?",
                a: "Your AI message limit resets automatically every 6 hours for Pro/Elite users (12 hours for Free). If you exceed the limit, you will be paused until the next cycle to ensure fair usage."
            },
            {
                q: "Which AI models are included?",
                a: "Free users have access to Gemini Flash. Pro and Elite users unlock premium models like Claude Sonnet 4.6 and GPT-4o, with Elite getting priority processing."
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
            compliance: "PCI-DSS Compliant",
            growth: "Instant Visibility",
            support: "Elite Support"
        }
    }
};

