import React, { useState } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { reportsService } from '../services/reportsService';
import Button from './ui/Button';
import styles from './ReportToolModal.module.css';

/**
 * ReportToolModal - Elite Standard
 * Rule #1: Logic Isolation (reportsService)
 */
const ReportToolModal = ({ toolId, toolName, user, onClose }) => {
    const { showToast } = useToast();
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (reason.trim().length < 10) {
            showToast('Please provide a bit more detail (min 10 chars).', 'warning');
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await reportsService.submitReport({
                tool_id: toolId,
                user_id: user?.id,
                reason: reason
            });

            if (error) throw error;
            
            showToast('Report submitted successfully. Thank you!', 'success');
            onClose();
        } catch (err) {
            console.error('Report submission error:', err);
            showToast('Failed to submit report. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
                    <X size={24} />
                </button>

                <div className={styles.header}>
                    <AlertTriangle size={32} className={styles.warningIcon} />
                    <h3>Report an Issue</h3>
                </div>

                <p className={styles.description}>
                    If you noticed that the link for <strong>{toolName}</strong> is broken, leads to a completely different site, or contains malicious content, please let us know.
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Reason for reporting</label>
                        <textarea 
                            rows="4"
                            placeholder="e.g. The link is 404 dead, or it redirects to spam..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className={styles.textarea}
                            required
                        ></textarea>
                    </div>

                    <div className={styles.actions}>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            disabled={submitting}
                            isLoading={submitting}
                            className={styles.submitBtn}
                        >
                            Submit Report
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportToolModal;
