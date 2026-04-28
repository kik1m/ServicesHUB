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
    CheckCircle2
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
    { label: 'Tools', path: '/tools', icon: LayoutGrid },
    { label: 'Comparison', path: '/compare', icon: RefreshCcw },
    { label: 'Promote', path: '/promote', icon: Sparkles },
];

// 🧠 Smart More Dropdown (Verified Real Routes)
export const MORE_GROUPS = [
    {
        title: 'Premium & Tools',
        links: [
            { label: 'Categories', path: '/categories', icon: Zap },
            { label: 'Blog', path: '/blog', icon: Rss },
            { label: 'Premium Membership', path: '/premium', icon: Star },
            { label: 'Advanced Search', path: '/search', icon: Search },
        ]
    },
    {
        title: 'Support Center',
        links: [
            { label: 'About HUBly', path: '/about', icon: Info },
            { label: 'Contact Us', path: '/contact', icon: Mail },
            { label: 'Help & FAQ', path: '/faq', icon: HelpCircle },
        ]
    },
    {
        title: 'Legal & Compliance',
        links: [
            { label: 'Privacy Policy', path: '/privacy', icon: Shield },
            { label: 'Terms of Service', path: '/terms', icon: FileText },
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
            { label: 'Tools', path: '/tools', icon: LayoutGrid },
            { label: 'Categories', path: '/categories', icon: Zap },
            { label: 'Promote', path: '/promote', icon: Sparkles },
            { label: 'Blog', path: '/blog', icon: Rss },
            { label: 'Premium', path: '/premium', icon: Star },
        ]
    },
    {
        title: 'Account',
        auth: true,
        links: [
            { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            { label: 'Submit Tool', path: '/submit', icon: PlusCircle },
            { label: 'Profile', path: '/profile', icon: User },
            { label: 'Settings', path: '/settings', icon: Settings },
        ]
    },
    {
        title: 'Support',
        links: [
            { label: 'Contact Us', path: '/contact', icon: Mail },
            { label: 'FAQ', path: '/faq', icon: HelpCircle },
            { label: 'About', path: '/about', icon: Info },
        ]
    }
];
