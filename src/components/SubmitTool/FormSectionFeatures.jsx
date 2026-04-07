import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const FormSectionFeatures = ({ formData, setFormData }) => {
    return (
        <div className="form-section-card">
            <div className="section-title-row">
                <CheckCircle2 size={18} className="text-primary" />
                <h3>Features & Highlights</h3>
            </div>
            <div className="input-group-slim">
                <label>Key Features (One per line)</label>
                <textarea
                    className="slim-input-field"
                    style={{ minHeight: '120px' }}
                    value={formData.features?.join('\n') || ''}
                    onChange={(e) => setFormData({
                        ...formData,
                        features: e.target.value.split('\n').filter(f => f.trim() !== '')
                    })}
                    placeholder="Enter features..."
                ></textarea>
            </div>
        </div>
    );
};

export default FormSectionFeatures;
