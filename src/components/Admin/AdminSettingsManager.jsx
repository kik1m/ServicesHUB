import React from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import CustomSelect from '../CustomSelect';

const AdminSettingsManager = ({ 
    activeTab, 
    newTool, setNewTool, handleDirectAddTool,
    adminImagePreview, adminUseManualUrl, setAdminUseManualUrl,
    handleAdminFileChange, addAdminFeature, removeAdminFeature, handleAdminFeatureChange,
    newCategory, setNewCategory, handleCreateCategory, handleDeleteCategory, categories,
    handleCreateBlogCategory, handleDeleteBlogCategory, blogCategories,
    submitting, uploading 
}) => {
    
    if (activeTab === 'add-tool') {
        return (
            <div className="admin-full-form-wrapper">
                <header className="admin-form-header">
                    <h2>Advanced Tool Acquisition</h2>
                    <p>Add a premium approved listing with full metadata and high-fidelity specifications.</p>
                </header>

                <form onSubmit={handleDirectAddTool} className="admin-complex-form">
                    {/* Basic Info Section */}
                    <div className="admin-form-section">
                        <h3 className="section-subtitle">Identity & Targeting</h3>
                        <div className="admin-input-grid">
                            <div className="input-field-wrapper">
                                <label>Official Tool Name</label>
                                <input type="text" placeholder="e.g. ChatGPT Plus" required value={newTool.name} onChange={e => setNewTool({ ...newTool, name: e.target.value })} className="admin-input-field" />
                            </div>
                            <div className="input-field-wrapper">
                                <label>Destination URL</label>
                                <input type="url" placeholder="https://example.com" required value={newTool.url} onChange={e => setNewTool({ ...newTool, url: e.target.value })} className="admin-input-field" />
                            </div>
                            <div className="input-field-wrapper">
                                <label>Primary Taxonomy</label>
                                <CustomSelect
                                    options={categories.map(c => ({ value: c.id, label: c.name }))}
                                    value={newTool.category_id}
                                    onChange={(val) => setNewTool({ ...newTool, category_id: val })}
                                    placeholder="Select Category"
                                />
                            </div>
                            <div className="input-field-wrapper">
                                <label>Pricing Strategy</label>
                                <CustomSelect
                                    options={[
                                        { value: 'Free', label: 'Free' },
                                        { value: 'Freemium', label: 'Freemium' },
                                        { value: 'Paid', label: 'Paid' },
                                        { value: 'Subscription', label: 'Subscription' }
                                    ]}
                                    value={newTool.pricing_type}
                                    onChange={(val) => setNewTool({ ...newTool, pricing_type: val })}
                                    placeholder="Pricing Type"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="admin-form-section">
                        <h3 className="section-subtitle">Content & Messaging</h3>
                        <div className="input-field-wrapper full-width">
                            <label>Marketing Pitch (Short)</label>
                            <input type="text" placeholder="A brief, punchy sentence about the tool..." required value={newTool.short_description} onChange={e => setNewTool({ ...newTool, short_description: e.target.value })} className="admin-input-field" />
                        </div>
                        <div className="input-field-wrapper full-width">
                            <label>Comprehensive Description</label>
                            <textarea placeholder="Detailed breakdown of capabilities..." rows="5" required value={newTool.description} onChange={e => setNewTool({ ...newTool, description: e.target.value })} className="admin-input-field large-area"></textarea>
                        </div>
                        <div className="input-field-wrapper full-width">
                            <label>Pricing Specifics (Optional)</label>
                            <input type="text" placeholder="e.g. $20/mo for GPT-4 access" value={newTool.pricing_details} onChange={e => setNewTool({ ...newTool, pricing_details: e.target.value })} className="admin-input-field" />
                        </div>
                    </div>

                    {/* Media Section */}
                    <div className="admin-form-section">
                        <h3 className="section-subtitle">Visual Assets</h3>
                        <div className="admin-media-config">
                            <div className="admin-upload-preview-box">
                                {adminImagePreview ? (
                                    <img src={adminImagePreview} alt="Preview" className="admin-preview-img" />
                                ) : newTool.image_url ? (
                                    <img src={newTool.image_url} alt="Current" className="admin-preview-img" />
                                ) : (
                                    <div className="admin-preview-placeholder">No Image</div>
                                )}
                            </div>
                            <div className="admin-upload-controls">
                                <div className="manual-url-toggle">
                                    <label className="admin-switch">
                                        <input type="checkbox" checked={adminUseManualUrl} onChange={() => setAdminUseManualUrl(!adminUseManualUrl)} />
                                        <span className="slider"></span>
                                    </label>
                                    <span>Provide Manual URL</span>
                                </div>
                                {adminUseManualUrl ? (
                                    <input type="text" placeholder="Direct Image link..." value={newTool.image_url} onChange={e => setNewTool({ ...newTool, image_url: e.target.value })} className="admin-input-field" />
                                ) : (
                                    <div className="admin-file-upload-zone">
                                        <input type="file" accept="image/*" onChange={handleAdminFileChange} id="admin-file-tool" />
                                        <label htmlFor="admin-file-tool" className="btn-outline compact">
                                            {uploading ? <Loader2 className="animate-spin" size={16} /> : 'Choose Creative Asset'}
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="admin-form-section">
                        <h3 className="section-subtitle">Key Differentiation (Features)</h3>
                        <div className="admin-features-manager">
                            {(newTool.features || []).map((feat, idx) => (
                                <div key={idx} className="admin-feature-entry">
                                    <input type="text" placeholder={`Feature #${idx + 1}`} value={feat} onChange={e => handleAdminFeatureChange(idx, e.target.value)} className="admin-input-field" />
                                    <button type="button" onClick={() => removeAdminFeature(idx)} className="admin-btn-icon danger"><Trash2 size={16} /></button>
                                </div>
                            ))}
                            <button type="button" onClick={addAdminFeature} className="btn-text" style={{ padding: '0.5rem 0' }}>+ Add Technical Specification</button>
                        </div>
                    </div>

                    <div className="admin-form-footer">
                        <button type="submit" disabled={submitting || uploading} className="btn-primary heavy-btn">
                            {(submitting || uploading) ? <Loader2 className="animate-spin" size={20} /> : 'Publish Approved Listing'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    if (activeTab === 'categories') {
        return (
            <div className="admin-split-layout">
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem' }}>Add Tool Category</h3>
                    <form onSubmit={handleCreateCategory} className="admin-form-group">
                        <input type="text" placeholder="Category Name (e.g. Video AI)" required value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} className="admin-input-field" />
                        <input type="text" placeholder="Slug (e.g. video-ai)" required value={newCategory.slug} onChange={e => setNewCategory({ ...newCategory, slug: e.target.value })} className="admin-input-field" />
                        <input type="text" placeholder="Icon Name (Lucide)" value={newCategory.icon_name} onChange={e => setNewCategory({ ...newCategory, icon_name: e.target.value })} className="admin-input-field" />
                        <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%' }}>
                            {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Add Category'}
                        </button>
                    </form>
                </div>
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem' }}>Current Categories ({categories.length})</h3>
                    <div className="admin-scroll-area">
                        {categories.map(cat => (
                            <div key={cat.id} className="admin-item-row" style={{ marginBottom: '10px' }}>
                                <div className="admin-item-info">
                                    <h5 style={{ fontWeight: '700' }}>{cat.name}</h5>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.slug}</p>
                                </div>
                                <button onClick={() => handleDeleteCategory(cat.id)} style={{ color: '#ff5050', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (activeTab === 'blog-categories') {
        return (
            <div className="admin-split-layout">
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem' }}>Add Blog Category</h3>
                    <form onSubmit={handleCreateBlogCategory} className="admin-form-group">
                        <input type="text" placeholder="Category Name" required value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} className="admin-input-field" />
                        <input type="text" placeholder="Slug (e.g. news)" required value={newCategory.slug} onChange={e => setNewCategory({ ...newCategory, slug: e.target.value })} className="admin-input-field" />
                        <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%' }}>
                            {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Add Blog Category'}
                        </button>
                    </form>
                </div>
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem' }}>Current Blog Categories</h3>
                    <div className="admin-scroll-area">
                        {blogCategories.map(cat => (
                            <div key={cat.id} className="admin-item-row" style={{ marginBottom: '10px' }}>
                                <div className="admin-item-info">
                                    <h5 style={{ fontWeight: '700' }}>{cat.label}</h5>
                                </div>
                                <button onClick={() => handleDeleteBlogCategory(cat.id)} style={{ color: '#ff5050', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default AdminSettingsManager;
