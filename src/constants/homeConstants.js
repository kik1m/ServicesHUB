/**
 * Home Page Constants
 * Centralized store for all static data used on the Home page (Rule #14)
 */

export const HOME_UI_CONSTANTS = {
    seo: {
        title: "The Ultimate AI & SaaS Tools Directory",
        description: "Discover and compare the world's most innovative AI and SaaS tools. Curated for founders, developers, and creators.",
        url: 'https://hubly.com'
    },
    hero: {
        badge: "Strategic AI Decision Engine",
        title: "Your Intelligent Copilot for",
        highlight: "Software Discovery",
        subtitle: "More than just a directory. HUBly is an intelligent ecosystem that evaluates, compares, and recommends the exact AI and SaaS tools you need to scale your business, backed by real-time data and authentic social proof.",
        searchPlaceholder: "Ask the AI or search for a specific tool...",
        trustPrefix: "Trusted by over",
        trustSuffix: "makers worldwide",
        logosPrefix: "Trusted by pioneers from",
        logos: ["Product Hunt", "Hacker News", "Indie Hackers", "Dev.to"]
    },
    howItWorks: {
        header: {
            title: "How",
            subtitle: "HUBly Works",
            description: "Your strategic workflow for evaluating and adopting the best AI tools."
        }
    },
    valueProp: {
        header: {
            title: "Why Choose",
            subtitle: "HUBly?",
            description: "Empowering your business with intelligent recommendations, deep analytics, and an integrated AI Copilot."
        }
    },
    publisherCTA: {
        title: "Are you a",
        highlight: "Tool Creator?",
        desc: "Reach thousands of professional makers. Submit your tool to our directory and grow your user base today.",
        button: "Submit Your Tool"
    }
};

export const HERO_CONSTANTS = {
    DEFAULT_USERS_COUNT: 1200,
    TRUST_AVATARS: [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1527980972134-d536b5951d6a?w=100&auto=format&fit=crop&q=60'
    ]
};

export const HOW_IT_WORKS_STEPS = [
    {
        id: 'step-1',
        num: '01',
        title: 'Explore & Discover',
        path: '/tools',
        desc: 'Navigate a highly curated directory of elite AI solutions tailored for modern businesses.'
    },
    {
        id: 'step-2',
        num: '02',
        title: 'Smart Comparison',
        path: '/compare',
        desc: 'Evaluate features, pricing, and social proof side-by-side to make data-driven decisions.'
    },
    {
        id: 'step-3',
        num: '03',
        title: 'AI Studio Copilot',
        path: '#',
        desc: 'Consult our deeply integrated AI Engine. Get personalized tool recommendations and architectural advice instantly.'
    }
];

export const VALUE_PROPS = [
    {
        id: 'prop-fast',
        title: 'AI-Powered Intelligence',
        desc: 'Stop guessing. Our embedded AI Engine analyzes your exact requirements and recommends the optimal tech stack tailored to your use case.'
    },
    {
        id: 'prop-quality',
        title: 'Deep Comparison Matrix',
        desc: 'Go beyond basic lists. Compare tools across multiple data points including pricing models, API limits, and performance metrics.'
    },
    {
        id: 'prop-trends',
        title: 'Vetted Authority',
        desc: 'Every tool is rigorously tested and reviewed by industry experts, ensuring you only integrate enterprise-grade, secure, and reliable software.'
    }
];

export const VIDEO_GUIDE_CONTENT = {
    seeker: {
        id: 'guide-seeker',
        title: "For Tool Seekers",
        subtitle: "Find the perfect AI tool for your workflow in seconds.",
        videoId: null,
        features: [
            "Advanced filtering by category & price",
            "Real-user reviews and ratings",
            "Side-by-side tool comparisons",
            "Daily updates on new AI releases"
        ]
    },
    publisher: {
        id: 'guide-publisher',
        title: "For Tool Publishers",
        subtitle: "Get your SaaS in front of thousands of potential users.",
        videoId: null,
        features: [
            "High-conversion tool landing pages",
            "Featured slots for maximum visibility",
            "Verified badges for ultimate trust",
            "Analytics to track your tool growth"
        ]
    }
};

export const SECTION_LIMITS = {
    TRENDING: 9,
    LATEST: 8,
    FEATURED: 6,
    BLOG: 3,
    CATEGORIES: 8,
    BANNER: 5
};

/**
 * Skeleton configurations to avoid inline arrays (Rule #30)
 */
export const SKELETON_COUNTS = {
    HERO_AVATARS: [1, 2, 3, 4],
    STATS_ITEMS: [1, 2, 3],
    TRENDING_ITEMS: Array.from({ length: SECTION_LIMITS.TRENDING }, (_, i) => i),
    LATEST_ITEMS: Array.from({ length: SECTION_LIMITS.LATEST }, (_, i) => i),
    FEATURED_ITEMS: Array.from({ length: SECTION_LIMITS.FEATURED }, (_, i) => i),
    BLOG_ITEMS: Array.from({ length: SECTION_LIMITS.BLOG }, (_, i) => i),
    CATEGORIES_ITEMS: Array.from({ length: SECTION_LIMITS.CATEGORIES }, (_, i) => i)
};

export const STATS_LABELS = {
    TOOLS: 'Vetted Tools',
    VIEWS: 'Discoveries',
    CATEGORIES: 'Expert Categories'
};

export const BANNER_CONSTANTS = {
    DEFAULT_IMAGE: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop',
    BADGE_TEXT: 'NEW & FEATURED'
};



