/**
 * ABOUT_UI_CONSTANTS
 * Rule #14: Centralized UI labels and SEO data for About Page
 */
export const ABOUT_UI_CONSTANTS = {
    seo: {
        title: "About Hubly | Our Mission & Vision",
        description: "Learn about the mission, vision, and the team behind Hubly - your curated platform for tool discovery."
    },
    hero: {
        title: "Our",
        highlight: "Mission",
        subtitle: "Bridging the gap between innovators and high-performance tools through expert curation and elite architecture.",
        breadcrumbs: [
            { label: 'Home', path: '/' },
            { label: 'About Us' }
        ]
    },
    mission: {
        title: "Our",
        highlight: "Mission",
        description: "We believe that the right tool can transform a workflow. Our goal is to bridge the gap between innovation and implementation by providing a seamless experience for finding the exact tool you need.",
        points: [
            {
                title: "Focus on Quality",
                description: "Only the most reliable and high-performing tools make it to our platform."
            },
            {
                title: "Radical Transparency",
                description: "Honest reviews and clear pricing structures for everything we list."
            },
            {
                title: "Security First",
                description: "Every tool undergoes a safety check before being featured on our platform."
            },
            {
                title: "Community Led",
                description: "Driven by feedback from our global community of creators."
            }
        ]
    },
    stats: [
        { label: "Active Users", value: "10k+" },
        { label: "Curated Tools", value: "250+" },
        { label: "Countries", value: "50+" },
        { label: "Availability", value: "24/7" }
    ],
    sideCards: {
        vision: {
            title: "Our Vision",
            description: "To become the global standard for software discovery, where every project finds its perfect technical companion."
        },
        growth: {
            title: "Constant Growth",
            description: "We are constantly iterating, adding new features, and refining our database to serve you better every day."
        },
        join: {
            title: "Join the Journey",
            description: "Have a tool to share? Be part of our growing ecosystem.",
            button: "Submit a Tool"
        }
    }
};
