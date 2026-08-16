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
        titleSuffix: " | HUBly",
        defaultDescription: "The world's most advanced hub to discover and compare AI & SaaS tools.",
        defaultKeywords: ["AI tools", "SaaS directory", "productivity tools", "machine learning", "software reviews", "premium resources"],
        defaultImage: "https://www.hubly-tools.com/android-chrome-512x512.png",
        twitterHandle: "@hubly_platform",
        organization: {
            name: "HUBly Platform",
            url: "https://www.hubly-tools.com",
            logo: "https://www.hubly-tools.com/android-chrome-512x512.png"
        },
        // Rule #34: Fixed UUIDs for Static Pages (Ensures DB Compatibility)
        pageIds: {
            home: "00000000-0000-0000-0000-000000000001",
            about: "00000000-0000-0000-0000-000000000002",
            tools: "00000000-0000-0000-0000-000000000003",
            blog: "00000000-0000-0000-0000-000000000004",
            premium: "00000000-0000-0000-0000-000000000005",
            categories: "00000000-0000-0000-0000-000000000006",
            compare: "00000000-0000-0000-0000-000000000007",
            promote: "00000000-0000-0000-0000-000000000008",
            contact: "00000000-0000-0000-0000-000000000009",
            faq: "00000000-0000-0000-0000-000000000010",
            privacy: "00000000-0000-0000-0000-000000000011",
            terms: "00000000-0000-0000-0000-000000000012",
            auth: "00000000-0000-0000-0000-000000000013",
            search: "00000000-0000-0000-0000-000000000014",
            submit: "00000000-0000-0000-0000-000000000015",
            success: "00000000-0000-0000-0000-000000000016",
            notfound: "00000000-0000-0000-0000-000000000017",
            ai_engine: "00000000-0000-0000-0000-000000000018",
            dashboard: "00000000-0000-0000-0000-000000000019",
            admin: "00000000-0000-0000-0000-000000000020",
            settings: "00000000-0000-0000-0000-000000000021",
            profile: "00000000-0000-0000-0000-000000000022",
            reset_password: "00000000-0000-0000-0000-000000000023",
            notifications: "00000000-0000-0000-0000-000000000024",
            docs: "00000000-0000-0000-0000-000000000025"
        }
    },
    pages: {
        home: {
            title: "HUBly — Discover, Compare & Launch the World's Best AI & SaaS Tools",
            description: "The world's most advanced hub to discover, compare, and deploy AI tools, SaaS platforms, and automation software. Trusted by professionals worldwide.",
            keywords: ["AI directory", "SaaS comparison", "Top AI tools 2026", "AI discovery", "best AI software"]
        },
        tools: {
            title: "AI & SaaS Tools Directory — Browse {{toolsCount}}+ Premium Resources | HUBly",
            description: "Explore our curated library of elite AI tools, SaaS platforms, and automation software. Advanced filters by category, pricing, and ratings help you find the perfect match.",
            keywords: ["Software search", "Tool discovery", "SaaS comparison", "AI tools library", "browse AI software"]
        },
        ai_engine: {
            title: "HUBly AI Studio — Your Expert AI for Projects, Strategy & Tool Discovery",
            description: "Turn any idea into a full action plan. HUBly AI Studio guides beginners, professionals, and engineers through project planning, tool selection, complex comparisons, and execution strategies — powered by advanced AI.",
            keywords: ["AI project planner", "AI assistant", "smart tool recommendation", "AI strategy", "project execution AI", "AI for beginners", "AI for engineers"]
        },
        blog: {
            title: "HUBly Magazine: AI & SaaS Insights, Trends & Analysis",
            description: "Latest news, expert guides, and industry trends in the AI and SaaS world.",
            keywords: ["AI news", "SaaS blog", "Tech insights"]
        },
        premium: {
            title: "HUBly Premium: Unlock Elite AI Tools & Directory Access",
            description: "Join the elite HUBly membership to access exclusive tools, advanced analytics, and priority support.",
            keywords: ["Premium membership", "SaaS discounts", "Elite tools"]
        },
        categories: {
            title: "AI Tools by Category: Find the Best for Your Needs",
            description: "Browse AI and SaaS tools by niche. Find exactly what you need in seconds.",
            keywords: ["Software categories", "Niche AI tools"]
        },
        compare: {
            title: "Compare AI Tools Side-by-Side Analysis",
            description: "Detailed, data-driven comparisons between the world's leading AI and SaaS tools. Find the best alternative for your workflow.",
            keywords: ["AI vs AI", "SaaS comparison", "Software alternatives", "Tool scoring", "Side-by-side analysis"]
        },
        promote: {
            title: "Promote Your AI Tool for Growth | Submit to HUBly",
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
            title: "The HUBly Story: Mission & Values Behind Our AI Directory",
            description: "The story behind the world's most advanced AI and SaaS directory.",
            keywords: ["About us", "HUBly mission"]
        },
        contact: {
            title: "Contact HUBly AI Directory Support for Help",
            description: "Have questions or feedback? Reach out to the HUBly team anytime.",
            keywords: ["Contact HUBly", "Support", "Feedback"]
        },
        faq: {
            title: "HUBly AI Directory: FAQ & Help Center",
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
        },
        docs: {
            title: "HUBly Documentation & Guides",
            description: "Comprehensive guides, API documentation, and resources for HUBly.",
            keywords: ["Docs", "API", "Documentation"]
        },
        reset_password: {
            title: "Reset Your Password",
            description: "Securely reset your HUBly account password.",
            noindex: true
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
        case 'BreadcrumbList':
            return {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": data.items.map((item, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": item.label,
                    "item": item.path ? `${global.organization.url}${item.path}` : global.organization.url
                }))
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
