import React from 'react';
import { Trash2, Loader2, PlusCircle, ShieldCheck, Zap } from 'lucide-react';
import CustomSelect from '../CustomSelect';
import styles from './AdminSettingsManager.module.css';

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
            <div className={styles.fullFormWrapper}>
                <header className={styles.formHeader}>
                    <h2>Advanced Tool Acquisition</h2>
                    <p>Add a premium approved listing with full metadata and high-fidelity specifications.</p>
                </header>

                <form onSubmit={handleDirectAddTool} className={styles.complexForm}>
                    {/* Basic Info Section */}
                    <div className={styles.formSection}>
                        <h3 className={styles.sectionSubtitle}>
                            <ShieldCheck size={18} /> Identity & Targeting
                        </h3>
                        <div className={styles.inputGrid}>
                            <div className={styles.fieldWrapper}>
                                <label>Official Tool Name</label>
                                <input type="text" placeholder="e.g. ChatGPT Plus" required value={newTool.name} onChange={e => setNewTool({ ...newTool, name: e.target.value })} className={styles.inputField} />
                            </div>
                            <div className={styles.fieldWrapper}>
                                <label>Destination URL</label>
                                <input type="url" placeholder="https://example.com" required value={newTool.url} onChange={e => setNewTool({ ...newTool, url: e.target.value })} className={styles.inputField} />
                            </div>
                            <div className={styles.fieldWrapper}>
                                <label>Primary Taxonomy</label>
                                <CustomSelect
                                    options={categories.map(c => ({ value: c.id, label: c.name }))}
                                    value={newTool.category_id}
                                    onChange={(val) => setNewTool({ ...newTool, category_id: val })}
                                    placeholder="Select Category"
                                />
                            </div>
                            <div className={styles.fieldWrapper}>
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
                    <div className={styles.formSection}>
                        <h3 className={styles.sectionSubtitle}>
                            <Zap size={18} /> Content & Messaging
                        </h3>
                        <div className={`${styles.fieldWrapper} ${styles.fullWidth}`}>
                            <label>Marketing Pitch (Short)</label>
                            <input type="text" placeholder="A brief, punchy sentence about the tool..." required value={newTool.short_description} onChange={e => setNewTool({ ...newTool, short_description: e.target.value })} className={styles.inputField} />
                        </div>
                        <div className={`${styles.fieldWrapper} ${styles.fullWidth}`}>
                            <label>Comprehensive Description</label>
                            <textarea placeholder="Detailed breakdown of capabilities..." rows="5" required value={newTool.description} onChange={e => setNewTool({ ...newTool, description: e.target.value })} className={`${styles.inputField} ${styles.largeArea}`}></textarea>
                        </div>
                        <div className={`${styles.fieldWrapper} ${styles.fullWidth}`}>
                            <label>Pricing Specifics (Optional)</label>
                            <input type="text" placeholder="e.g. $20/mo for GPT-4 access" value={newTool.pricing_details} onChange={e => setNewTool({ ...newTool, pricing_details: e.target.value })} className={styles.inputField} />
                        </div>
                    </div>

                    {/* Media Section */}
                    <div className={styles.formSection}>
                        <h3 className={styles.sectionSubtitle}>Visual Assets</h3>
                        <div className={styles.mediaConfig}>
                            <div className={styles.previewBox}>
                                {adminImagePreview ? (
                                    <img src={adminImagePreview} alt="Preview" className={styles.previewImg} />
                                ) : newTool.image_url ? (
                                    <img src={newTool.image_url} alt="Current" className={styles.previewImg} />
                                ) : (
                                    <div className={styles.previewPlaceholder}>No Image</div>
                                )}
                            </div>
                            <div className={styles.uploadControls}>
                                <div className={styles.manualUrlToggle}>
                                    <label className={styles.switch}>
                                        <input type="checkbox" checked={adminUseManualUrl} onChange={() => setAdminUseManualUrl(!adminUseManualUrl)} />
                                        <span className={styles.slider}></span>
                                    </label>
                                    <span>Provide Manual URL</span>
                                </div>
                                {adminUseManualUrl ? (
                                    <input type="text" placeholder="Direct Image link..." value={newTool.image_url} onChange={e => setNewTool({ ...newTool, image_url: e.target.value })} className={styles.inputField} />
                                ) : (
                                    <div className={styles.fileUploadZone}>
                                        <input type="file" accept="image/*" onChange={handleAdminFileChange} id="admin-file-tool" style={{ display: 'none' }} />
                                        <label htmlFor="admin-file-tool" className="btn-outline compact" style={{ cursor: 'pointer' }}>
                                            {uploading ? <Loader2 className="animate-spin" size={16} /> : 'Choose Creative Asset'}
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className={styles.formSection}>
                        <h3 className={styles.sectionSubtitle}>Key Differentiation (Features)</h3>
                        <div className={styles.featuresManager}>
                            {(newTool.features || []).map((feat, idx) => (
                                <div key={idx} className={styles.featureEntry}>
                                    <input type="text" placeholder={`Feature #${idx + 1}`} value={feat} onChange={e => handleAdminFeatureChange(idx, e.target.value)} className={styles.inputField} />
                                    <button type="button" onClick={() => removeAdminFeature(idx)} className={`${styles.btnAction} ${styles.danger}`}><Trash2 size={16} /></button>
                                </div>
                            ))}
                            <button type="button" onClick={addAdminFeature} className="btn-text" style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <PlusCircle size={16} /> Add Technical Specification
                            </button>
                        </div>
                    </div>

                    <div className={styles.formFooter}>
                        <button type="submit" disabled={submitting || uploading} className="btn-primary heavy-btn" style={{ width: '100%', padding: '18px' }}>
                            {(submitting || uploading) ? <Loader2 className="animate-spin" size={20} /> : 'Publish Approved Listing'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    if (activeTab === 'categories') {
        return (
            <div className={styles.splitLayout}>
                <div>
                    <h3 className={styles.categoryFormTitle}>Add Tool Category</h3>
                    <form onSubmit={handleCreateCategory} className={styles.formGroup}>
                        <div className={styles.fieldWrapper} style={{ marginBottom: '1.2rem' }}>
                            <input type="text" placeholder="Category Name (e.g. Video AI)" required value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} className={styles.inputField} />
                        </div>
                        <div className={styles.fieldWrapper} style={{ marginBottom: '1.2rem' }}>
                            <input type="text" placeholder="Slug (e.g. video-ai)" required value={newCategory.slug} onChange={e => setNewCategory({ ...newCategory, slug: e.target.value })} className={styles.inputField} />
                        </div>
                        <div className={styles.fieldWrapper} style={{ marginBottom: '1.2rem' }}>
                            <input type="text" placeholder="Icon Name (Lucide)" value={newCategory.icon_name} onChange={e => setNewCategory({ ...newCategory, icon_name: e.target.value })} className={styles.inputField} />
                        </div>
                        <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%' }}>
                            {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Add Category'}
                        </button>
                    </form>
                </div>
                <div>
                    <h3 className={styles.categoryFormTitle}>Current Categories ({categories.length})</h3>
                    <div className={styles.scrollArea}>
                        {categories.map(cat => (
                            <div key={cat.id} className={styles.itemRow}>
                                <div className={styles.itemInfo}>
                                    <h5>{cat.name}</h5>
                                    <p>{cat.slug}</p>
                                </div>
                                <button onClick={() => handleDeleteCategory(cat.id)} className={`${styles.btnAction} ${styles.danger}`}>
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
            <div className={styles.splitLayout}>
                <div>
                    <h3 className={styles.categoryFormTitle}>Add Blog Category</h3>
                    <form onSubmit={handleCreateBlogCategory} className={styles.formGroup}>
                        <div className={styles.fieldWrapper} style={{ marginBottom: '1.2rem' }}>
                            <input type="text" placeholder="Category Name" required value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} className={styles.inputField} />
                        </div>
                        <div className={styles.fieldWrapper} style={{ marginBottom: '1.2rem' }}>
                            <input type="text" placeholder="Slug (e.g. news)" required value={newCategory.slug} onChange={e => setNewCategory({ ...newCategory, slug: e.target.value })} className={styles.inputField} />
                        </div>
                        <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%' }}>
                            {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Add Blog Category'}
                        </button>
                    </form>
                </div>
                <div>
                    <h3 className={styles.categoryFormTitle}>Current Blog Categories</h3>
                    <div className={styles.scrollArea}>
                        {blogCategories.map(cat => (
                            <div key={cat.id} className={styles.itemRow}>
                                <div className={styles.itemInfo}>
                                    <h5>{cat.label}</h5>
                                </div>
                                <button onClick={() => handleDeleteBlogCategory(cat.id)} className={`${styles.btnAction} ${styles.danger}`}>
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
