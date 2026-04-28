/**
 * LEGAL_UI_CONSTANTS
 * Rule #14: Centralized UI labels and SEO data for Legal Pages
 */
export const LEGAL_UI_CONSTANTS = {
    privacy: {
        seo: {
            title: "Privacy Policy | ServicesHUB Data Safety",
            description: "Learn how ServicesHUB handles and protects your data. Transparency and security are our top priorities."
        },
        hero: {
            title: "Privacy",
            highlight: "Policy",
            subtitle: "Last updated: March 26, 2026",
            breadcrumbs: [
                { label: 'Home', path: '/' },
                { label: 'Privacy Policy' }
            ]
        },
        sections: [
            {
                id: 1,
                title: "Data Collection",
                content: "We collect basic information when you use ServicesHUB, such as your email address when you sign up or submit a tool. This information is used solely to provide our services and communicate with you."
            },
            {
                id: 2,
                title: "Security",
                content: "We take data security seriously. We use modern encryption and industry-standard practices to ensure your account information remains safe and protected from unauthorized access."
            },
            {
                id: 3,
                title: "Third-Party Links",
                content: "Our directory contains links to external websites. We are not responsible for the privacy practices or content of these third-party platforms. We encourage you to read their privacy policies."
            },
            {
                id: 4,
                title: "Your Rights",
                content: "You have the right to access, update, or delete your personal information at any time from your profile settings. For any data-related queries, please contact our support team."
            }
        ]
    },
    terms: {
        seo: {
            title: "Terms of Service | ServicesHUB Legal",
            description: "Read the terms and conditions for using the ServicesHUB platform and submitting your tools."
        },
        hero: {
            title: "Terms of",
            highlight: "Service",
            subtitle: "Last updated: March 26, 2026",
            breadcrumbs: [
                { label: 'Home', path: '/' },
                { label: 'Terms of Service' }
            ]
        },
        sections: [
            {
                id: 1,
                title: "Acceptance of Terms",
                content: "By accessing and using ServicesHUB, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform."
            },
            {
                id: 2,
                title: "Tool Submissions",
                content: "When submitting a tool, you guarantee that the information provided is accurate and that you have the right to share such content. We reserve the right to review and reject any submission."
            },
            {
                id: 3,
                title: "Platform Usage",
                content: "You agree to use ServicesHUB for lawful purposes only and in a way that does not infringe the rights of others or restrict their use and enjoyment of the platform."
            },
            {
                id: 4,
                title: "Modifications",
                content: "We reserve the right to modify these terms at any time. Significant changes will be communicated via the platform. Continued use of ServicesHUB constitutes acceptance of the modified terms."
            }
        ]
    },
    SKELETON_COUNTS: {
        sections: [1, 2, 3, 4]
    }
};
