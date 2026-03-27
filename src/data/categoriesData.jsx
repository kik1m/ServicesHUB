import { LayoutGrid, Sparkles, Code, Pen, Database, Globe, Music, Image, Share2, MessageSquare, Brain } from 'lucide-react';

export const categoriesData = [
    { id: 'ai-writing', name: 'AI Writing', icon: <Pen size={32} />, count: 120, color: '#0088cc', desc: 'Enhance your content creation with powerful AI writing and editing tools.' },
    { id: 'generative-art', name: 'Generative Art', icon: <Image size={32} />, count: 85, color: '#00d2ff', desc: 'Turn text into stunning visuals and digital art with ease.' },
    { id: 'development', name: 'Development', icon: <Code size={32} />, count: 150, color: '#7000ff', desc: 'Speed up your coding workflow with AI-powered IDEs and generators.' },
    { id: 'marketing', name: 'Marketing', icon: <Globe size={32} />, count: 200, color: '#ff00c8', desc: 'Optimize your campaigns and improve reach using AI analytics and automation.' },
    { id: 'automation', name: 'Automation', icon: <Database size={32} />, count: 95, color: '#00ffaa', desc: 'Automate repetitive tasks and connect your favorite apps seamlessly.' },
    { id: 'video-editing', name: 'Video Editing', icon: <Sparkles size={32} />, count: 45, color: '#ffcc00', desc: 'Create and edit high-quality videos using the power of neural networks.' },
    { id: 'audio-music', name: 'Audio & Music', icon: <Music size={32} />, count: 32, color: '#ff5500', desc: 'Generate music and clean up audio tracks with advanced AI algorithms.' },
    { id: 'social-media', name: 'Social Media', icon: <Share2 size={32} />, count: 68, color: '#0066ff', desc: 'Grow your social presence with AI-generated posts and scheduled content.' },
    { id: 'ai-chat', name: 'AI Chat', icon: <MessageSquare size={32} />, count: 42, color: '#7c4dff', desc: 'Intelligent conversational agents for support, research, and fun.' }
];
