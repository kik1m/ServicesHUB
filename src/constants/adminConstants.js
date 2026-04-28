/**
 * ADMIN_UI_CONSTANTS
 * Rule #34/41: Centralized UI labels and SEO data for Admin Dashboard
 */
export const ADMIN_UI_CONSTANTS = {
    seo: {
        title: "Control Center | HUBLy Admin",
        description: "Orchestrate your ecosystem, curate high-fidelity tools, and manage platform growth."
    },
    header: {
        title: "Admin",
        titleHighlight: "Control Center",
        subtitle: "Manage tool approvals, blog content, user data, and platform settings from a central hub.",
        breadcrumbs: [
            { label: 'Home', path: '/' },
            { label: 'Admin Dashboard' }
        ]
    },
    tabs: [
        { id: 'pending', label: 'Approvals' },
        { id: 'manage-tools', label: 'Directory Manager' },
        { id: 'featured', label: 'Featured' },
        { id: 'blog', label: 'Blog Manager' },
        { id: 'add-tool', label: 'Quick Add' },
        { id: 'categories', label: 'Tool Categories' },
        { id: 'blog-categories', label: 'Blog Categories' },
        { id: 'users', label: 'Users' },
        { id: 'newsletter', label: 'Subscribers' }
    ],
    stats: {
        totalTools: "Total Tools",
        totalUsers: "Total Users",
        pendingApps: "Pending Apps",
        systemStatus: "System Status",
        online: "Online"
    },
    queue: {
        pendingTitle: "Approvals Queue",
        featuredTitle: "Featured Showcase",
        searchPlaceholder: "Add tool to featured...",
        searchResultTitle: "Search Results",
        empty: "No tools found in {status} status.",
        actions: {
            reviewUpdate: "Review Update",
            fullReview: "Full Review",
            featured: "Featured",
            featureThis: "Feature This",
            rejectTitle: "Reject & Delete"
        }
    },
    blog: {
        editor: {
            title: "Create New Article",
            placeholders: {
                title: "Article Title",
                category: "Select Category",
                excerpt: "Short Excerpt (Brief intro)...",
                content: "Article Content (HTML or Markdown supported)..."
            },
            submit: "Publish Article"
        },
        manager: {
            title: "Manage Articles",
            empty: "No articles found in the repository.",
            deleteConfirm: "Delete article?",
            deleteTitle: "Delete Article"
        }
    },
    settings: {
        addTool: {
            title: "Advanced Tool Acquisition",
            description: "Add a premium approved listing with full metadata and high-fidelity specifications.",
            sections: {
                identity: "Identity & Targeting",
                content: "Content & Messaging",
                assets: "Visual Assets",
                features: "Features & Specifications"
            },
            placeholders: {
                name: "Official Name",
                nameHint: "e.g. ChatGPT Plus",
                url: "Destination URL",
                urlHint: "https://example.com",
                category: "Select Category",
                pricing: "Pricing Type",
                pitch: "Marketing Pitch",
                pitchHint: "Brief, punchy sentence...",
                description: "Comprehensive Description",
                descriptionHint: "Detailed breakdown...",
                pricingDetails: "Pricing Specifics",
                pricingDetailsHint: "e.g. $20/mo",
                image: "Direct Image link...",
                feature: "Specification #{n}"
            },
            actions: {
                uploading: "Uploading...",
                chooseAsset: "Choose Creative Asset",
                manualMode: "Manual URL Mode",
                addFeature: "Add Specification",
                publish: "Publish Approved Listing"
            }
        },
        categories: {
            addTitle: "Add {type} Category",
            placeholders: {
                name: "Category Name",
                slug: "Slug (unique-id)",
                icon: "Lucide Icon Name"
            },
            inventory: "Current Inventory",
            deleteConfirm: "Delete category?"
        }
    },
    users: {
        managerTitle: "Users Manager",
        subscribersTitle: "Subscribers",
        badges: {
            totalUsers: "TOTAL USERS",
            totalEmails: "TOTAL EMAILS"
        },
        anonymous: "Anonymous User",
        premiumHint: "Premium Subscriber",
        joined: "Joined",
        subscribedOn: "Subscribed on",
        emptyNewsletter: "No newsletter subscribers found."
    },
    sidebar: {
        health: {
            title: "System Health",
            database: "Database",
            auth: "Auth Guard",
            stable: "Stable",
            active: "Active"
        },
        shortcuts: {
            title: "Admin Shortcuts",
            directory: "View Directory",
            blog: "View Public Blog"
        }
    },
    review: {
        updateTitle: "Review Data Update",
        newTitle: "Review New Tool Submission",
        entity: "Entity Name",
        none: "None",
        diff: {
            current: "CURRENT DATA",
            proposed: "PROPOSED UPDATE"
        },
        preview: {
            sourceTitle: "Official Source",
            visit: "Visit Original Site",
            tagline: "Marketing Tagline",
            desc: "Full Description",
            capabilities: "Features & Capabilities"
        },
        actions: {
            close: "Close Review",
            discard: "Discard Changes",
            reject: "Reject Submission",
            apply: "Apply Changes",
            approve: "Approve Tool"
        }
    },
    errors: {
        systemAccess: "System Access Error",
        operationFailed: "Operation Failed"
    },
    messages: {
        approvals: {
            updateApproved: "Data Update Approved",
            toolApproved: "New Tool Approved",
            updateApprovedDesc: "Modifications for \"{name}\" approved.",
            toolApprovedDesc: "\"{name}\" is now live.",
            rejectConfirm: "Reject changes for \"{name}\"?",
            deleteConfirm: "Reject and DELETE \"{name}\"?",
            rejectSubject: "Update Regarding Your Submission",
            rejectUpdateDesc: "Changes for \"{name}\" rejected.",
            rejectToolDesc: "Submission \"{name}\" not approved."
        }
    },
    platform: {
        teamId: '8ded6b0a-6982-495c-8ba8-fda45ac7e082',
        teamName: 'Team Hubly',
        verified: true
    }
};
