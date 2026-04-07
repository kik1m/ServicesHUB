import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Star, Zap, LayoutGrid, Cpu, Code, Palette, Globe, CheckCircle2, TrendingUp } from 'lucide-react';

const iconMap = {
    Zap: Zap,
    LayoutGrid: LayoutGrid,
    Cpu: Cpu,
    Code: Code,
    Palette: Palette,
    Globe: Globe
};

const ToolCard = ({ tool }) => {
    const renderIcon = () => {
        if (tool.image_url) {
            return (
                <img 
                    src={tool.image_url} 
                    alt={tool.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<div style="color:var(--primary);display:flex;align-items:center;justify-content:center;height:100%"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>`;
                    }}
                />
            );
        }
        const IconComponent = iconMap[tool.icon_name] || Zap;
        return <IconComponent size={24} color="var(--primary)" />;
    };

    return (
        <Link 
            to={`/tool/${tool.slug}`} 
            className={`tool-card ${tool.is_featured ? 'featured-glow-card' : 'standard-tool-card'}`}
        >
            <div className="card-logo-box">
                {renderIcon()}
            </div>

            <div className="card-content">
                <div className="card-title-row">
                    <h3>{tool.name}</h3>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {tool.is_verified && (
                            <div className="badge-pill-verified" title="Verified Tool">
                                <CheckCircle2 size={12} strokeWidth={3} />
                            </div>
                        )}
                        <div className="badge-pill-price">
                            {tool.pricing_type || 'Free'}
                        </div>
                    </div>
                </div>
                
                <p>{tool.short_description || tool.description}</p>
            </div>

            <div className="card-footer">
                <div className="card-rating">
                    <Star size={12} fill="#ffaa00" /> 
                    <span>{tool.rating?.toFixed(1) || '5.0'}</span>
                </div>
                <div className="card-link">
                    View <ArrowUpRight size={14} />
                </div>
            </div>
        </Link>
    );
};

export default ToolCard;
