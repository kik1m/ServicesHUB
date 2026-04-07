import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const DashboardWelcomeCTA = () => {
    return (
        <div className="welcome-banner">
            <div className="glass-card" style={{ 
                padding: '2rem', 
                background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.05) 0%, rgba(58, 123, 213, 0.05) 100%)', 
                border: '1px solid rgba(0, 210, 255, 0.1)',
                borderRadius: '24px'
            }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem' }}>Want to Publish?</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2rem' }}>
                    Showcase your AI or SaaS tool to thousands of monthly visitors and grow your user base clinically.
                </p>
                <Link to="/submit" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', textDecoration: 'none', padding: '12px 20px', fontWeight: '700' }}>
                    <PlusCircle size={18} /> Submit Your Tool
                </Link>
            </div>
        </div>
    );
};

export default DashboardWelcomeCTA;
