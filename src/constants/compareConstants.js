export const COMPARE_UI_CONSTANTS = {
    hero: {
        title: "Compare AI",
        highlight: "Tools",
        subtitle: "Make informed decisions by comparing the world's most innovative AI and SaaS tools side-by-side. Analyze features, ratings, and pricing in one view.",
        breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Compare' }]
    },
    matrix: {
        headers: {
            feature: "Feature / Capability",
            tool1: "Tool A",
            tool2: "Tool B"
        },
        features: {
            rating: "Community Rating",
            pricing: "Pricing Model",
            verified: "Verified Status"
        },
        verdict: {
            title: "Ultimate",
            highlight: "Verdict",
            winnerSuffix: "mathematically dominates with a score of",
            draw: "It's a dead heat! Both tools score an identical"
        },
        sections: {
            exclusive: "EXCLUSIVE TO",
            overlap: "STANDARD OVERLAP (BOTH HAVE)",
            empty: {
                title: "No specific feature list available",
                text: "Add features to these tools to see a detailed comparison."
            }
        },
        tco: {
            title: "Predictive Cost Scaling (TCO)",
            desc: "Based on standard industry averages for pricing modeling.",
            simulate: "Simulate Team Size:",
            marks: ["Solo", "Startup", "Enterprise"]
        },
        error: {
            title: "Comparison hydration error",
            text: "Mathematical model could not be computed for this pair."
        }
    },
    placeholders: {
        title: "Select Tool",
        text: "Choose an AI tool to compare side-by-side.",
        visit: "Visit Site",
        labels: {
            rating: "Rating",
            reviews: "Reviews",
            pricing: "Pricing",
            about: "About"
        }
    },
    actions: {
        reset: "Reset Comparison"
    },
    wizard: {
        step1: "Step 1: Select Primary Tool",
        step2: "Step 2: Choose competitor for",
        placeholderA: "Select Tool A",
        placeholderB: "Select Tool B",
        searchA: "Search for any tool...",
        searchB: "Search competitors for",
        cancel: "Cancel Selection"
    }
};

export const SCORING_WEIGHTS = {
    RATING_MAX: 40,
    VERIFIED_BONUS: 15,
    REVIEWS_MAX: 15,
    FEATURE_DOMINANCE_MAX: 30,
    EQUAL_FEATURES_DEFAULT: 15
};

export const REVIEWS_THRESHOLDS = {
    HIGH: 500,
    MEDIUM: 100,
    LOW: 10
};

export const PRICING_MULTIPLIERS = {
    FREE: 0,
    OPEN_SOURCE: 0,
    FREEMIUM: 19,
    PAID: 35,
    PREMIUM: 35,
    ENTERPRISE: 99,
    DEFAULT: 25
};
