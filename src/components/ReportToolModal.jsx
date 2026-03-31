import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const ReportToolModal = ({ toolId, toolName, onClose }) => {
    const { user } = useAuth();
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
            const { error } = await supabase
                .from('reports')
                .insert([{
                    tool_id: toolId,
                    user_id: user ? user.id : null,
                    reason: reason
                }]);

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
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 99999, padding: '20px'
        }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={24} />
                </button>

                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '1.5rem', color: '#ff4757' }}>
                    <AlertTriangle size={32} />
                    <h3 style={{ margin: 0 }}>Report an Issue</h3>
                </div>

                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    If you noticed that the link for <strong>{toolName}</strong> is broken, leads to a completely different site, or contains malicious content, please let us know so we can investigate.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Reason for reporting</label>
                        <textarea 
                            rows="4"
                            placeholder="e.g. The link is 404 dead, or it redirects to spam..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', borderRadius: '12px', resize: 'vertical' }}
                            required
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
                        <button type="submit" disabled={submitting} className="btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {submitting && <Loader2 className="animate-spin" size={16} />} 
                            Submit Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportToolModal;
