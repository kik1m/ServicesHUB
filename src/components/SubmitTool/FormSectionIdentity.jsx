import React from 'react';
import { Info, Zap, Globe, LayoutGrid, Star } from 'lucide-react';
import CustomSelect from '../CustomSelect';

const FormSectionIdentity = ({ formData, setFormData, categories, fieldErrors }) => {
    return (
        <div className="form-section-card">
            <div className="section-title-row">
                <div style={{ color: 'var(--primary)' }}>
                    <Info size={22} />
                </div>
                <h3>Core Identity</h3>
            </div>

            <div className="input-grid-2">
                <div className="input-group-slim">
                    <label><Zap size={14} /> Product Name</label>
                    <input
                        type="text"
                        className="slim-input-field"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. HUBly"
                        required
                    />
                    {fieldErrors.name && <span className="error-text">{fieldErrors.name}</span>}
                </div>
                <div className="input-group-slim">
                    <label><Globe size={14} /> Website URL</label>
                    <input
                        type="url"
                        className="slim-input-field"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://..."
                        required
                    />
                    {fieldErrors.url && <span className="error-text">{fieldErrors.url}</span>}
                </div>
            </div>

            <div className="input-split-layout">
                <CustomSelect
                    label="Product Niche"
                    options={categories}
                    value={formData.category_id}
                    onChange={(val) => setFormData({ ...formData, category_id: val })}
                    icon={LayoutGrid}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <CustomSelect
                        label="Pricing "
                        options={[
                            { id: 'Free', name: 'Free' },
                            { id: 'Freemium', name: 'Freemium' },
                            { id: 'Paid', name: 'Paid' }
                        ]}
                        value={formData.pricing_type}
                        onChange={(val) => setFormData({ ...formData, pricing_type: val })}
                        icon={Star}
                    />
                    <input
                        type="text"
                        className="slim-input-field"
                        placeholder="Briefly explain (e.g. $9/mo)"
                        value={formData.pricing_details}
                        onChange={(e) => setFormData({ ...formData, pricing_details: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
};

export default FormSectionIdentity;
