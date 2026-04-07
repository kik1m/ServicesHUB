import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const CategoryDetailEmpty = ({ categoryName }) => {
    return (
        <section className="main-section">
            <div className="glass-card submit-cta-category">
                <Zap size={32} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Know a great {categoryName} tool?</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '600px', margin: '10px auto 2rem' }}>
                    Help others discover the best solutions in this category. Submit your own or a tool you love to grow this niche!
                </p>
                <Link to="/submit" className="btn-outline">Submit to this Category</Link>
            </div>
        </section>
    );
};

export default CategoryDetailEmpty;
