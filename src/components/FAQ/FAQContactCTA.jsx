import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQContactCTA = () => {
    return (
        <div className="glass-card help-cta">
            <MessageSquare size={48} color="var(--primary)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
            <h2 style={{ marginBottom: '1rem', margin: 0 }}>Still have questions?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>We&apos;re here to help. Reach out to our support team any time.</p>
            <Link to="/contact" className="btn-primary">Contact Support</Link>
        </div>
    );
};

export default FAQContactCTA;
