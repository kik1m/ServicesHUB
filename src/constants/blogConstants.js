/**
 * blogConstants.js
 * Centralized constants for the Blog & BlogPost module.
 * Following Protocol Rule #14 (Constant Centralization) and Rule #30 (Skeleton Sanitization).
 */

export const BLOG_CONSTANTS = {
    // 1. Page Header / Hero Section
    HERO: {
        TITLE: "Insights",
        HIGHLIGHT: "on the AI Revolution",
        SUBTITLE: "Expert guides, industry news, and SaaS growth strategies delivered to you.",
        BADGE: "BLOG & INSIGHTS",
        SEARCH_PLACEHOLDER: "Search articles, guides, and news...",
        BREADCRUMBS: [
            { label: "Home", path: "/" },
            { label: "Blog Magazine", path: "/blog" }
        ]
    },

    // 2. Filters Section
    FILTERS: {
        ALL: "All",
        ARIA_LABEL_PREFIX: "Filter by ",
    },

    // 3. Grid & Pagination
    GRID: {
        NO_POSTS_FOUND: "No articles found matching your criteria.",
        LOAD_MORE: "Load More Articles",
        ITEMS_PER_PAGE: 6,
    },

    // 4. Article Card
    CARD: {
        READ_MORE: "Read More",
        AUTHOR_FALLBACK: "HUBly",
        IMAGE_FALLBACK: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
    },

    // 5. Sidebar Widgets
    SIDEBAR: {
        NEWSLETTER: {
            TITLE: "Newsletter",
            SUBTITLE: "Get the latest AI tools and trends directly in your inbox.",
            PLACEHOLDER: "Email address",
            BUTTON: "Subscribe",
        },
        RELATED: {
            TITLE: "Related Articles",
            IMAGE_FALLBACK: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&auto=format&fit=crop&q=60",
        },
    },

    // 6. Post Detail
    POST: {
        BACK_LINK: "Back to Insights",
        READ_TIME_SUFFIX: "min read",
        SHARE_LABEL: "Share this article:",
        ERROR_NOT_FOUND: "Article not found",
        BACK_TO_MAGAZINE: "Back to Blog Magazine",
    },

    // 7. SEO Metadata
    SEO: {
        LIST_TITLE: "HUBly Magazine | AI & SaaS Insights",
        POST_TITLE_SUFFIX: " | HUBly Magazine",
        OG_TYPE: "article",
    },

    // 8. Skeleton Configuration [Rule #30]
    SKELETONS: {
        GRID_INITIAL: [1, 2, 3, 4, 5, 6],
        GRID_MORE: [1, 2, 3],
        FILTERS: [1, 2, 3, 4, 5],
        RELATED_SIDEBAR: [1, 2],
    }
};
