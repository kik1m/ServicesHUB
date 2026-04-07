import React from 'react';
import { X } from 'lucide-react';

const AdminReviewModal = ({ showReviewModal, selectedReview, handleCloseReview, handleApprove, handleReject, getChangedFields }) => {
    if (!showReviewModal || !selectedReview) return null;

    return (
        <div key="review-modal" className="admin-modal-overlay">
            <div className="glass-card admin-modal-content">
                <button onClick={handleCloseReview} className="admin-modal-close"><X /></button>

                <div className="admin-modal-header">
                    <h2>
                        {selectedReview.is_approved ? 'Review Pending Changes' : 'New Tool Approval'}
                    </h2>
                    <p>
                        For tool: <span className="admin-text-primary-bold">{selectedReview.name}</span>
                    </p>
                </div>

                <div className="admin-diff-container">
                    {selectedReview.is_approved ? (
                        // DIFF VIEW MODE
                        <div className="admin-diff-container">
                            {getChangedFields(selectedReview, selectedReview.pending_changes).map(field => (
                                <div key={field.key} className="admin-diff-card">
                                    <h4 className="admin-diff-label">{field.label}</h4>
                                    <div className="admin-diff-grid">
                                        <div className="admin-diff-col">
                                            <h6>CURRENT</h6>
                                            {field.isImage ? <img src={field.oldValue} alt="Current" className="admin-img-rounded" /> :
                                                field.isArray ? (field.oldValue || []).map((f, i) => <div key={i} className="admin-diff-old-text">• {f}</div>) :
                                                    <div className="admin-diff-old-val">{field.oldValue || 'None'}</div>}
                                        </div>
                                        <div className="admin-diff-col">
                                            <h6>PROPOSED</h6>
                                            {field.isImage ? <img src={field.newValue} alt="Proposed" className="admin-img-rounded" style={{ border: '2px solid #00ff88' }} /> :
                                                field.isArray ? (field.newValue || []).map((f, i) => <div key={i} className="admin-diff-new-text">• {f}</div>) :
                                                    <div className="admin-diff-new-val">{field.newValue}</div>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // FULL PREVIEW MODE
                        <div className="admin-modal-preview-grid">
                            <div>
                                <img src={selectedReview.image_url} alt={selectedReview.name} className="admin-img-large" />
                                <div style={{ marginTop: '1.5rem', wordBreak: 'break-all' }}>
                                    <h5 style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>URL</h5>
                                    <a href={selectedReview.url} target="_blank" rel="noreferrer" className="admin-text-primary-bold" style={{ fontSize: '0.9rem' }}>{selectedReview.url}</a>
                                </div>
                            </div>
                            <div className="admin-form-group">
                                <div>
                                    <h5 style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Short Pitch</h5>
                                    <p style={{ fontWeight: '700', margin: 0 }}>{selectedReview.short_description}</p>
                                </div>
                                <div>
                                    <h5 style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Full Description</h5>
                                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)', margin: 0 }}>{selectedReview.description}</p>
                                </div>
                                <div>
                                    <h5 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Features</h5>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {(selectedReview.features || []).map((f, i) => (
                                            <span key={i} className="admin-feature-tag">• {f}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="admin-modal-footer">
                    <button
                        onClick={async () => {
                            await handleApprove(selectedReview);
                            handleCloseReview();
                        }}
                        className="admin-btn-approve"
                    >
                        {selectedReview.is_approved ? 'Apply Changes' : 'Approve & Publish'}
                    </button>
                    <button
                        onClick={async () => {
                            await handleReject(selectedReview);
                            handleCloseReview();
                        }}
                        className="admin-btn-reject"
                    >
                        {selectedReview.is_approved ? 'Discard Changes' : 'Reject Tool'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminReviewModal;
