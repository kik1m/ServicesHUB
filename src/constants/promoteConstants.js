/**
 * PROMOTE_UI_CONSTANTS
 * Rule #14: SSOT for all Promote-related UI strings
 */
export const PROMOTE_UI_CONSTANTS = {
    seo: {
        title: "Promote Your Tool | ServicesHUB",
        description: "Boost your tool's visibility and reach thousands of AI developers and seekers with our premium promotion packages."
    },
    hero: {
        title: "Promote Your",
        highlight: "Success",
        subtitle: "Reach thousands of creators and professional seekers by highlighting your tool in the directory.",
        badge: "ACCELERATE GROWTH",
        icon: "rocket",
        breadcrumbs: [
            { label: 'Home', path: '/' },
            { label: 'Promote' }
        ]
    },
    selector: {
        title: "1. Select Your Tool",
        placeholder: "Choose a tool to promote",
        noTools: "You haven't submitted any tools yet.",
        submitNew: "Submit a Tool First",
        loading: "Loading your tools..."
    },
    plans: {
        title: "2. Choose Promotion Plan",
        duration: "Active for {days} days",
        cta: "Select Plan",
        featured: "MOST POPULAR",
        benefits: "Plan Benefits",
        currency: "$"
    },
    trust: {
        title: "Verified Secure Transaction",
        badges: {
            secure: "Secured by Lemon Squeezy",
            compliance: "PCI-DSS Compliant",
            growth: "Instant Activation"
        },
        stats: [
            { label: "Active Users", value: "50K+" },
            { label: "Monthly Views", value: "200K+" },
            { label: "Conversion Rate", value: "12%" }
        ]
    },
    PLANS: [
        {
            id: 'featured',
            name: "Featured",
            price: "$49",
            amount: 49,
            period: "mo",
            desc: "Dominant homepage presence for 30 days.",
            features: ["Homepage Hero slot (30 days)", "Priority Category Ranking", "Newsletter Spotlight", "Social Media Shoutout", "Verified Tool Badge"],
            recommended: true,
            theme: "#00d2ff",
            glow: "rgba(0, 210, 255, 0.3)",
            cta: "Get Featured",
            variantId: "1597143"
        },
        {
            id: 'enterprise',
            name: "Market Authority",
            price: "$149",
            amount: 149,
            period: "mo",
            desc: "Ultimate visibility & SEO power.",
            features: ["Permanent Featured Status", "Do-Follow Backlink (SEO)", "Dedicated Review Article", "Side-wide Banner Ads", "Priority Review Sync"],
            recommended: false,
            theme: "#bf5af2",
            glow: "rgba(191, 90, 242, 0.3)",
            cta: "Go Enterprise",
            variantId: "1597146"
        }
    ]
};
