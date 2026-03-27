import React from 'react';
import { MessageSquare, Image, Code, LayoutGrid } from 'lucide-react';

export const toolsData = [
    {
        id: 1,
        name: "ChatGPT Plus",
        tag: "Best for Writing",
        category: "AI Writing",
        icon: <MessageSquare size={24} />,
        rating: 4.9,
        reviews: 1250,
        price: "$20/mo",
        status: "Popular",
        shortDesc: "The world's most advanced AI conversational model for writing and brainstorming.",
        desc: "ChatGPT is a revolutionary language model that allows you to have human-like conversations. It can answer questions, help you write emails, essays, and code, and even generate ideas for your business. With the Plus version, you get early access to new features like GPT-4o.",
        features: [
            "Advanced reasoning and creativity",
            "Multi-modal capabilities (Voice, Vision)",
            "Custom GPTs creation",
            "Real-time web browsing",
            "DALL-E 3 image generation"
        ],
        author: "OpenAI",
        link: "https://chatgpt.com"
    },
    {
        id: 2,
        name: "Midjourney v6",
        tag: "Top Rated",
        category: "Generative Art",
        icon: <Image size={24} />,
        rating: 4.8,
        reviews: 890,
        price: "$10/mo",
        status: "Best Art",
        shortDesc: "High-quality AI image generation specialized in artistic and realistic styles.",
        desc: "Midjourney is an independent research lab exploring new mediums of thought and expanding the imaginative powers of the human species. Their tool translates text prompts into stunningly detailed artistic images, making it a favorite for designers and artists.",
        features: [
            "Ultra-realistic textures",
            "Advanced aspect ratio control",
            "Character and Style consistency",
            "Pan and Zoom features",
            "Fastest GPU generation times"
        ],
        author: "Midjourney Inc.",
        link: "https://midjourney.com"
    },
    {
        id: 3,
        name: "Cursor AI",
        tag: "Dev Choice",
        category: "Development",
        icon: <Code size={24} />,
        rating: 4.9,
        reviews: 420,
        price: "Free / $20/mo",
        status: "Trending",
        shortDesc: "An AI-first code editor designed for pair programming with powerful LLMs.",
        desc: "Cursor is a fork of VS Code that integrates AI at its core. It understands your entire codebase, allows you to edit code with natural language, and provides a 'Composer' feature that can write multiple files at once based on your instructions.",
        features: [
            "Full codebase indexing",
            "Natural language refactoring",
            "Chat with your documentation",
            "One-click bug fixing",
            "Composer mode for multi-file edits"
        ],
        author: "Anysphere",
        link: "https://cursor.com"
    },
    {
        id: 4,
        name: "Framer",
        tag: "No-Code",
        category: "Design",
        icon: <LayoutGrid size={24} />,
        rating: 4.7,
        reviews: 670,
        price: "Free",
        status: "Top Built",
        shortDesc: "Build lightning-fast, visually stunning websites with no code.",
        desc: "Framer is the fastest way to build professional websites. It combines design and publishing in one tool. You can design your site on a freeform canvas and publish it with one click. Its AI features help you generate layouts and content instantly.",
        features: [
            "Real-time collaboration",
            "Responsive layout engine",
            "AI site generation",
            "Advanced animations & effects",
            "Direct publishing to custom domains"
        ],
        author: "Framer B.V.",
        link: "https://framer.com"
    }
];

export const tools = toolsData;
