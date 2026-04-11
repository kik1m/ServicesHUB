import React from 'react';
import { ArrowLeft, ExternalLink, Heart, CheckCircle2 } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs';
import { getIcon } from '../../utils/iconMap';
import styles from './ToolDetailHeader.module.css';

const ToolDetailHeader = ({ 
    tool, 
    navigate, 
    isFavorited, 
    toggleFavorite 
}) => {
    return (
        <header className={styles.toolDetailHeader}>
            <div className="main-section">
                <Breadcrumbs items={[
                    { label: 'Directory', link: '/tools' },
                    { label: tool.categories?.name, link: `/category/${tool.categories?.slug}` },
                    { label: tool.name }
                ]} />
                <button onClick={() => navigate(-1)} className={`btn-text ${styles.backButton}`}>
                    <ArrowLeft size={18} /> Back to Search
                </button>
                
                <div className={styles.toolHeaderFlex}>
                    <div className={`${styles.toolLogoLarge} glass-card ${styles.premiumLogoContainer}`}>
                        {tool.image_url ? (
                            <img 
                                src={tool.image_url} 
                                alt={tool.name} 
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `<div style="color:var(--primary);display:flex;align-items:center;justify-content:center;height:100%"><svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>`;
                                }}
                            />
                        ) : (
                            getIcon(tool.icon_name || 'Zap', 60)
                        )}
                    </div>
                    <div className={styles.toolHeaderInfo}>
                        <div className="badge">{tool.categories?.name}</div>
                        <h1 className={`hero-title ${styles.toolMainTitle}`}>
                            {tool.name}
                            {tool.is_verified && (
                                <CheckCircle2 
                                    size={32} 
                                    color="#00d2ff" 
                                    fill="rgba(0,210,255,0.1)" 
                                    title="Verified Tool" 
                                />
                            )}
                        </h1>
                        <p className={styles.toolShortDesc}>{tool.short_description}</p>
                    </div>
                    <div className={styles.toolHeaderActions}>
                        <a 
                            href={tool.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={`btn-primary ${styles.visitBtnLarge}`} 
                        >
                            Visit Website <ExternalLink size={18} />
                        </a>
                        <button 
                            className={`icon-btn ${styles.favoriteBtnLarge} ${isFavorited ? styles.isActive : ''}`} 
                            onClick={toggleFavorite}
                            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                        >
                            <Heart size={24} fill={isFavorited ? '#ff4757' : 'none'} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ToolDetailHeader;
