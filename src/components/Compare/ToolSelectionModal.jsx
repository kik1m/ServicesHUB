import React from 'react';
import { Search, X, Plus } from 'lucide-react';
import SkeletonLoader from '../SkeletonLoader';

const ToolSelectionModal = ({ 
    onClose, 
    searchQuery, 
    setSearchQuery, 
    loading, 
    error, 
    availableTools, 
    onSelect 
}) => {
    return (
        <div className="modal-overlay">
            <div className="glass-card modal-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 style={{ margin: 0 }}>Select a Tool</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>
                
                <div className="nav-search-wrapper" style={{ marginBottom: '2rem', padding: '10px' }}>
                    <Search className="search-icon" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search tools..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        style={{ width: '100%', border: 'none', background: 'transparent', color: 'white', outline: 'none' }}
                    />
                </div>

                <div className="tool-select-list">
                    {loading ? (
                        <SkeletonLoader type="card" count={4} />
                    ) : error ? (
                        <div style={{ textAlign: 'center', padding: '1rem', color: '#ff4b4b' }}>{error}</div>
                    ) : availableTools.length > 0 ? (
                        availableTools.map(t => (
                            <button 
                                key={t.id} 
                                onClick={() => onSelect(t)}
                                className="select-item"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {t.image_url ? (
                                            <img src={t.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span>{t.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>
                                        {t.name} <small style={{ color: 'var(--text-muted)', marginLeft: '4px', fontWeight: '400' }}>({t.categories?.name})</small>
                                    </span>
                                </div>
                                <Plus size={14} opacity={0.6} />
                            </button>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                            No tools found. Try a different search.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ToolSelectionModal;
