import React from 'react';
import { Sparkles, X, Brain, Zap, Star, Crown } from 'lucide-react';
import { MODELS } from '../../config/models.config';
import styles from './AIEngineModals.module.css';

export default function AIChatModelsModal({ modelProps }) {
    const { isModelModalOpen, setIsModelModalOpen, selectedModel, handleModelSelect } = modelProps;

    if (!isModelModalOpen) return null;

    const getIcon = (iconName) => {
        if (iconName === 'Crown') return <Crown size={18} />;
        if (iconName === 'Star') return <Star size={18} />;
        if (iconName === 'Brain') return <Brain size={18} />;
        return <Zap size={18} />;
    };

    const getModelColor = (id) => {
        if (id.includes('flash')) return '#00d2ff';
        if (id.includes('sonnet')) return '#a855f7';
        if (id.includes('gpt')) return '#ec4899';
        if (id.includes('o1')) return '#f59e0b';
        return '#00d2ff';
    };

    const getModelDesc = (id) => {
        if (id.includes('flash')) return 'Fast, efficient model for general tasks and quick responses.';
        if (id.includes('sonnet')) return 'Advanced reasoning, coding, and complex problem-solving.';
        if (id.includes('gpt')) return 'Highly capable multimodal model for creative and analytical tasks.';
        if (id.includes('o1')) return 'Most advanced reasoning model. Best for deep logic and coding.';
        return 'Standard AI model.';
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent} style={{ maxWidth: '450px' }}>
                <button className={styles.closeBtn} onClick={() => setIsModelModalOpen(false)}>
                    <X size={24} />
                </button>
                
                <div className={styles.modalHeader}>
                    <Sparkles size={28} style={{ color: '#00d2ff' }} />
                    <h3>Select AI Model</h3>
                </div>
                
                <p style={{ fontSize: '0.95rem', color: '#94a3b8', marginBottom: '20px', lineHeight: '1.6' }}>
                    Choose the AI model that best fits your current task. Premium models offer advanced reasoning and larger context windows.
                </p>

                <div className={styles.modelGrid}>
                    {Object.values(MODELS).map(model => (
                        <div 
                            key={model.id}
                            onClick={() => handleModelSelect(model.id)}
                            className={`${styles.modelCard} ${selectedModel === model.id ? styles.modelCardActive : ''}`}
                        >
                            <div 
                                className={styles.modelCardIcon}
                                style={{ 
                                    background: `rgba(${getModelColor(model.id) === '#00d2ff' ? '0,210,255' : getModelColor(model.id) === '#a855f7' ? '168,85,247' : '236,72,153'}, 0.15)`,
                                    color: getModelColor(model.id),
                                    borderColor: `rgba(${getModelColor(model.id) === '#00d2ff' ? '0,210,255' : getModelColor(model.id) === '#a855f7' ? '168,85,247' : '236,72,153'}, 0.3)`
                                }}
                            >
                                {getIcon(model.icon)}
                            </div>
                            
                            <div className={styles.modelCardContent}>
                                <h4 className={styles.modelCardTitle}>
                                    {model.displayName}
                                    {model.minTier !== 'free' && (
                                        <Zap 
                                            size={16} 
                                            color="#FFD700" 
                                            fill="#FFD700" 
                                            style={{ marginLeft: '8px', verticalAlign: 'middle' }} 
                                            title="Premium Model" 
                                        />
                                    )}
                                </h4>
                                <p className={styles.modelCardDesc}>{getModelDesc(model.id)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
