/**
 * LEGAL_UI_CONSTANTS
 * Rule #14: Centralized UI labels and SEO data for Legal Pages
 */
export const LEGAL_UI_CONSTANTS = {
    privacy: {
        seo: {
            title: "Privacy Policy | HUBly Data Safety",
            description: "Learn how HUBly handles and protects your data. Transparency and security are our top priorities."
        },
        hero: {
            title: "Privacy",
            highlight: "Policy",
            subtitle: "Last updated: May 01, 2026",
            breadcrumbs: [
                { label: 'Home', path: '/' },
                { label: 'Privacy Policy' }
            ]
        },
        sections: [
            {
                id: 1,
                title: "Information Collection",
                content: "At HUBly, we collect information necessary to provide a premium AI directory experience. This includes your account details (email and name) provided via Supabase Auth, and technical data like IP addresses and browser types collected through Google Analytics to improve our service."
            },
            {
                id: 2,
                title: "Payment Processing",
                content: "All financial transactions are processed securely through Lemon Squeezy. HUBly does not store or have access to your credit card details or bank information. Lemon Squeezy acts as our Merchant of Record and handles all PCI-compliant data handling."
            },
            {
                id: 3,
                title: "Third-Party Services",
                content: "We utilize industry-leading third-party services to ensure platform stability. This includes Supabase for database management and Resend for transactional emails. Each service has its own privacy policy, and we encourage you to review them to understand how they handle your data."
            },
            {
                id: 4,
                title: "Cookies & Tracking",
                content: "We use cookies to maintain your session and understand how you interact with our platform. You can manage cookie preferences through your browser settings. Note that disabling cookies may affect certain functionalities like tool favorites and dashboard access."
            },
            {
                id: 5,
                title: "Your Data Rights",
                content: "You have full control over your data. At any time, you can request to export your data or delete your account entirely through the Settings panel. Deleted accounts are permanently removed from our active databases, including all saved favorites and submissions."
            }
        ]
    },
    terms: {
        seo: {
            title: "Terms of Service | HUBly Legal",
            description: "Read the terms and conditions for using the HUBly platform and submitting your tools."
        },
        hero: {
            title: "Terms of",
            highlight: "Service",
            subtitle: "Last updated: May 01, 2026",
            breadcrumbs: [
                { label: 'Home', path: '/' },
                { label: 'Terms of Service' }
            ]
        },
        sections: [
            {
                id: 1,
                title: "Agreement to Terms",
                content: "By accessing HUBly, you agree to comply with and be bound by these Terms of Service. These terms apply to all visitors, users, and creators who access or use the Service. Use of the platform constitutes your acceptance of these rules."
            },
            {
                id: 2,
                title: "User Responsibilities",
                content: "Users are responsible for maintaining the confidentiality of their accounts. You agree to provide accurate information when submitting tools. HUBly reserves the right to remove any content that is deemed inappropriate, misleading, or violates intellectual property rights."
            },
            {
                id: 3,
                title: "Submissions & IP",
                content: "By submitting a tool to HUBly, you grant us a non-exclusive right to display and promote your resource. You retain all ownership rights to your original content. You must ensure you have the legal right to list any tool you submit to our directory."
            },
            {
                id: 4,
                title: "Premium Services",
                content: "Premium memberships and tool promotions are subject to payment through Lemon Squeezy. Prices are subject to change, but we will notify active users of significant adjustments. Refund requests are handled according to Lemon Squeezy's standard policies."
            },
            {
                id: 5,
                title: "Limitation of Liability",
                content: "HUBly is a directory service. We are not responsible for the performance, safety, or legality of the third-party tools listed on our platform. Users interact with external resources at their own risk."
            }
        ]
    },
    SKELETON_COUNTS: {
        sections: [1, 2, 3, 4, 5]
    }
};
