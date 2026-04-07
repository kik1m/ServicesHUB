import React from 'react';
import { X, Star, ExternalLink, Search } from 'lucide-react';

const ToolCompareColumn = ({ tool, slot, onClear, onSelect }) => {
    return (
        <div className="compare-column" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {tool ? (
                <div className="glass-card active-tool-card">
                    <button 
                        onClick={onClear} 
                        style={{ 
                            position: 'absolute', top: '20px', right: '20px', 
                            background: 'rgba(255,255,255,0.05)', border: 'none', 
                            color: 'var(--text-muted)', cursor: 'pointer', 
                            width: '32px', height: '32px', borderRadius: '50%', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center' 
                        }}
                    >
                        <X size={16} />
                    </button>
                    
                    <div className="tool-logo-large">
                        {tool.image_url ? (
                            <img src={tool.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            tool.name.charAt(0)
                        )}
                    </div>
                    
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.2rem', margin: 0 }}>{tool.name}</h3>
                    
                    <div style={{ color: 'var(--secondary)', fontWeight: '700', fontSize: '0.85rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                         {tool.categories?.name}
                         {tool.is_verified && <Star size={12} fill="var(--secondary)" color="var(--secondary)" />}
                    </div>
                    
                    <div className="compare-stats">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#ffc107', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Star size={16} fill="#ffc107" /> {tool.rating || '5.0'}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Rating</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: '900' }}>{tool.reviews_count || '0'}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Reviews</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                         <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                             <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Pricing</div>
                             <div style={{ fontWeight: '800', fontSize: '1rem' }}>{tool.pricing_type}</div>
                         </div>
                         <a href={tool.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: '100%', textDecoration: 'none', fontSize: '0.85rem', padding: '10px' }}>
                             Visit Site <ExternalLink size={14} />
                         </a>
                    </div>
                </div>
            ) : (
                <div 
                    className="glass-card select-tool-placeholder" 
                    onClick={onSelect}
                >
                    <div style={{ width: '70px', height: '70px', margin: '0 auto 1.5rem', borderRadius: '50%', background: 'rgba(0,210,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                        <Search size={30} />
                    </div>
                    <h3 style={{ marginBottom: '0.5rem', margin: 0 }}>Select Tool {slot}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, marginTop: '8px' }}>Choose an AI tool to compare side-by-side.</p>
                </div>
            )}
        </div>
    );
};

export default ToolCompareColumn;
