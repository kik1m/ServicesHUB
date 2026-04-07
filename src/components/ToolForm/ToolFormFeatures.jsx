import React from 'react';
import { CheckCircle2, Plus, Trash2, AlertCircle, Sparkles } from 'lucide-react';

const ToolFormFeatures = ({ formData, addFeature, removeFeature, handleFeatureChange }) => {
    return (
        <div className="form-section-card">
            <div className="section-title-row">
                <div className="title-icon-bg">
                    <CheckCircle2 size={22} className="text-primary" />
                </div>
                <h3>Features & Highlights</h3>
            </div>

            <div className="features-dynamic-list">
                <div className="upload-header-row">
                    <p className="slim-header-label">KEY FEATURES & HIGHLIGHTS</p>
                    <button type="button" onClick={addFeature} className="premium-add-btn">
                        <Plus size={14} /> Add Feature
                    </button>
                </div>

                {(!formData.features || formData.features.length === 0) ? (
                    <div className="premium-empty-state">
                        <div className="empty-icon-wrapper">
                            <Sparkles size={40} className="text-primary" />
                        </div>
                        <div className="empty-text-wrapper">
                            <h4>No features added yet</h4>
                            <p>Showcase what makes your tool unique by adding its key features.</p>
                        </div>
                        <button type="button" onClick={addFeature} className="premium-add-btn" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                            <Plus size={16} /> Add Your First Feature
                        </button>
                    </div>
                ) : (
                    <div className="dynamic-list-wrapper">
                        {formData.features.map((feature, index) => (
                            <div key={index} className="dynamic-input-row">
                                <div className="row-number">{index + 1}</div>
                                <div className="input-group-slim">
                                    <input 
                                        type="text" 
                                        className="slim-input-field" 
                                        placeholder="e.g. Real-time collaboration" 
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => removeFeature(index)} 
                                    className="premium-remove-btn"
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
