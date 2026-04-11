import React from 'react';
import { Trash2, Star } from 'lucide-react';
import styles from './AdminQueue.module.css';

const AdminQueue = ({ 
    activeTab, 
    pendingTools, 
    featuredTools, 
    handleOpenReview, 
    handleReject, 
    handleToggleFeatured,
    adminSearchQuery = '',
    adminSearchResults = [],
    handleAdminSearch,
    isSearchingTools
}) => {
    if (activeTab !== 'pending' && activeTab !== 'featured') return null;

    const tools = activeTab === 'pending' ? pendingTools : featuredTools;
    const title = activeTab === 'pending' ? 'Approvals Queue' : 'Featured Showcase';
    const badgeText = activeTab === 'pending' ? `${tools.length} PENDING` : `${tools.length} FEATURED`;

    return (
        <div className={styles.wrapper}>
            <div className={styles.sectionHeader}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h2 className={styles.title}>{title}</h2>
                    <span className={styles.badge}>{badgeText}</span>
                </div>
                
                {activeTab === 'featured' && (
                    <div className={styles.searchWrapper}>
                        <input 
                            type="text" 
                            placeholder="Add tool to featured..." 
                            value={adminSearchQuery} 
                            onChange={handleAdminSearch}
                            className={styles.searchInput}
                        />
                    </div>
                )}
            </div>

            {activeTab === 'featured' && adminSearchResults.length > 0 && (
                <div className={styles.searchResultsSection}>
                    <h4 className={styles.searchHeader}>
                        Search Results
                    </h4>
                    <div className={styles.listContainer}>
                        {adminSearchResults.map(tool => (
                            <div key={tool.id} className={styles.itemRow} style={{ background: 'rgba(0, 163, 255, 0.03)', borderColor: 'rgba(0, 163, 255, 0.1)' }}>
                                <div className={styles.itemContent}>
                                    <div className={styles.itemThumb}>
                                        {tool.image_url ? <img src={tool.image_url} alt={tool.name} /> : tool.name.charAt(0)}
                                    </div>
                                    <div className={styles.itemInfo}>
                                        <h4>{tool.name}</h4>
                                        <p>{tool.categories?.name} • {tool.pricing_type}</p>
                                    </div>
                                    
                                    <button
                                        onClick={() => handleToggleFeatured(tool)}
                                        className={`btn-primary-slim ${tool.is_featured ? styles.featuredActive : ''}`}
                                    >
                                        <Star size={14} style={{ marginRight: '5px', fill: tool.is_featured ? 'currentColor' : 'none' }} />
                                        {tool.is_featured ? 'Featured' : 'Feature This'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.listContainer}>
                {tools.map(tool => (
                    <div key={tool.id} className={styles.itemRow}>
                        <div className={styles.itemContent}>
                            <div className={styles.itemThumb}>
                                {tool.image_url ? <img src={tool.image_url} alt={tool.name} /> : tool.name.charAt(0)}
                            </div>
                            <div className={styles.itemInfo}>
                                <h4>{tool.name}</h4>
                                <p>{tool.categories?.name} • {new Date(tool.created_at).toLocaleDateString()}</p>
                            </div>
                            
                            <div className={styles.actions}>
                                {activeTab === 'pending' ? (
                                    <>
                                        {tool.pending_changes ? (
                                            <button
                                                onClick={() => handleOpenReview(tool)}
                                                className="btn-primary-slim"
                                                style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid #38bdf8' }}
                                            >
                                                Review Changes
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleOpenReview(tool)}
                                                className="btn-primary-slim"
                                                style={{ background: '#00ff88', color: '#000' }}
                                            >
                                                Full Review
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleToggleFeatured(tool)}
                                        className="btn-primary-slim"
                                        style={{ background: 'rgba(255, 215, 0, 0.1)', color: '#FFD700', border: '1px solid #FFD700' }}
                                    >
                                        <Star size={14} style={{ marginRight: '5px', fill: '#FFD700' }} />
                                        Featured
                                    </button>
                                )}
                                
                                <button onClick={() => handleReject(tool)} style={{ background: 'rgba(255, 80, 80, 0.1)', color: '#ff5050', padding: '8px' }} className="btn-primary-slim">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {tools.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No {activeTab} tools found.</p>}
            </div>
        </div>
    );
};

export default AdminQueue;
