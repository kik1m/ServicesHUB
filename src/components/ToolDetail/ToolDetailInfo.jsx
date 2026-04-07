import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const ToolDetailInfo = ({ tool }) => {
    return (
        <div className="tool-main-info">
            <div className="detail-section">
                <h3 className="section-subtitle">About <span className="gradient-text">{tool.name}</span></h3>
                <p className="section-text">{tool.description}</p>
            </div>

            <div className="detail-section">
                <h3 className="section-subtitle">Key Features</h3>
                <div className="features-checklist">
                    {tool.features?.map((feature, i) => (
                        <div key={i} className="glass-card feature-item-premium">
                            <div className="feature-icon-box">
                                <CheckCircle2 size={24} />
                            </div>
                            <p className="feature-text">{feature}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ToolDetailInfo;
