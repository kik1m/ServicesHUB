import React from 'react';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileNotFound = () => {
    return (
        <div className="page-wrapper" style={{ padding: '120px 5%', textAlign: 'center' }}>
            <User size={80} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Publisher not found</h2>
            <p style={{ color: 'var(--text-muted)' }}>The profile you are looking for does not exist or has been removed.</p>
            <Link to="/" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-block', textDecoration: 'none' }}>Return Home</Link>
        </div>
    );
};

export default ProfileNotFound;
