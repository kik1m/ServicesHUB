/**
 * 🌐 Platform SEO Manifest
 * Rule #14: Constant Centralization
 * Rule #34: Elite Metadata Management
 * 
 * This file is the single source of truth for SEO across all 28+ pages.
 */

export const SEO_CONFIG = {
    global: {
        siteName: "HUBly",
        titleSuffix: " | HUBly - Elite Premium Directory",
        defaultDescription: "Discover, compare, and scale with the world's most innovative AI tools and SaaS solutions. Your gateway to productivity.",
        defaultKeywords: ["AI tools", "SaaS directory", "productivity tools", "machine learning", "software reviews", "premium resources"],
        defaultImage: "/og-default.jpg",
        twitterHandle: "@hubly_platform",
        organization: {
            name: "HUBly Platform",
            url: "https://hubly.com",
            logo: "https://hubly.com/logo.png"
        }
    },
    pages: {
        home: {
            title: "HUBly - Ultimate AI & SaaS Directory",
            description: "The world's largest directory of AI and SaaS tools. Find the best resources to grow your business.",
            keywords: ["AI directory", "SaaS ecosystem", "Top AI tools 2026"]
        },
        tools: {
            title: "Discover Premium Tools",
            description: "Explore our curated collection of elite AI and SaaS tools. Filter by category, pricing, and ratings.",
            keywords: ["Software search", "Tool discovery", "SaaS comparison"]
        },
        blog: {
            title: "HUBly Magazine - AI & SaaS Insights",
            description: "Latest news, expert guides, and industry trends in the AI and SaaS world.",
            keywords: ["AI news", "SaaS blog", "Tech insights"]
        },
        premium: {
            title: "Go Premium - Unlock Elite Power",
            description: "Join the elite HUBly membership to access exclusive tools, advanced analytics, and priority support.",
            keywords: ["Premium membership", "SaaS discounts", "Elite tools"]
        },
        categories: {
            title: "Tool Categories",
            description: "Browse AI and SaaS tools by niche. Find exactly what you need in seconds.",
            keywords: ["Software categories", "Niche AI tools"]
        },
        compare: {
            title: "Compare Resources",
            description: "Side-by-side comparison of the world's top AI and SaaS tools. Make data-driven decisions.",
            keywords: ["Software comparison", "Tool VS", "SaaS analysis"]
        },
        promote: {
            title: "Promote Your Tool",
            description: "Boost your tool's visibility on HUBly. Reach thousands of potential customers.",
            keywords: ["Advertise", "SaaS marketing", "Tool promotion"]
        },
        profile: {
            title: "Account Overview",
            description: "Manage your personal profile and preferences.",
            noindex: true
        },
        dashboard: {
            title: "Creator Dashboard",
            description: "Manage your submitted tools and analytics.",
            noindex: true
        },
        about: {
            title: "About HUBly",
            description: "The story behind the world's most advanced AI and SaaS directory.",
            keywords: ["About us", "HUBly mission"]
        },
        contact: {
            title: "Contact Us",
            description: "Have questions or feedback? Reach out to the HUBly team anytime.",
            keywords: ["Contact HUBly", "Support", "Feedback"]
        },
        faq: {
            title: "Help & FAQ",
            description: "Frequently asked questions about HUBly, tool submissions, and premium memberships.",
            keywords: ["SaaS FAQ", "Help center", "Common questions"]
        },
        privacy: {
            title: "Privacy Policy",
            description: "How we protect your data and maintain your privacy at HUBly.",
            keywords: ["Data protection", "Privacy", "Legal"]
        },
        terms: {
            title: "Terms of Service",
            description: "The rules and guidelines for using the HUBly platform.",
            keywords: ["User agreement", "Terms", "Compliance"]
        },
        auth: {
            title: "Secure Access",
            description: "Login or Sign Up to HUBly to unlock personalized tools and dashboards.",
            keywords: ["Login", "Signup", "Secure access"]
        },
        search: {
            title: "Advanced Tool Search",
            description: "Search across thousands of AI and SaaS tools with advanced filters.",
            keywords: ["Smart search", "AI finder", "Filter tools"]
        },
        settings: {
            title: "Account Settings",
            description: "Manage your profile security.",
            noindex: true
        },
        notifications: {
            title: "Notifications Center",
            description: "Your personal alert center.",
            noindex: true
        },
        admin: {
            title: "Admin Control Center",
            description: "Internal management console.",
            noindex: true
        },
        submit: {
            title: "Submit a Resource",
            description: "Share your tool with the world. Join the fastest-growing SaaS directory.",
            keywords: ["Submit tool", "List software", "Grow audience"]
        },
        success: {
            title: "Action Successful",
            description: "Your action has been completed successfully. Thank you for using HUBly.",
            keywords: ["Success", "Confirmation"]
        },
        notfound: {
            title: "404 - Page Not Found",
            description: "The page you are looking for does not exist. Explore our directory to find what you need.",
            keywords: ["Error 404", "Not found"]
        }
    }
};

/**
 * 🧠 Schema Factory
 * Generates JSON-LD for rich search results.
 */
export const getSchema = (type, data = {}) => {
    const { global } = SEO_CONFIG;
    
    switch (type) {
        case 'Organization':
            return {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": global.organization.name,
                "url": global.organization.url,
                "logo": global.organization.logo,
                "sameAs": [
                    "https://twitter.com/hubly",
                    "https://linkedin.com/company/hubly"
                ]
            };
        case 'WebSite':
            return {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": global.siteName,
                "url": global.organization.url,
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": `${global.organization.url}/search?q={search_term_string}`,
                    "query-input": "required name=search_term_string"
                }
            };
        default:
            return null;
    }
};
