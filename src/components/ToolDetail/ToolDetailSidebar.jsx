import React from 'react';
import { Star, ShieldCheck, Share2, Heart, Flag, ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ToolDetailSidebar = ({ 
    tool, 
    publisher, 
    isFavorited, 
    toggleFavorite, 
    handleShare, 
    setIsReportModalOpen 
}) => {
    return (
        <aside className="tool-sidebar">
            <div className="glass-card sidebar-card sidebar-sticky">
                <h4 className="sidebar-title-slim">Tool Info</h4>
                <div className="info-list-rows">
                    <div className="info-row-item">
                        <span className="info-label">Pricing</span>
                        <span className="info-value">
                            {tool.pricing_type} {tool.pricing_details ? `(${tool.pricing_details})` : ''}
                        </span>
                    </div>
                    {publisher && (
                        <div className="info-row-item">
                            <span className="info-label">Publisher</span>
                            <Link 
                                to={`/u/${publisher.id}`} 
                                className="publisher-link-premium"
                            >
                                {publisher.full_name} <ChevronRight size={14} />
                            </Link>
                        </div>
                    )}
                    <div className="info-row-item">
                        <span className="info-label">Rating</span>
                        <span className="info-value" style={{ color: '#ffc107', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Star size={16} fill="#ffc107" /> {tool.rating} ({tool.reviews_count})
                        </span>
                    </div>
                    <div className="info-row-item">
                        <span className="info-label">Status</span>
                        <span className="info-value" style={{ color: 'var(--primary)' }}>
                            {tool.is_featured ? 'Featured' : 'Popular'}
                        </span>
                    </div>
                    <div className="info-row-item">
                        <span className="info-label">Safety</span>
                        <span className="safety-badge-green">
                            <ShieldCheck size={16} /> {tool.is_verified ? 'Verified' : 'Safe to Use'}
                        </span>
                    </div>
                </div>
                
                <hr style={{ border: 'none', height: '1px', background: 'var(--border)', margin: '2rem 0' }} />
                
                <div className="share-section">
                    <p style={{ fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '700' }}>Share this tool</p>
                    <div className="share-group-row">
                        <button 
                            className="icon-btn share-action-btn" 
                            onClick={handleShare}
                        >
                            <Share2 size={18} /> Share
                        </button>
                        <button 
                            className={`icon-btn share-action-btn ${isFavorited ? 'is-active' : ''}`} 
                            onClick={toggleFavorite}
                        >
                            <Heart size={18} fill={isFavorited ? '#ff4757' : 'none'} /> {isFavorited ? 'Saved' : 'Save'}
                        </button>
                    </div>
                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <button 
                            onClick={() => setIsReportModalOpen(true)}
                            className="report-tool-btn"
                        >
                            <Flag size={12} /> Report this tool
                        </button>
                    </div>
                </div>

                <div className="glass-card claim-card-dashed">
                    <ShieldCheck size={28} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h5 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Is this your tool?</h5>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>Claim ownership to update details and respond to reviews.</p>
                    <Link to="/contact?subject=Claim%20Tool" className="btn-text" style={{ fontSize: '0.8rem' }}>Claim Ownership <ArrowLeft size={12} style={{ transform: 'rotate(180deg)', display: 'inline-block' }} /></Link>
                </div>
            </div>
        </aside>
    );
};

export default ToolDetailSidebar;
