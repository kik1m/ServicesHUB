import React from 'react';
import { X, Star, ExternalLink, Search } from 'lucide-react';
import styles from './ToolCompareColumn.module.css';

const ToolCompareColumn = ({ tool, slot, onClear, onSelect }) => {
    return (
        <div className={styles.column}>
            {tool ? (
                <div className={styles.activeCard}>
                    <button 
                        onClick={onClear} 
                        className={styles.closeBtn}
                        aria-label="Remove tool"
                    >
                        <X size={16} />
                    </button>
                    
                    <div className={styles.logoContainer}>
                        {tool.image_url ? (
                            <img src={tool.image_url} alt={tool.name} className={styles.logoImage} />
                        ) : (
                            tool.name.charAt(0)
                        )}
                    </div>
                    
                    <h3 className={styles.toolName}>{tool.name}</h3>
                    
                    <div className={styles.categoryTag}>
                         {tool.categories?.name}
                         {tool.is_verified && <Star size={12} fill="var(--secondary)" color="var(--secondary)" />}
                    </div>
                    
                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <div className={`${styles.statValue} ${styles.ratingValue}`}>
                                <Star size={16} fill="#ffc107" /> {tool.rating || '5.0'}
                            </div>
                            <div className={styles.statLabel}>Rating</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>{tool.reviews_count || '0'}</div>
                            <div className={styles.statLabel}>Reviews</div>
                        </div>
                    </div>

                    <div className={styles.infoSection}>
                         <div className={styles.pricingBox}>
                             <div className={styles.pricingLabel}>Pricing</div>
                             <div className={styles.pricingValue}>{tool.pricing_type}</div>
                         </div>
                         <a 
                            href={tool.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={`${styles.visitBtn} btn-primary`}
                         >
                             Visit Site <ExternalLink size={14} />
                         </a>
                    </div>
                </div>
            ) : (
                <div 
                    className={styles.placeholder} 
                    onClick={onSelect}
                >
                    <div className={styles.placeholderIcon}>
                        <Search size={30} />
                    </div>
                    <h3 className={styles.placeholderTitle}>Select Tool {slot}</h3>
                    <p className={styles.placeholderText}>Choose an AI tool to compare side-by-side.</p>
                </div>
            )}
        </div>
    );
};

export default ToolCompareColumn;
