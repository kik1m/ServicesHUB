import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const CategoriesSuggestCTA = () => {
    return (
        <div className="glass-card submit-cta-category">
            <Zap size={32} color="var(--secondary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Suggest a Category</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '600px', margin: '10px auto 2rem' }}>
                Didn&apos;t find the right niche? We are always expanding our directory. Let us know what you are looking for!
            </p>
            <Link to="/contact" className="btn-outline">Tell us what&apos;s missing</Link>
        </div>
    );
};

export default CategoriesSuggestCTA;
