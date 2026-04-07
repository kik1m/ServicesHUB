import React from 'react';
import { LayoutGrid } from 'lucide-react';
import ToolCard from '../ToolCard';

const ProfilePortfolio = ({ tools }) => {
    return (
        <div className="profile-portfolio-section">
            <div className="portfolio-header-row">
                <h2 className="portfolio-title">
                    Published <span className="gradient-text">Portfolio</span>
                </h2>
                <div className="portfolio-divider"></div>
            </div>

            {tools.length > 0 ? (
                <div className="portfolio-grid">
                    {tools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} />
                    ))}
                </div>
            ) : (
                <div className="empty-portfolio-card">
                    <LayoutGrid className="empty-icon" />
                    <h3 className="empty-title">No active tools to show</h3>
                    <p className="empty-text">This user has a profile but hasn't listed any tools in our directory yet.</p>
                </div>
            )}
        </div>
    );
};

export default ProfilePortfolio;
