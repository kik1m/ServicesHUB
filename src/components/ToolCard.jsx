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
            return <img src={tool.image_url} alt={tool.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
        }
        const IconComponent = iconMap[tool.icon_name] || Zap;
        return <IconComponent size={24} color="var(--primary)" />;
    };

    return (
        <Link to={`/tool/${tool.slug}`} className="glass-card tool-card" style={{ 
            textDecoration: 'none', 
            textAlign: 'left', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.2rem',
            padding: '1.5rem',
            height: '100%',
            transition: '0.3s'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    borderRadius: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    overflow: 'hidden', 
                    border: '1px solid var(--border)' 
                }}>
                    {renderIcon()}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {tool.is_featured && (
                        <div className="featured-badge" title="Featured Tool">
                            <TrendingUp size={10} style={{ marginRight: '4px' }} /> Featured
                        </div>
                    )}
                    <div className="tool-tag">
                        {tool.pricing_type || 'Free'}
                    </div>
                </div>
            </div>
            
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'white' }}>{tool.name}</h3>
                    {tool.is_verified && (
                        <div className="verified-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px' }}>
                            <CheckCircle2 size={12} fill="rgba(0,210,255,0.2)" /> Verified
                        </div>
                    )}
                </div>
                <p style={{ 
                    color: 'var(--text-muted)', 
                    fontSize: '0.9rem', 
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {tool.short_description || tool.description}
                </p>
            </div>

            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginTop: 'auto', 
                paddingTop: '1rem', 
                borderTop: '1px solid var(--border)' 
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffcc00', fontWeight: '700', fontSize: '0.85rem' }}>
                        <Star size={14} fill="#ffcc00" /> {tool.rating?.toFixed(1) || '5.0'}
                    </div>
                </div>
                <div style={{ 
                    color: 'var(--primary)', 
                    fontWeight: '700', 
                    fontSize: '0.85rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '5px' 
                }}>
                    View Details <ArrowUpRight size={14} />
                </div>
            </div>
        </Link>
    );
};

export default ToolCard;
