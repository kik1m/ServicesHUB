import React from 'react';
import { CheckCircle2, Plus, Trash2, Sparkles } from 'lucide-react';
import styles from './ToolFormFeatures.module.css';

const ToolFormFeatures = ({ formData, addFeature, removeFeature, handleFeatureChange }) => {
    return (
        <div className={styles.sectionCard}>
            <div className={styles.sectionTitleRow}>
                <div className={styles.titleIconBg}>
                    <CheckCircle2 size={22} className="text-primary" />
                </div>
                <h3>Features & Highlights</h3>
            </div>

            <div className={styles.featuresDynamicList}>
                <div className={styles.headerRow}>
                    <p className={styles.slimHeaderLabel}>KEY FEATURES & HIGHLIGHTS</p>
                    <button type="button" onClick={addFeature} className={styles.premiumAddBtn}>
                        <Plus size={14} /> Add Feature
                    </button>
                </div>

                {(!formData.features || formData.features.length === 0) ? (
                    <div className={styles.premiumEmptyState}>
                        <div className={styles.emptyIconWrapper}>
                            <Sparkles size={40} className="text-primary" />
                        </div>
                        <div className={styles.emptyTextWrapper}>
                            <h4>No features added yet</h4>
                            <p>Showcase what makes your tool unique by adding its key features.</p>
                        </div>
                        <button type="button" onClick={addFeature} className={styles.premiumAddBtn}>
                            <Plus size={16} /> Add Your First Feature
                        </button>
                    </div>
                ) : (
                    <div className={styles.dynamicListWrapper}>
                        {formData.features.map((feature, index) => (
                            <div key={index} className={styles.dynamicInputRow}>
                                <div className={styles.rowNumber}>{index + 1}</div>
                                <div className={styles.inputGroupSlim}>
                                    <input 
                                        type="text" 
                                        className={styles.slimInputField} 
                                        placeholder="e.g. Real-time collaboration" 
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => removeFeature(index)} 
                                    className={styles.premiumRemoveBtn}
                                    title="Remove feature"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ToolFormFeatures;
