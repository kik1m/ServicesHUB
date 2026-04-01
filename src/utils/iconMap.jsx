import React from 'react';
import { 
    MessageSquare, 
    Image, 
    Code, 
    LayoutGrid, 
    Sparkles, 
    Zap, 
    Shield, 
    Cpu, 
    PenTool, 
    Globe, 
    Search, 
    TrendingUp, 
    Award, 
    ShieldCheck, 
    Smartphone, 
    Terminal,
    Video,
    Music,
    Palette,
    Box,
    MousePointer2,
    Component,
    Layers,
    Rocket,
    Bot,
    Wand2
} from 'lucide-react';

const icons = {
    MessageSquare: <MessageSquare size={24} />,
    Image: <Image size={24} />,
    Code: <Code size={24} />,
    LayoutGrid: <LayoutGrid size={24} />,
    Sparkles: <Sparkles size={24} />,
    Zap: <Zap size={24} />,
    Shield: <Shield size={24} />,
    Cpu: <Cpu size={24} />,
    PenTool: <PenTool size={24} />,
    Globe: <Globe size={24} />,
    Search: <Search size={24} />,
    TrendingUp: <TrendingUp size={24} />,
    Award: <Award size={24} />,
    ShieldCheck: <ShieldCheck size={24} />,
    Smartphone: <Smartphone size={24} />,
    Terminal: <Terminal size={24} />,
    Video: <Video size={24} />,
    Music: <Music size={24} />,
    Palette: <Palette size={24} />,
    Box: <Box size={24} />,
    MousePointer2: <MousePointer2 size={24} />,
    Component: <Component size={24} />,
    Layers: <Layers size={24} />,
    Rocket: <Rocket size={24} />,
    Bot: <Bot size={24} />,
    Wand2: <Wand2 size={24} />
};

export const getIcon = (name, size = 24) => {
    const IconComponent = icons[name] || <Sparkles size={size} />;
    return React.cloneElement(IconComponent, { size });
};
