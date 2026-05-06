import React, { memo } from 'react';
import { ADMIN_UI_CONSTANTS } from '../../constants/adminConstants';
import { Trash2, ShieldCheck, Zap, FolderTree, Tags, PlusCircle } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import Safeguard from '../ui/Safeguard';
import Select from '../ui/Select';
import Input from '../ui/Input';
import styles from './AdminSettingsManager.module.css';

/**
 * AdminSettingsManager - Elite System Configuration
 * Rule #16: Modular render based on orchestrator activeTab
 */
const AdminSettingsManager = memo(({ 
    activeTab, 
    newTool = {}, setNewTool, handleDirectAddTool,
    adminImagePreview, adminUseManualUrl, setAdminUseManualUrl,
    handleAdminFileChange, addAdminFeature, removeAdminFeature, handleAdminFeatureChange,
    newCategory = {}, setNewCategory, handleCreateCategory, handleDeleteCategory, categories = [],
    handleCreateBlogCategory, handleDeleteBlogCategory, blogCategories = [],
    submitting, uploading,
    isLoading,
    error,
    onRetry
}) => {
    
    const labels = ADMIN_UI_CONSTANTS.settings;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.wrapper}>
                {isLoading ? (
                    <div className={styles.loadingWrapper}>
                        <Skeleton className={styles.skeletonMainWrapper} />
                    </div>
                ) : (
                    <>
                        {activeTab === 'add-tool' && (
                            <div className={styles.formContent}>
                                <header className={styles.formHeader}>
                                    <h2>{labels.addTool?.title}</h2>
                                    <p>{labels.addTool?.description}</p>
                                </header>

                                <form onSubmit={handleDirectAddTool} className={styles.complexForm}>
                                    <div className={styles.formSection}>
                                        <h3 className={styles.sectionSubtitle}><ShieldCheck size={18} /> {labels.addTool?.sections?.identity}</h3>
                                        <div className={styles.inputGrid}>
                                            <Input label={labels.addTool?.placeholders?.name} placeholder={labels.addTool?.placeholders?.nameHint} required value={newTool?.name || ''} onChange={e => setNewTool({ ...newTool, name: e.target.value })} />
                                            <Input label={labels.addTool?.placeholders?.url} type="url" placeholder={labels.addTool?.placeholders?.urlHint} required value={newTool?.url || ''} onChange={e => setNewTool({ ...newTool, url: e.target.value })} />
                                            <div className={styles.fieldWrapper}>
                                                <label className={styles.label}>{labels.addTool?.placeholders?.category}</label>
                                                <Select
                                                    options={categories?.map(c => ({ value: c.id, label: c.name })) || []}
                                                    value={newTool?.category_id}
                                                    onChange={(val) => setNewTool({ ...newTool, category_id: val })}
                                                    placeholder={labels.addTool?.placeholders?.category}
                                                />
                                            </div>
                                            <div className={styles.fieldWrapper}>
                                                <label className={styles.label}>{labels.addTool?.placeholders?.pricing}</label>
                                                <Select
                                                    options={[
                                                        { value: 'Free', label: 'Free' },
                                                        { value: 'Freemium', label: 'Freemium' },
                                                        { value: 'Paid', label: 'Paid' },
                                                        { value: 'Subscription', label: 'Subscription' }
                                                    ]}
                                                    value={newTool?.pricing_type}
                                                    onChange={(val) => setNewTool({ ...newTool, pricing_type: val })}
                                                    placeholder={labels.addTool?.placeholders?.pricing}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.formSection}>
                                        <h3 className={styles.sectionSubtitle}><Zap size={18} /> {labels.addTool?.sections?.content}</h3>
                                        <Input label={labels.addTool?.placeholders?.pitch} placeholder={labels.addTool?.placeholders?.pitchHint} required value={newTool?.short_description || ''} onChange={e => setNewTool({ ...newTool, short_description: e.target.value })} />
                                        <Input label={labels.addTool?.placeholders?.description} multiline rows={5} placeholder={labels.addTool?.placeholders?.descriptionHint} required value={newTool?.description || ''} onChange={e => setNewTool({ ...newTool, description: e.target.value })} />
                                        <Input label={labels.addTool?.placeholders?.pricingDetails} placeholder={labels.addTool?.placeholders?.pricingDetailsHint} value={newTool?.pricing_details || ''} onChange={e => setNewTool({ ...newTool, pricing_details: e.target.value })} />
                                    </div>

                                    <div className={styles.formSection}>
                                        <h3 className={styles.sectionSubtitle}>{labels.addTool?.sections?.assets}</h3>
                                        <div className={styles.mediaConfig}>
                                            <div className={styles.previewBox}>
                                                {adminImagePreview || newTool?.image_url ? (
                                                    <img src={adminImagePreview || newTool?.image_url} alt="Preview" className={styles.previewImg} />
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
                                                    <span>{labels.addTool?.actions?.manualMode}</span>
                                                </div>
                                                {adminUseManualUrl ? (
                                                    <Input placeholder={labels.addTool?.placeholders?.image} value={newTool?.image_url || ''} onChange={e => setNewTool({ ...newTool, image_url: e.target.value })} />
                                                ) : (
                                                    <div className={styles.fileUploadZone}>
                                                        <input type="file" accept="image/*" onChange={handleAdminFileChange} id="admin-file-tool" style={{ display: 'none' }} />
                                                        <label htmlFor="admin-file-tool" className={styles.customUploadBtn}>
                                                            {uploading ? labels.addTool?.actions?.uploading : labels.addTool?.actions?.chooseAsset}
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.formSection}>
                                        <h3 className={styles.sectionSubtitle}>{labels.addTool?.sections?.features}</h3>
                                        <div className={styles.featuresManager}>
                                            {(newTool?.features || []).map((feat, idx) => (
                                                <div key={idx} className={styles.featureEntry}>
                                                    <Input placeholder={labels.addTool?.placeholders?.feature?.replace('{n}', idx + 1)} value={feat} onChange={e => handleAdminFeatureChange(idx, e.target.value)} />
                                                    <button type="button" onClick={() => removeAdminFeature(idx)} className={styles.removeBtn}><Trash2 size={16} /></button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={addAdminFeature} className={styles.addFeatBtn}>
                                                <PlusCircle size={16} /> {labels.addTool?.actions?.addFeature}
                                            </button>
                                        </div>
                                    </div>

                                    <Button type="submit" isLoading={submitting} className={styles.submitBtn}>
                                        {labels.addTool?.actions?.publish}
                                    </Button>
                                </form>
                            </div>
                        )}

                        {(activeTab === 'categories' || activeTab === 'blog-categories') && (
                            <div className={styles.splitLayout}>
                                <div className={styles.formCol}>
                                    <div className={styles.sectionHeader}>
                                        {activeTab === 'blog-categories' ? <Tags size={20} className={styles.headerIcon} /> : <FolderTree size={20} className={styles.headerIcon} />}
                                        <h3 className={styles.title}>
                                            {labels.categories?.addTitle?.replace('{type}', activeTab === 'blog-categories' ? 'Blog' : 'Tool')}
                                        </h3>
                                    </div>
                                    <form onSubmit={activeTab === 'blog-categories' ? handleCreateBlogCategory : handleCreateCategory} className={styles.miniForm}>
                                        <Input placeholder={labels.categories?.placeholders?.name} required value={newCategory?.name || ''} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} />
                                        <Input placeholder={labels.categories?.placeholders?.slug} required value={newCategory?.slug || ''} onChange={e => setNewCategory({ ...newCategory, slug: e.target.value })} />
                                        {activeTab !== 'blog-categories' && <Input placeholder={labels.categories?.placeholders?.icon} value={newCategory?.icon_name || ''} onChange={e => setNewCategory({ ...newCategory, icon_name: e.target.value })} />}
                                        <Button type="submit" isLoading={submitting} className={styles.w100}>
                                            {labels.categories?.addTitle?.replace('{type}', activeTab === 'blog-categories' ? 'Blog' : 'Tool')}
                                        </Button>
                                    </form>
                                </div>
                                <div className={styles.listCol}>
                                    <div className={styles.sectionHeader}>
                                        <h3 className={styles.title}>{labels.categories?.inventory} ({(activeTab === 'blog-categories' ? blogCategories : categories)?.length || 0})</h3>
                                    </div>
                                    <div className={styles.scrollArea}>
                                        {(activeTab === 'blog-categories' ? blogCategories : categories)?.map(cat => (
                                            <div key={cat.id} className={styles.itemRow}>
                                                <div className={styles.itemInfo}>
                                                    <h5>{cat?.name || cat?.label}</h5>
                                                    <p>{cat?.slug}</p>
                                                </div>
                                                <button type="button" onClick={() => (activeTab === 'blog-categories' ? handleDeleteBlogCategory(cat.id) : handleDeleteCategory(cat.id))} className={styles.deleteBtn}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Safeguard>
    );
});

export default AdminSettingsManager;
