import React from 'react';
import { Star, ShieldCheck, Share2, Heart, Flag, ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './ToolDetailSidebar.module.css';

const ToolDetailSidebar = ({ 
    tool, 
    publisher, 
    isFavorited, 
    toggleFavorite, 
    handleShare, 
    setIsReportModalOpen 
}) => {
    return (
        <aside className={styles.toolSidebar}>
            <div className={`glass-card ${styles.sidebarSticky}`}>
                <h4 className={styles.sidebarTitleSlim}>Tool Info</h4>
                <div className={styles.infoListRows}>
                    <div className={styles.infoRowItem}>
                        <span className={styles.infoLabel}>Pricing</span>
                        <span className={styles.infoValue}>
                            {tool.pricing_type} {tool.pricing_details ? `(${tool.pricing_details})` : ''}
                        </span>
                    </div>
                    {publisher && (
                        <div className={styles.infoRowItem}>
                            <span className={styles.infoLabel}>Publisher</span>
                            <Link 
                                to={`/u/${publisher.id}`} 
                                className={styles.publisherLinkPremium}
                            >
                                {publisher.full_name} <ChevronRight size={14} />
                            </Link>
                        </div>
                    )}
                    <div className={styles.infoRowItem}>
                        <span className={styles.infoLabel}>Rating</span>
                        <span className={styles.ratingValue}>
                            <Star size={16} fill="#ffc107" /> {tool.rating} ({tool.reviews_count})
                        </span>
                    </div>
                    <div className={styles.infoRowItem}>
                        <span className={styles.infoLabel}>Status</span>
                        <span className={styles.statusValue}>
                            {tool.is_featured ? 'Featured' : 'Popular'}
                        </span>
                    </div>
                    <div className={styles.infoRowItem}>
                        <span className={styles.infoLabel}>Safety</span>
                        <span className={styles.safetyBadgeGreen}>
                            <ShieldCheck size={16} /> {tool.is_verified ? 'Verified' : 'Safe to Use'}
                        </span>
                    </div>
                </div>
                
                <hr style={{ border: 'none', height: '1px', background: 'var(--border)', margin: '2rem 0' }} />
                
                <div className={styles.shareSection}>
                    <p className={styles.shareSectionTitle}>Share this tool</p>
                    <div className={styles.shareGroupRow}>
                        <button 
                            className={`icon-btn ${styles.shareActionBtn}`} 
                            onClick={handleShare}
                        >
                            <Share2 size={18} /> Share
                        </button>
                        <button 
                            className={`icon-btn ${styles.shareActionBtn} ${isFavorited ? styles.isActive : ''}`} 
                            onClick={toggleFavorite}
                        >
                            <Heart size={18} fill={isFavorited ? '#ff4757' : 'none'} /> {isFavorited ? 'Saved' : 'Save'}
                        </button>
                    </div>
                    <div className={styles.reportToolBtnContainer}>
                        <button 
                            onClick={() => setIsReportModalOpen(true)}
                            className={styles.reportToolBtn}
                        >
                            <Flag size={12} /> Report this tool
                        </button>
                    </div>
                </div>

                <div className={`glass-card ${styles.claimCardDashed}`}>
                    <ShieldCheck size={28} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h5 className={styles.claimTitle}>Is this your tool?</h5>
                    <p className={styles.claimDesc}>Claim ownership to update details and respond to reviews.</p>
                    <Link to="/contact?subject=Claim%20Tool" className={`btn-text ${styles.claimLink}`}>
                        Claim Ownership <ArrowLeft size={12} style={{ transform: 'rotate(180deg)', display: 'inline-block' }} />
                    </Link>
                </div>
            </div>
        </aside>
    );
};

export default ToolDetailSidebar;
