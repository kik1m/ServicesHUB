import { Sparkles, TrendingUp, BookOpen, Clock } from 'lucide-react';

export const blogCategories = [
    { name: 'AI Trends', icon: Sparkles },
    { name: 'SaaS Growth', icon: TrendingUp },
    { name: 'Tutorials', icon: BookOpen },
    { name: 'Productivity', icon: Clock }
];

export const blogPosts = [
    {
        id: 1,
        title: "How Generative AI is Changing the Future of SaaS in 2026",
        excerpt: "An in-depth look at how top-tier SaaS platforms are integrating LLMs to stay ahead of the competition.",
        content: `
            <p>The year 2026 marks a turning point for the SaaS industry. Artificial Intelligence is no longer just a feature; it's the core architecture. In this article, we explore how generative models are automating complex workflows that previously required dozens of human hours.</p>
            <h3>1. Hyper-Personalization</h3>
            <p>Modern SaaS tools can now adapt their UI and functionality in real-time based on user behavior patterns, creating a unique experience for every individual customer.</p>
            <h3>2. Autonomous Agents</h3>
            <p>We are seeing most tools move from "assistance" to "autonomy," where software can perform multi-step tasks independently.</p>
            <h3>Conclusion</h3>
            <p>Staying ahead in 2026 means embracing these changes early. HUBly is committed to bringing you the latest of these innovations.</p>
        `,
        author: "Alex Rivera",
        date: "March 20, 2026",
        category: "AI Trends",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
        readTime: "5 min read"
    },
    {
        id: 2,
        title: "5 AI Writing Tools You Must Know About This Year",
        excerpt: "Stop wasting time on writer's block. These 5 tools will handle everything from research to final editing.",
        content: `
            <p>Content creation has never been easier. Whether you're a professional blogger or a marketing manager, these tools are essential for your stack.</p>
            <ul>
                <li><strong>Tool 1:</strong> Best for SEO optimization.</li>
                <li><strong>Tool 2:</strong> Best for creative storytelling.</li>
                <li><strong>Tool 3:</strong> Best for academic research.</li>
            </ul>
        `,
        author: "Sarah Chen",
        date: "March 22, 2026",
        category: "Tutorials",
        image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80&w=1000",
        readTime: "8 min read"
    },
    {
        id: 3,
        title: "Boost Your Productivity: The Ultimate SaaS Stack for Remote Teams",
        excerpt: "Managing a remote team is hard. Having the right tools makes it seamless. Here's our top 10 list.",
        content: `
            <p>Remote work is here to stay. But to make it work, you need more than just Zoom. You need a synchronized ecosystem of tools.</p>
        `,
        author: "James Wilson",
        date: "March 24, 2026",
        category: "Productivity",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1000",
        readTime: "6 min read"
    }
];
