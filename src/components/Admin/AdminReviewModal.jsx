
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, ExternalLink, RefreshCw, FilePlus, Edit3, Save, Trash2, PlusCircle, LayoutGrid, Zap, DollarSign } from 'lucide-react';
import Button from '../ui/Button';
import SmartImage from '../ui/SmartImage';
import Input from '../ui/Input';
import Select from '../ui/Select';
import styles from './AdminReviewModal.module.css';
import { ADMIN_UI_CONSTANTS } from '../../constants/adminConstants';

/**
 * AdminReviewModal - Elite Hardened Modal (Standard Version)
 */
const AdminReviewModal = ({ 
    showReviewModal, 
    selectedReview, 
    editMode = false,
    handleCloseReview, 
    handleApprove, 
    handleReject, 
    handleUpdateToolDirect,
    getChangedFields,
    isLoading = false,
    categories = []
}) => {
    const labels = ADMIN_UI_CONSTANTS.review;
    const [editData, setEditData] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (selectedReview && editMode) {
            // Rule #24.3: Ensure no nulls are passed to inputs (React Warning fix)
            const sanitizedInitial = { ...selectedReview };
            Object.keys(sanitizedInitial).forEach(key => {
                if (sanitizedInitial[key] === null) sanitizedInitial[key] = '';
            });
            setEditData(sanitizedInitial);
        } else {
            setEditData(null);
        }
    }, [selectedReview, editMode]);

    if (!showReviewModal || !selectedReview) return null;

    const isUpdate = !!selectedReview.pending_changes;

    const onSave = async () => {
        if (!editData) return;
        setIsSaving(true);
        try {
            // Elite Sanitization: Strip ALL known virtual/relational fields and read-only metadata
            const { 
                categories, 
                formatted_date, 
                pending_changes,
                created_at, 
                updated_at,
                click_count,
                view_count,
                ...cleanPayload 
            } = editData;
            
            // Convert empty strings back to null if needed
            Object.keys(cleanPayload).forEach(key => {
                if (cleanPayload[key] === '') cleanPayload[key] = null;
            });

            await handleUpdateToolDirect(selectedReview.id, cleanPayload);
            handleCloseReview();
        } catch (err) {
            console.error('[AdminReviewModal] Save Error:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const renderFieldValue = (field, value) => {
        if (field.isImage) {
            return <SmartImage src={value} alt="Preview" className={styles.diffImg} />;
        }
        if (field.isArray) {
            return (
                <div className={styles.diffArray}>
                    {(value || []).map((v, i) => <div key={i} className={styles.diffArrayItem}>• {v}</div>)}
                </div>
            );
        }
        return <div className={styles.diffText}>{value}</div>;
    };

    return (
        <div className={styles.overlay}>
            <Safeguard error={null}>
                <div className={styles.modalContent}>
                    <header className={styles.modalHeader}>
                        <div className={styles.headerIcon}>
                            {editMode ? <Edit3 size={24} /> : isUpdate ? <RefreshCw size={24} /> : <FilePlus size={24} />}
                        </div>
                        <div className={styles.headerText}>
                            <h2 className={styles.title}>
                                {editMode ? "Elite Tool Editor" : isUpdate ? labels.updateTitle : labels.newTitle}
                            </h2>
                            <p className={styles.subtitle}>
                                {labels.entity}: <span className={styles.entityName}>{selectedReview?.name}</span>
                            </p>
                        </div>
                        <button onClick={handleCloseReview} className={styles.closeBtn} aria-label={labels.actions?.close}>
                            <X size={24} />
                        </button>
                    </header>

                    <div className={styles.modalBody}>
                        {editMode && editData ? (
                            <div className={styles.editView}>
                                <div className={styles.editSection}>
                                    <h4 className={styles.sectionTitle}><LayoutGrid size={16} /> Identity & Context</h4>
                                    <div className={styles.editGrid}>
                                        <Input label="Tool Name" value={editData?.name || ''} onChange={e => setEditData({...editData, name: e.target.value})} />
                                        <Input label="Website URL" value={editData?.url || ''} onChange={e => setEditData({...editData, url: e.target.value})} />
                                        <div className={styles.fieldWrapper}>
                                            <label className={styles.fieldLabel}>Category</label>
                                            <Select 
                                                options={categories?.map(c => ({ value: c.id, label: c.name })) || []}
                                                value={editData?.category_id}
                                                onChange={(val) => setEditData({ ...editData, category_id: val })}
                                                placeholder="Choose Category"
                                            />
                                        </div>
                                        <div className={styles.fieldWrapper}>
                                            <label className={styles.fieldLabel}>Pricing Model</label>
                                            <Select 
                                                options={[
                                                    { value: 'Free', label: 'Free' },
                                                    { value: 'Freemium', label: 'Freemium' },
                                                    { value: 'Paid', label: 'Paid' },
                                                    { value: 'Subscription', label: 'Subscription' }
                                                ]}
                                                value={editData?.pricing_type}
                                                onChange={(val) => setEditData({ ...editData, pricing_type: val })}
                                                placeholder="Choose Model"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.editSection}>
                                    <h4 className={styles.sectionTitle}><Zap size={16} /> Content & Narrative</h4>
                                    <div className={styles.fullGrid}>
                                        <Input label="Short Pitch (Tagline)" value={editData?.short_description || ''} onChange={e => setEditData({...editData, short_description: e.target.value})} />
                                        <Input label="Full Description" multiline rows={5} value={editData?.description || ''} onChange={e => setEditData({...editData, description: e.target.value})} />
                                        <Input label="Pricing Details / Notes" value={editData?.pricing_details || ''} onChange={e => setEditData({...editData, pricing_details: e.target.value})} />
                                    </div>
                                </div>

                                <div className={styles.editSection}>
                                    <h4 className={styles.sectionTitle}><DollarSign size={16} /> Assets & Capabilities</h4>
                                    <div className={styles.fullGrid}>
                                        <Input label="Direct Image/Logo URL" value={editData?.image_url || ''} onChange={e => setEditData({...editData, image_url: e.target.value})} />
                                        <div className={styles.featuresEdit}>
                                            <label className={styles.fieldLabel}>Core Features</label>
                                            <div className={styles.featuresList}>
                                                {(editData?.features || []).map((f, i) => (
                                                    <div key={i} className={styles.featureInputRow}>
                                                        <Input value={f} onChange={e => {
                                                            const nf = [...editData.features];
                                                            nf[i] = e.target.value;
                                                            setEditData({...editData, features: nf});
                                                        }} placeholder={`Feature ${i+1}`} />
                                                        <button type="button" onClick={() => setEditData({...editData, features: editData.features.filter((_, idx) => idx !== i)})} className={styles.removeFeature}><Trash2 size={16} /></button>
                                                    </div>
                                                ))}
                                                <button type="button" onClick={() => setEditData({...editData, features: [...(editData?.features || []), '']})} className={styles.addFeatureBtn}>
                                                    <PlusCircle size={16} /> Add Capability
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.diffView}>
                                <div className={styles.diffTable}>
                                    {getChangedFields(selectedReview, isUpdate ? selectedReview.pending_changes : selectedReview, categories).map(field => (
                                        <div key={field.key} className={`${styles.diffRow} ${field.hasChanged ? styles.rowChanged : ''}`}>
                                            <div className={styles.fieldMeta}>
                                                <span className={styles.fieldLabel}>{field.label}</span>
                                                {field.hasChanged && <span className={styles.changeBadge}>Changed</span>}
                                            </div>

                                            <div className={styles.diffContent}>
                                                {isUpdate ? (
                                                    <div className={styles.compareGrid}>
                                                        <div className={styles.colOld}>
                                                            <span className={styles.colTag}>Current</span>
                                                            {renderFieldValue(field, field.oldValue)}
                                                        </div>
                                                        <div className={styles.colNew}>
                                                            <span className={styles.colTag}>Proposed</span>
                                                            {renderFieldValue(field, field.newValue)}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className={styles.singleView}>
                                                        {renderFieldValue(field, field.newValue)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <footer className={styles.modalFooter}>
                        {editMode ? (
                            <>
                                <Button variant="secondary" onClick={handleCloseReview} disabled={isSaving}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={onSave} isLoading={isSaving} icon={Save}>
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="secondary"
                                    onClick={() => handleReject(selectedReview)}
                                    icon={AlertCircle}
                                    className={styles.rejectBtn}
                                >
                                    {isUpdate ? labels.actions?.discard : labels.actions?.reject}
                                </Button>
                                
                                <Button
                                    variant="primary"
                                    onClick={() => handleApprove(selectedReview)}
                                    icon={CheckCircle}
                                    className={styles.approveBtn}
                                >
                                    {isUpdate ? labels.actions?.apply : labels.actions?.approve}
                                </Button>
                            </>
                        )}
                    </footer>
                </div>
            </Safeguard>
        </div>
    );
};

export default AdminReviewModal;
