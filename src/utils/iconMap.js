import React from 'react';
import { 
    MessageSquare, Image, Code, LayoutGrid, Sparkles, Zap, Shield, Cpu, PenTool, Globe, Search, TrendingUp, Award, ShieldCheck, Smartphone, Terminal, Video, Music, Palette
} from 'lucide-react';

const icons = {
    MessageSquare: React.createElement(MessageSquare, { size: 24 }),
    Image: React.createElement(Image, { size: 24 }),
    Code: React.createElement(Code, { size: 24 }),
    LayoutGrid: React.createElement(LayoutGrid, { size: 24 }),
    Sparkles: React.createElement(Sparkles, { size: 24 }),
    Zap: React.createElement(Zap, { size: 24 }),
    Shield: React.createElement(Shield, { size: 24 }),
    Cpu: React.createElement(Cpu, { size: 24 }),
    PenTool: React.createElement(PenTool, { size: 24 }),
    Globe: React.createElement(Globe, { size: 24 }),
    Search: React.createElement(Search, { size: 24 }),
    TrendingUp: React.createElement(TrendingUp, { size: 24 }),
    Award: React.createElement(Award, { size: 24 }),
    ShieldCheck: React.createElement(ShieldCheck, { size: 24 }),
    Smartphone: React.createElement(Smartphone, { size: 24 }),
    Terminal: React.createElement(Terminal, { size: 24 }),
    Video: React.createElement(Video, { size: 24 }),
    Music: React.createElement(Music, { size: 24 }),
    Palette: React.createElement(Palette, { size: 24 })
};

export const getIcon = (name, size = 24) => {
    const IconComponent = icons[name] || React.createElement(Sparkles, { size: size });
    return React.cloneElement(IconComponent, { size });
};
