import React from 'react';
import { Link } from 'react-router-dom';
import ToolCard from '../ToolCard';

const ToolDetailRelated = ({ relatedTools }) => {
    if (relatedTools.length === 0) return null;

    return (
        <div className="related-section fade-in">
            <div className="section-header-row">
                <h2 className="section-title">Related <span className="gradient-text">AI Tools</span></h2>
                <Link to="/tools" className="view-all-link">Browse Directory</Link>
            </div>
            <div className="tools-grid">
                {relatedTools.map(rTool => (
                    <ToolCard key={rTool.id} tool={rTool} />
                ))}
            </div>
        </div>
    );
};

export default ToolDetailRelated;
