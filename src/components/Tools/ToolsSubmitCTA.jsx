import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const ToolsSubmitCTA = () => {
    return (
        <div className="glass-card submit-cta-card">
            <Zap size={32} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
            <h3 className="section-title-mini">Missing a great tool?</h3>
            <p className="cta-description">
                Help the community discover the best AI solutions. If you know a tool that should be here, let us know!
            </p>
            <Link to="/submit" className="btn-outline">Submit Your Tool Now</Link>
        </div>
    );
};

export default ToolsSubmitCTA;
