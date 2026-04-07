import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const SubmitSuccess = ({ toolName, onNavigateDashboard, onReset }) => {
    return (
        <div className="success-wizard-container fade-in">
            <div className="success-wizard-card">
                <div className="success-icon-bg">
                    <CheckCircle2 size={60} color="#00ffaa" />
                </div>
                <h2>Success!</h2>
                <p>
                    Your tool <strong>{toolName}</strong> has been submitted. Our team will review and publish it within 24-48 hours.
                </p>
                <div className="success-actions-row">
                    <button onClick={onNavigateDashboard} className="btn-primary">Dashboard</button>
                    <button onClick={onReset} className="btn-outline">Add Another</button>
                </div>
            </div>
        </div>
    );
};

export default SubmitSuccess;
