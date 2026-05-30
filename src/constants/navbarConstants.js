import { 
    LayoutGrid, 
    Zap, 
    Sparkles, 
    Star, 
    Rss, 
    Info, 
    RefreshCcw, 
    HelpCircle,
    User,
    PlusCircle,
    LayoutDashboard,
    Settings,
    Mail,
    Shield,
    FileText,
    Search,
    Bell,
    CheckCircle2,
    Bot
} from 'lucide-react';

export const NAV_LABELS = {
    SEARCH_PLACEHOLDER: "Search tools...",
    MORE: "More",
    LOGIN: "Login",
    SUBMIT: "Submit Tool",
    PREMIUM_CTA: "Go Premium",
    UPGRADE_CTA: "Upgrade to Premium",
    SIGNOUT: "Secure Sign Out",
    FOOTER_TEXT: "© 2026 HUBly Platform. V2.1.0-PRO"
};

// 🌟 Main Navbar Links (Visible outside)
export const NAV_LINKS = [
    { label: 'AI Studio', path: '/ai-engine', icon: Bot },
    { label: 'Tools', path: '/tools', icon: LayoutGrid },
    { label: 'Comparison', path: '/compare', icon: RefreshCcw },
    { label: 'Promote', path: '/promote', icon: Sparkles },
];

// 🧠 Smart More Dropdown (Verified Real Routes)
export const MORE_GROUPS = [
    {
        title: 'Explore & Features',
        links: [
            { label: 'Categories', path: '/categories', icon: Star },
            { label: 'Premium Membership', path: '/premium', icon: Zap },
            { label: 'Blog & Articles', path: '/blog', icon: Rss },
        ]
    },
    {
        title: 'Support Center',
        links: [
            { label: 'About HUBly', path: '/about', icon: Info },
            { label: 'Contact Us', path: '/contact', icon: Mail },
            { label: 'Documentation Hub', path: '/docs', icon: HelpCircle },
        ]
    },
    {
        title: 'Legal & Compliance',
        links: [
            { label: 'Privacy Policy', path: '/docs/privacy', icon: Shield },
            { label: 'Terms of Service', path: '/docs/terms', icon: FileText },
        ]
    }
];

// 👤 User Specific Links
export const USER_MENU_LINKS = [
    { label: 'Public Profile', path: '/profile', icon: User },
    { label: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Account Settings', path: '/settings', icon: Settings },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Submit Resource', path: '/submit', icon: PlusCircle },
];

export const MOBILE_GROUPS = [
    {
        title: 'Explore',
        links: [
            { label: 'AI Studio', path: '/ai-engine', icon: Bot },
            { label: 'Tools Directory', path: '/tools', icon: LayoutGrid },
            { label: 'Compare Engine', path: '/compare', icon: RefreshCcw },
            { label: 'Categories', path: '/categories', icon: Star },
            { label: 'Blog & Articles', path: '/blog', icon: Rss },
            { label: 'Premium Upgrade', path: '/premium', icon: Zap },
        ]
    },
    {
        title: 'Creator Studio',
        auth: true, // Only visible to logged-in users
        links: [
            { label: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
            { label: 'Submit Tool', path: '/submit', icon: PlusCircle },
            { label: 'Promote Tool', path: '/promote', icon: Sparkles },
            { label: 'Notifications', path: '/notifications', icon: Bell },
        ]
    },
    {
        title: 'Account Settings',
        auth: true, // Only visible to logged-in users
        links: [
            { label: 'General Settings', path: '/settings', icon: Settings },
        ]
    },
    {
        title: 'Join HUBly',
        auth: false, // Only visible to guests
        links: [
            { label: 'Login / Register', path: '/auth', icon: User, variant: 'primary' },
            { label: 'Submit Tool', path: '/submit', icon: PlusCircle },
            { label: 'Promote Tool', path: '/promote', icon: Sparkles },
        ]
    },
    {
        title: 'Support & Legal',
        links: [
            { label: 'Documentation Hub', path: '/docs', icon: HelpCircle },
            { label: 'Contact Us', path: '/contact', icon: Mail },
            { label: 'About Platform', path: '/about', icon: Info },
            { label: 'Privacy Policy', path: '/docs/privacy', icon: Shield },
            { label: 'Terms of Service', path: '/docs/terms', icon: FileText },
        ]
    }
];

// 🦶 Unified Footer Links
export const FOOTER_GROUPS = [
    {
        title: 'Explore',
        links: [
            { label: 'AI Studio', path: '/ai-engine' },
            { label: 'Tools Directory', path: '/tools' },
            { label: 'Compare Engine', path: '/compare' },
            { label: 'Categories', path: '/categories' },
            { label: 'Blog & Articles', path: '/blog' },
            { label: 'Premium Membership', path: '/premium' }
        ]
    },
    {
        title: 'Platform',
        links: [
            { label: 'Submit Tool', path: '/submit' },
            { label: 'Promote Tool', path: '/promote' },
            { label: 'About Us', path: '/about' },
            { label: 'Contact', path: '/contact' },
        ]
    },
    {
        title: 'Documentation',
        links: [
            { label: 'Docs Home', path: '/docs' },
            { label: 'AI Assistant Guide', path: '/docs/ai-assistant' },
            { label: 'Privacy Policy', path: '/docs/privacy' },
            { label: 'Terms of Service', path: '/docs/terms' },
        ]
    }
];
