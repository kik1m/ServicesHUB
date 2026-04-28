/**
 * Category Detail Page Constants
 * Rule #30: Constants Enforcement
 */

export const CATEGORY_CONFIG = {
    ITEMS_PER_PAGE: 12,
    ICON_SIZE: 40,
    SORT_OPTIONS: [
        { label: 'Featured', value: 'featured' },
        { label: 'Newest', value: 'newest' },
        { label: 'Top Rated', value: 'rating' },
        { label: 'Most Popular', value: 'popular' },
        { label: 'Alphabetical', value: 'alphabetical' }
    ]
};

export const SKELETON_COUNTS = {
    TOOLS_GRID: Array.from({ length: 6 }, (_, i) => i),
    CATEGORIES_GRID: Array.from({ length: 12 }, (_, i) => i),
    HEADER_BREADCRUMBS: [1],
};

export const CATEGORY_STRINGS = {
    HEADER: {
        ERROR_TITLE: "Category Profile Unavailable",
        BACK_TEXT: "All Categories",
        TITLE_SUFFIX: "Catalogue",
        BADGE_SUFFIX: "World-Class Tools",
        DESC_FALLBACK: "Expertly curated tools to help you build better and faster.",
        BREADCRUMBS: {
            ROOT: { label: 'Categories', path: '/categories' }
        },
        SEO: {
            DEFAULT_TITLE: 'Category Directory',
            DEFAULT_DESC: 'Explore curated professional AI and SaaS solutions.',
            TEMPLATE_TITLE: (name) => `${name} AI Tools & Resources`,
            TEMPLATE_DESC: (name) => `Discover the best curated ${name} AI tools and software to enhance your workflow.`
        }
    },
    TOOLS: {
        ERROR_TITLE: "Unable to load tools",
        SEARCH_PLACEHOLDER: "Search for specific tools...",
        SECTION_TITLE_MAIN: "Explore",
        SECTION_TITLE_ACCENT: "Top Tools",
        LOAD_MORE: "Load More Tools",
        SEARCH_FOUND: (count, query) => `Found ${count} results for "${query}"`,
        STATS_SHOWING: (count, total) => `Showing ${count} of ${total} world-class solutions`,
        SORT_LABEL: "Sort By:"
    },
    EMPTY: {
        TITLE: (name) => `Know a great ${name} tool?`,
        DESCRIPTION: "Help others discover the best solutions in this category. Submit your own or a tool you love to grow this niche!",
        ACTION_TEXT: "Submit to this Category",
    },
    LIST: {
        HERO: {
            TITLE: "Browse the",
            HIGHLIGHT: "Directory",
            SUBTITLE: "Explore our hand-picked collection of world-class tools and resources organized by professional categories.",
            BREADCRUMBS: [
                { label: 'Home', path: '/' },
                { label: 'Categories' }
            ]
        },
        SEARCH: {
            PLACEHOLDER: "Search over 50+ professional categories...",
            NO_RESULTS: (query) => `No categories found matching "${query}"`
        },
        ERROR_TITLE: "Directory Unavailable",
        CARD: {
            TOOLS: "Tools",
            BROWSE: "Browse"
        },
        SUGGEST: {
            TITLE: "Suggest a Category",
            DESCRIPTION: "Didn't find the right niche? We are always expanding our directory. Let us know what you are looking for!",
            ACTION_TEXT: "Tell us what's missing"
        }
    }
};
