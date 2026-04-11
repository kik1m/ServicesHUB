import React from 'react';
import { X, Search, Loader2, ArrowRight } from 'lucide-react';
import styles from './ToolSelectionModal.module.css';

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
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.modalClose} onClick={onClose}>
                    <X size={24} />
                </button>

                <div className={styles.modalHeader}>
                    <h3>Select <span className="gradient-text">AI Tool</span></h3>
                    <p>Search and choose a tool for comparison</p>
                </div>

                <div className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by name..." 
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className={styles.toolList}>
                    {loading ? (
                        <div className={styles.loadingState}>
                            <Loader2 className="animate-spin" size={32} />
                            <p>Searching for tools...</p>
                        </div>
                    ) : error ? (
                        <div className={styles.emptyState}>
                            <p style={{ color: '#ff4444' }}>{error}</p>
                        </div>
                    ) : availableTools.length > 0 ? (
                        availableTools.map((tool) => (
                            <button 
                                key={tool.id} 
                                className={styles.selectItem}
                                onClick={() => onSelect(tool)}
                            >
                                <div className={styles.itemInfo}>
                                    <span className={styles.itemName}>{tool.name}</span>
                                    <span className={styles.itemCategory}>{tool.categories?.name}</span>
                                </div>
                                <ArrowRight size={16} opacity={0.5} />
                            </button>
                        ))
                    ) : searchQuery && (
                        <div className={styles.emptyState}>
                            <p>No tools found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ToolSelectionModal;
