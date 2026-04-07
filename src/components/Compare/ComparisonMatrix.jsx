import React from 'react';
import { Check, Minus } from 'lucide-react';

const ComparisonMatrix = ({ tool1, tool2 }) => {
    if (!tool1 || !tool2) return null;

    const allFeatures = Array.from(new Set([
        ...(tool1.features || []),
        ...(tool2.features || [])
    ]));

    return (
        <div className="feature-matrix glass-card">
            <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>
                Feature <span className="gradient-text">Comparison</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' }}>
                {allFeatures.length > 0 ? allFeatures.map((feature, i) => (
                    <div key={i} className="feature-row">
                        <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{feature}</span>
                        <div style={{ textAlign: 'center' }}>
                            {(tool1.features || []).includes(feature) ? <Check size={18} color="#00ffaa" /> : <Minus size={18} color="rgba(255,255,255,0.1)" />}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            {(tool2.features || []).includes(feature) ? <Check size={18} color="#00ffaa" /> : <Minus size={18} color="rgba(255,255,255,0.1)" />}
                        </div>
                    </div>
                )) : (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}> 
                        No specific features listed for comparison. 
                    </div>
                )}
            </div>

            <div className="comparison-desc-grid">
                <div className="comparison-desc">
                    <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', fontWeight: '800', margin: 0 }}>About {tool1.name}</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.7', color: 'var(--text-muted)', margin: 0, marginTop: '1rem' }}>{tool1.description}</p>
                </div>
                <div className="comparison-desc">
                    <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', fontWeight: '800', margin: 0 }}>About {tool2.name}</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.7', color: 'var(--text-muted)', margin: 0, marginTop: '1rem' }}>{tool2.description}</p>
                </div>
            </div>
        </div>
    );
};

export default ComparisonMatrix;
