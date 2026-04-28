export const TOOL_DETAIL_UI_CONSTANTS = {
    seo: {
        titleSuffix: "| Best AI & SaaS Tools",
        descriptionPrefix: "Check out"
    },
    actions: {
        visit: "Visit Website",
        share: "Share Tool",
        favorite: "Save to List",
        back: "Back to Directory",
        saved: "Saved to List",
        report: "Report this tool"
    },
    hero: {
        titlePrefix: "Explore",
        defaultTagline: "Professional AI tool for advanced workflows."
    },
    badges: {
        featured: "Featured",
        popular: "Popular",
        verified: "Verified",
        safe: "Safe to Use"
    },
    sidebar: {
        title: "Tool Info",
        pricing: "Pricing",
        publisher: "Publisher",
        rating: "Rating",
        status: "Status",
        safety: "Safety",
        verified: "Verified",
        safe: "Safe to Use",
        shareTitle: "Share this tool",
        anonymous: "Anonymous",
        claim: {
            title: "Is this your tool?",
            desc: "Claim ownership to update details and respond to reviews.",
            action: "Claim Ownership"
        }
    },
    tabs: {
        overview: "About",
        features: "Key Features",
        reviews: "Reviews",
        pricing: "Pricing",
        defaultDesc: "Detailed description coming soon.",
        thisTool: "this tool"
    },
    related: {
        title: "Related",
        highlight: "Tools",
        desc: "More high-quality solutions from this category.",
        empty: "No related tools found in this category."
    },
    reviews: {
        title: "User Reviews",
        writeReview: "Write a Review",
        reviewSubmitted: "Review Submitted",
        thankYou: "Thank you for sharing your experience!",
        signInToReview: "Sign In to Review",
        countSingle: "Review",
        countPlural: "Reviews",
        empty: {
            title: "No reviews yet!",
            desc: "Be the first to share your thoughts on this tool."
        },
        loginRequired: "You must sign in to share your experience.",
        success: "Review submitted successfully!",
        alreadySubmitted: "You have already reviewed this tool.",
        minLengthError: "Please write a slightly longer review (min 5 characters)."
    },
    error: {
        notFound: "Tool Not Found",
        notFoundDesc: "The tool you are looking for doesn't exist or has been removed.",
        loadFailed: "Failed to load tool details."
    },
    breadcrumbs: {
        home: "Home",
        tools: "AI Tools"
    }
};

// Backward Compatibility (Rule #38 Resilience)
export const TOOL_DETAIL_CONSTANTS = {
    FAVORITE_ADDED: "Added to favorites!",
    FAVORITE_REMOVED: "Removed from favorites.",
    SHARE_SUCCESS: "Link copied to clipboard!",
    RELATED_TITLE: "Related",
    RELATED_SUBTITLE: "Tools",
    EMPTY_RELATED: "No related tools found.",
    RELATED_DESC: "Explore more tools in this category."
};

export const SKELETON_COUNTS = {
    RELATED_TOOLS: [1, 2, 3],
    FEATURES: [1, 2, 3, 4],
    REVIEWS: [1, 2, 3],
};
