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
        badge: "Expertly Curated Tool Directory",
        title: "Get the Best Professional Tools for",
        highlight: "Your Projects",
        subtitle: "HUBly is your transparent window to the world's most innovative and reliable technical solutions. We save your valuable time by handpicking high-value, high-credibility tools that empower you to master new skills and scale your projects.",
        searchPlaceholder: "Search for tools, categories, or keywords...",
        popularLabel: "Popular:",
        trustPrefix: "A community of",
        trustSuffix: "makers worldwide",
        logosPrefix: "Trusted by creators from",
        logos: ["Product Hunt", "Hacker News", "Indie Hackers", "Dev.to"]
    },
    howItWorks: {
        header: {
            title: "How",
            subtitle: "HUBly Works",
            description: "Streamlining your tool search in three simple steps."
        }
    },
    valueProp: {
        header: {
            title: "Why Choose",
            subtitle: "HUBly?",
            description: "We bridge the gap between complex software and your specific project needs."
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
    POPULAR_TAGS: ['ChatGPT', 'SEO Tools', 'Logo Maker', 'Translation', 'Video AI'],
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
        title: 'Discover',
        desc: 'Explore our hand-picked collection of AI and SaaS gems.'
    },
    {
        id: 'step-2',
        num: '02',
        title: 'Compare',
        desc: 'Review features, pricing, and community feedback.'
    },
    {
        id: 'step-3',
        num: '03',
        title: 'Build',
        desc: 'Deploy the best tech and scale your next big idea.'
    }
];

export const VALUE_PROPS = [
    {
        id: 'prop-fast',
        title: 'Fast Access',
        desc: 'No more digging through search results. Get direct, tested links to the world\'s most innovative tools instantly.'
    },
    {
        id: 'prop-quality',
        title: 'Curated Quality',
        desc: 'We only list tools that meet our high standards of quality, reliability, and actual value for your business.'
    },
    {
        id: 'prop-trends',
        title: 'Latest Trends',
        desc: 'Stay updated with daily additions of the newest AI breakthroughs and SaaS innovations before they go viral.'
    }
];

export const VIDEO_GUIDE_CONTENT = {
    seeker: {
        id: 'guide-seeker',
        title: "For Tool Seekers",
        subtitle: "Find the perfect AI tool for your workflow in seconds.",
        videoId: "dQw4w9WgXcQ",
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
        videoId: "dQw4w9WgXcQ",
        features: [
            "High-conversion tool landing pages",
            "Featured slots for maximum visibility",
            "Verified badges for ultimate trust",
            "Analytics to track your tool growth"
        ]
    }
};

export const SECTION_LIMITS = {
    TRENDING: 6,
    LATEST: 6,
    FEATURED: 3,
    BLOG: 3,
    CATEGORIES: 8,
    BANNER: 5
};

/**
 * Skeleton configurations to avoid inline arrays (Rule #30)
 */
export const SKELETON_COUNTS = {
    HERO_AVATARS: [1, 2, 3, 4],
    HERO_TAGS: [1, 2, 3, 4],
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



