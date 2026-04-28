/**
 * TOOLS_UI_CONSTANTS
 * Rule #34/41: Centralized Labels & SEO
 */
export const TOOLS_UI_CONSTANTS = {
    seo: {
        title: "Explore 500+ Premium AI Tools | HUBly Directory",
        description: "Discover the most powerful AI and SaaS solutions curated for professionals. Filter by category, price, and popularity."
    },
    hero: {
        title: "All",
        highlight: "Tools",
        subtitle: "Discover the most powerful AI and SaaS solutions curated for professional workflows and creative excellence.",
        breadcrumbs: [
            { label: 'Home', path: '/' },
            { label: 'All Tools' }
        ]
    },
    filters: {
        pricing: [
            { label: 'All Pricing', value: 'All' },
            { label: 'Free', value: 'Free' },
            { label: 'Freemium', value: 'Freemium' },
            { label: 'Premium', value: 'Premium' },
            { label: 'Paid', value: 'Paid' },
            { label: 'Contact', value: 'Contact' }
        ],
        sorting: [
            { label: 'Featured', value: 'featured' },
            { label: 'Newest', value: 'newest' },
            { label: 'Top Rated', value: 'rating' },
            { label: 'Most Popular', value: 'popular' },
            { label: 'Alphabetical', value: 'alphabetical' }
        ],
        placeholder: "Find your next favorite AI tool..."
    },
    cta: {
        title: "Missing a great tool?",
        description: "Help the community discover the best AI solutions. If you know a tool that should be here, let us know!",
        button: "Submit Your Tool Now"
    },
    empty: "No tools found matching your criteria. Try adjusting your filters or search query."
};
