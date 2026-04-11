import React from 'react';
import { X, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import styles from './AdminReviewModal.module.css';

const AdminReviewModal = ({ showReviewModal, selectedReview, handleCloseReview, handleApprove, handleReject, getChangedFields }) => {
    if (!showReviewModal || !selectedReview) return null;

    const isUpdate = !!selectedReview.pending_changes;

    return (
        <div key="review-modal" className={styles.overlay}>
            <div className={`${styles.content} glass-card`}>
                <button onClick={handleCloseReview} className={styles.close} aria-label="Close modal">
                    <X size={24} />
                </button>

                <div className={styles.header}>
                    <h2>
                        {isUpdate ? 'Review Pending Changes' : 'New Tool Approval'}
                    </h2>
                    <p>
                        For tool: <span className={styles.textPrimaryBold}>{selectedReview.name}</span>
                    </p>
                </div>

                <div className={styles.diffContainer}>
                    {isUpdate ? (
                        // DIFF VIEW MODE
                        <div className={styles.diffContainer}>
                            {getChangedFields(selectedReview, selectedReview.pending_changes).map(field => (
                                <div key={field.key} className={styles.diffCard}>
                                    <h4 className={styles.diffLabel}>{field.label}</h4>
                                    <div className={styles.diffGrid}>
                                        <div className={styles.diffCol}>
                                            <h6>CURRENT</h6>
                                            {field.isImage ? <img src={field.oldValue} alt="Current" className={styles.imgRounded} /> :
                                                field.isArray ? (field.oldValue || []).map((f, i) => <div key={i} className={styles.oldText}>• {f}</div>) :
                                                    <div className={styles.oldVal}>{field.oldValue || 'None'}</div>}
                                        </div>
                                        <div className={styles.diffCol}>
                                            <h6>PROPOSED</h6>
                                            {field.isImage ? <img src={field.newValue} alt="Proposed" className={styles.imgRounded} style={{ border: '2px solid #00ff88' }} /> :
                                                field.isArray ? (field.newValue || []).map((f, i) => <div key={i} className={styles.newText}>• {f}</div>) :
                                                    <div className={styles.newVal}>{field.newValue}</div>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // FULL PREVIEW MODE
                        <div className={styles.previewGrid}>
                            <div>
                                <img src={selectedReview.image_url} alt={selectedReview.name} className={styles.imgLarge} />
                                <div style={{ marginTop: '1.5rem' }}>
                                    <div className={styles.infoBlock}>
                                        <h5>Source / Website URL</h5>
                                        <a href={selectedReview.url} target="_blank" rel="noreferrer" className={styles.textPrimaryBold} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                                            {selectedReview.url} <ExternalLink size={12} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.previewInfo}>
                                <div className={styles.infoBlock}>
                                    <h5>Quick Pitch</h5>
                                    <p style={{ fontWeight: '700' }}>{selectedReview.short_description}</p>
                                </div>
                                <div className={styles.infoBlock}>
                                    <h5>Full Capabilities</h5>
                                    <p>{selectedReview.description}</p>
                                </div>
                                <div className={styles.infoBlock}>
                                    <h5>Key Features & Specs</h5>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                                        {(selectedReview.features || []).map((f, i) => (
                                            <span key={i} className={styles.featureTag}>{f}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <button
                        onClick={async () => {
                            await handleApprove(selectedReview);
                            handleCloseReview();
                        }}
                        className={styles.btnApprove}
                    >
                        <CheckCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        {isUpdate ? 'Apply Changes' : 'Approve & Publish'}
                    </button>
                    <button
                        onClick={async () => {
                            await handleReject(selectedReview);
                            handleCloseReview();
                        }}
                        className={styles.btnReject}
                    >
                        <AlertCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        {isUpdate ? 'Discard Changes' : 'Reject & Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminReviewModal;
