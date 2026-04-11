import React from 'react';
import { Zap, Globe, Layout, Star, MousePointer2, Info } from 'lucide-react';
import CustomSelect from '../CustomSelect';
import styles from './ToolFormBasicInfo.module.css';

const ToolFormBasicInfo = ({ formData, setFormData, categories, fieldErrors }) => {
    return (
        <div className={styles.sectionCard}>
            <div className={styles.sectionTitleRow}>
                <div className={styles.titleIconBg}>
                    <Info size={22} className="text-primary" />
                </div>
                <h3>Basic Details</h3>
            </div>

            <div className={styles.inputGrid2}>
                <div className={styles.inputGroupSlim}>
                    <label><Zap size={14} /> Tool Name</label>
                    <input 
                        type="text" 
                        className={styles.slimInputField} 
                        value={formData.name || ''} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        placeholder="e.g. ChatGPT"
                    />
                    {fieldErrors.name && <span className={styles.errorText}>{fieldErrors.name}</span>}
                </div>
                <div className={styles.inputGroupSlim}>
                    <label><Globe size={14} /> Website URL</label>
                    <input 
                        type="url" 
                        className={styles.slimInputField} 
                        value={formData.url || ''} 
                        onChange={(e) => setFormData({...formData, url: e.target.value})} 
                        placeholder="https://yourapp.com"
                    />
                    {fieldErrors.url && <span className={styles.errorText}>{fieldErrors.url}</span>}
                </div>
            </div>

            <div className={styles.inputSplitLayout}>
                <CustomSelect 
                    label="Primary Category" 
                    options={categories} 
                    value={formData.category_id} 
                    onChange={(val) => setFormData({...formData, category_id: val})} 
                    icon={Layout}
                />
                
                <div className={styles.pricingGridGroup}>
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
                    <div className={styles.pricingDetailsContainer}>
                        <label className={styles.slimDetailLabel}>PRICE DETAILS</label>
                        <div className={styles.slimInputWrapper}>
                            <input 
                                type="text" 
                                className={styles.slimInputField} 
                                placeholder="e.g. $10/mo"
                                value={formData.pricing_details || ''} 
                                onChange={(e) => setFormData({...formData, pricing_details: e.target.value})}
                            />
                            <div className={styles.inputIconRight}>
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
