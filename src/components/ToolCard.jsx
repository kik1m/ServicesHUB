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
        <Link to={`/tool/${tool.slug}`} className={`glass-card tool-card compact-glass-card ${tool.is_featured ? 'featured-glow-card' : ''}`} style={{ 
            textDecoration: 'none', 
            textAlign: 'left', 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            transition: '0.3s',
            position: 'relative'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    overflow: 'hidden', 
                    border: '1px solid var(--border)' 
                }}>
                    {renderIcon()}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                    {tool.is_featured && (
                        <div className="featured-badge" title="Featured Tool" style={{ padding: '2px 8px', fontSize: '10px' }}>
                            <TrendingUp size={8} style={{ marginRight: '3px' }} /> Featured
                        </div>
                    )}
                    <div className="tool-tag" style={{ padding: '2px 8px', fontSize: '10px' }}>
                        {tool.pricing_type || 'Free'}
                    </div>
                </div>
            </div>
            
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: 'white' }}>{tool.name}</h3>
                    {tool.is_verified && (
                        <div className="verified-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '1px 6px', fontSize: '9px' }}>
                            <CheckCircle2 size={10} fill="rgba(0,210,255,0.2)" /> Verified
                        </div>
                    )}
                </div>
                <p style={{ 
                    color: 'var(--text-muted)', 
                    fontSize: '0.85rem', 
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    margin: 0
                }}>
                    {tool.short_description || tool.description}
                </p>
            </div>

            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginTop: '0.5rem', 
                paddingTop: '0.8rem', 
                borderTop: '1px solid var(--border)' 
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffcc00', fontWeight: '700', fontSize: '0.8rem' }}>
                        <Star size={12} fill="#ffcc00" /> {tool.rating?.toFixed(1) || '5.0'}
                    </div>
                </div>
                <div style={{ 
                    color: 'var(--primary)', 
                    fontWeight: '700', 
                    fontSize: '0.8rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px' 
                }}>
                    View Details <ArrowUpRight size={12} />
                </div>
            </div>
        </Link>
    );
};

export default ToolCard;
