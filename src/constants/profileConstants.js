/**
 * PROFILE_UI_CONSTANTS
 * Rule #14: Unified source of truth for all Profile-related UI strings
 */
export const PROFILE_UI_CONSTANTS = {
    // 1. Private Dashboard Section
    dashboard: {
        seo: {
            title: "Profile Dashboard | ServicesHUB",
            description: "Manage your tool collections, reviews, and professional identity.",
            publicPrefix: "My Profile -"
        },
        hero: {
            title: "Dashboard",
            viewPublic: "View Public"
        },
        membership: {
            title: "Plan & Status",
            premium: "PREMIUM MEMBER",
            free: "FREE PLAN",
            premiumDesc: "Elite Access Enabled",
            freeDesc: "Basic Community Access",
            upgrade: "UPGRADE TO PRO",
            settings: "Profile Settings",
            primeActive: "PRIME ACTIVE"
        },
        stats: {
            saved: "Saved",
            reviews: "Reviews",
            built: "Tools Built"
        },
        tabs: {
            collection: "My Collection",
            reviews: "My Reviews"
        },
        collections: {
            emptyTitle: "Your collection is empty",
            emptyText: "Discover amazing AI tools and save them to your profile to build your personal toolkit.",
            explore: "Explore Directory"
        },
        reviews: {
            emptyTitle: "No reviews yet",
            emptyText: "Your feedback helps the community discover the best tools and services."
        }
    },

    // 2. Public Profile Section
    public: {
        seo: {
            title: (name) => `${name}'s Professional Portfolio | ServicesHUB`,
            defaultTitle: "Publisher Profile | ServicesHUB",
            description: (bio) => bio || "Discover high-quality AI tools and services published by this creator on ServicesHUB."
        },
        hero: {
            defaultRole: "Developer",
            joined: "Joined in",
            website: "Visit Website",
            defaultBio: "No bio provided yet.",
            statsLabel: "Tools Published",
            shareBtn: "Share Profile",
            copiedBtn: "Link Copied!"
        },
        portfolio: {
            titleStart: "Published",
            titleHighlight: "Portfolio",
            emptyTitle: "No tools yet",
            emptyText: "This developer hasn't published any tools to the directory yet."
        },
        breadcrumbs: (name) => [
            { label: 'Home', path: '/' }, 
            { label: 'Publishers', path: '/tools' }, 
            { label: name || 'Profile' }
        ],
        notFound: {
            title: "Publisher not found",
            text: "The profile you are looking for does not exist or has been removed.",
            returnHome: "Return Home"
        }
    },

    // 3. Shared Shared Components
    about: {
        title: "About",
        identity: "Professional Identity",
        socials: "Connect & Socials",
        noSocials: "No social links connected.",
        noBio: "No bio provided yet.",
        defaultRole: "User / Seeker",
        joined: "Joined",
        website: "Website"
    },
    
    // 4. Optimization & Loading (Rule #30)
    SKELETON_COUNTS: {
        PORTFOLIO: 6,
        COLLECTIONS: 6,
        SOCIALS: 3,
        STATS: 3
    }
};

// Legacy support if needed, but we should migrate components to PROFILE_UI_CONSTANTS
export const PROFILE_CONSTANTS = {
    DEFAULT_JOIN_YEAR: 2026,
    DEFAULT_ROLE: 'Member',
    AVATAR_SIZE: '100px',
    AVATAR_RADIUS: '24px',
    BIO_MAX_LENGTH: 160
};
