/**
 * Dashboard Constants - Elite Standard Configuration
 * Rule #14: Centralized store for all UI strings and labels.
 */

export const DASHBOARD_CONSTANTS = {
    header: {
        badge: "MEMBER AREA",
        creatorTitle: "Creator ",
        userTitle: "My ",
        mainTitle: "Dashboard",
        creatorSubtitle: "Monitoring your tool performance and listings in real-time.",
        userSubtitle: "Explore your saved favorites and manage your discovery journey.",
        actions: {
            share: "Share Profile",
            submit: "Submit Tool",
            copied: "Profile link copied!"
        }
    },
    stats: {
        creator: [
            { label: 'Total Submissions', type: 'submissions' },
            { label: 'Total Views', type: 'views' },
            { label: 'Total Clicks', type: 'clicks' }
        ],
        user: [
            { label: 'Saved Tools', type: 'favorites' },
            { label: 'Account Type', type: 'account' },
            { label: 'Plan Tier', type: 'tier' }
        ],
        tiers: {
            premium: "PREMIUM",
            free: "FREE",
            discovery: "Discovery"
        }
    },
    chart: {
        title: "Views Per Tool",
        subtitle: "Track engagement for each listing",
        badge: "Live Data",
        viewsLabel: "views",
        clicksLabel: "clicks",
        trendingText: "Top performing tools based on total engagement."
    },
    toolsTable: {
        title: "Active Listings",
        columns: {
            info: "Tool Info",
            status: "Status",
            marketing: "Marketing",
            pricing: "Pricing",
            views: "Views",
            clicks: "Clicks",
            actions: "Actions"
        },
        status: {
            published: "Published",
            pending: "Pending"
        },
        actions: {
            edit: "Edit",
            view: "View",
            delete: "Delete"
        },
        confirmDelete: "Are you sure you want to delete \"{name}\"? This action cannot be undone."
    },
    favorites: {
        title: "Saved Favorites",
        empty: {
            title: "No favorites yet",
            text: "Start exploring the directory to save your favorite tools.",
            action: "Browse Tools"
        }
    },
    welcome: {
        title: "Ready to ",
        highlight: "Launch",
        question: "?",
        desc: "Join our community of creators. Submit your tool today to get featured and reach thousands of makers worldwide.",
        action: "Submit Your First Tool"
    },
    notifications: {
        deleteSuccess: "Tool deleted successfully.",
        deleteError: "Error deleting tool: ",
        fetchError: "A connection error occurred while loading your dashboard.",
        syncError: "Unable to sync dashboard data completely."
    }
};

/**
 * Rule #30: Skeleton counts for stable rendering
 */
export const SKELETON_COUNTS = {
    STATS: [1, 2, 3],
    TOOLS_TABLE: [1, 2, 3],
    FAVORITES: [1, 2, 3],
    CHART: [1, 2, 3, 4, 5]
};

