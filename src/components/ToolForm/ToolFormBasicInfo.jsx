import React from 'react';
import { Zap, Globe, Layout, Star, MousePointer2, Info } from 'lucide-react';
import CustomSelect from '../CustomSelect';

const ToolFormBasicInfo = ({ formData, setFormData, categories, fieldErrors }) => {
    return (
        <div className="form-section-card">
            <div className="section-title-row">
                <div className="title-icon-bg">
                    <Info size={22} className="text-primary" />
                </div>
                <h3>Basic Details</h3>
            </div>

            <div className="input-grid-2">
                <div className="input-group-slim">
                    <label><Zap size={14} /> Tool Name</label>
                    <input 
                        type="text" 
                        className="slim-input-field" 
                        value={formData.name || ''} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        placeholder="e.g. ChatGPT"
                    />
                    {fieldErrors.name && <span className="error-text">{fieldErrors.name}</span>}
                </div>
                <div className="input-group-slim">
                    <label><Globe size={14} /> Website URL</label>
                    <input 
                        type="url" 
                        className="slim-input-field" 
                        value={formData.url || ''} 
                        onChange={(e) => setFormData({...formData, url: e.target.value})} 
                        placeholder="https://yourapp.com"
                    />
                    {fieldErrors.url && <span className="error-text">{fieldErrors.url}</span>}
                </div>
            </div>

            <div className="input-split-layout">
                <CustomSelect 
                    label="Primary Category" 
                    options={categories} 
                    value={formData.category_id} 
                    onChange={(val) => setFormData({...formData, category_id: val})} 
                    icon={Layout}
                />
                
                <div className="pricing-grid-group">
                    <CustomSelect 
                        label="Pricing Model" 
                        options={[
                            {id:'Free', name:'Free'}, 
                            {id:'Freemium', name:'Freemium'}, 
                            {id:'Paid', name:'Paid'}, 
                            {id:'Contact', name:'Contact'}
                        ]} 
                        value={formData.pricing_type} 
                        onChange={(val) => setFormData({...formData, pricing_type: val})} 
                        icon={Star}
                    />
                    <div className="pricing-details-container">
                        <label className="slim-detail-label">PRICE DETAILS</label>
                        <div className="slim-input-wrapper">
                            <input 
                                type="text" 
                                className="slim-input-field" 
                                placeholder="e.g. $10/mo"
                                value={formData.pricing_details || ''} 
                                onChange={(e) => setFormData({...formData, pricing_details: e.target.value})}
                            />
                            <div className="input-icon-right">
                                <MousePointer2 size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolFormBasicInfo;
