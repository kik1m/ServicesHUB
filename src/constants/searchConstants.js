export const SEARCH_UI_CONSTANTS = {
    seo: {
        title: "Explore Tools",
        description: "Discover the best AI and SaaS tools in our comprehensive universe. Filter by category, price, and rating.",
        searchPrefix: "Search:"
    },
    header: {
        title: "Discover the",
        highlight: "Future",
        subtitle: "Explore our hand-picked universe of world-class AI and SaaS tools tailored for your success.",
        placeholder: "Search tools, tags, or technology...",
        breadcrumbs: [
            { label: 'Home', path: '/' },
            { label: 'Tools' }
        ]
    },
    sidebar: {
        title: "Filters",
        categories: {
            title: "Categories",
            searchPlaceholder: "Search categories...",
            noResults: "No categories found."
        },
        pricing: {
            title: "Pricing"
        },
        showMore: "Show All",
        showLess: "Show Less"
    },
    results: {
        found: "Tools Found",
        loadMore: "Load More Tools",
        sortBy: "Sort by:",
        noResults: {
            title: "No tools match your criteria",
            description: "Try adjusting your filters, changing the category, or simplifying your search query."
        }
    }
};

export const PRICING_MODELS = [
    { value: 'All', label: 'All' },
    { value: 'Free', label: 'Free' },
    { value: 'Freemium', label: 'Freemium' },
    { value: 'Premium', label: 'Premium' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Contact', label: 'Contact' }
];

export const SORT_OPTIONS = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'alphabetical', label: 'Alphabetical' }
];

export const SEARCH_CONFIG = {
    ITEMS_PER_PAGE: 12,
    DEBOUNCE_MS: 300 // Optimized debounce
};

export const SEARCH_EMPTY_CONFIG = {
    TITLE: "No tools match your criteria",
    DESCRIPTION: "Try adjusting your filters, changing the category, or simplifying your search query.",
    SIDEBAR_NO_CATS: "No categories found matching your search."
};

export const SKELETON_COUNTS = {
    SIDEBAR_CATEGORIES: 8,
    SIDEBAR_PRICING: 4,
    RESULTS_GRID: 9,
    RESULTS_MORE: 3
};

export const AI_SEARCH_CONSTANTS = {
    badge: "AI Powered Search",
    title: "How can I help you discover tools today?",
    placeholder: "e.g. 'Find me an AI for making logo' or 'Best SEO tools cheaper than Ahrefs'",
    loading: "Thinking and scanning our universe...",
    error: "My circuits are a bit fuzzy. Can you try again?",
    success: "Here's what I found for you:",
    noResults: "I couldn't find exactly that, but these might interest you:",
    disclaimer: "Powered by HUBly Semantic Engine v2.0"
};
