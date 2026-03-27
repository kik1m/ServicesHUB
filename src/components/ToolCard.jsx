import React from 'react';
import { ExternalLink } from 'lucide-react';

const ToolCard = ({ tool }) => {
    return (
        <div className="glass-card" style={{ 
            padding: '1.5rem', 
            transition: '0.3s',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            height: '100%'
        }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '16px', 
                    background: 'var(--gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    fontSize: '1.2rem',
                    fontWeight: '800',
                    color: 'white',
                    flexShrink: 0
                }}>
                    {tool.name.charAt(0)}
                </div>
                <div style={{ flexGrow: 1 }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 4px 0' }}>{tool.name}</h4>
                    <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        background: 'rgba(0, 243, 255, 0.1)', 
                        color: 'var(--secondary)', 
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        {tool.category}
                    </span>
                </div>
            </div>

            <p style={{ 
                fontSize: '0.85rem', 
                color: 'var(--text-muted)', 
                lineHeight: '1.6',
                flexGrow: 1,
                marginBottom: '1rem'
            }}>
                {tool.description}
            </p>

            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border)'
            }}>
                <span style={{ 
                    fontSize: '0.8rem', 
                    fontWeight: '600', 
                    color: 'var(--text-muted)' 
                }}>
                    {tool.type}
                </span>
                <button style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--primary)', 
                    background: 'transparent', 
                    border: 'none', 
                    fontWeight: '700', 
                    fontSize: '0.85rem', 
                    cursor: 'pointer',
                    transition: '0.2s'
                }}>
                    VIEW <ExternalLink size={14} />
                </button>
            </div>
        </div>
    );
};

export default ToolCard;
