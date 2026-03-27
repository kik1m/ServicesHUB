import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ghost, Home, Search } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';

const NotFound = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 400);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="not-found-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SkeletonLoader height="400px" width="600px" borderRadius="24px" />
            </div>
        );
    }
    return (
        <div className="not-found-page" style={{ 
            minHeight: '80vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '100px 20px'
        }}>
            <div className="glass-card" style={{ 
                maxWidth: '600px', 
                textAlign: 'center', 
                padding: '3rem'
            }}>
                <div className="auth-icon" style={{ 
                    margin: '0 auto 1.5rem',
                    width: '80px',
                    height: '80px',
                    background: 'var(--gradient)',
                    padding: '20px',
                    borderRadius: '20px'
                }}>
                    <Ghost size={40} color="white" />
                </div>
                
                <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1rem', background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</h1>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Lost in Space?</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
                    The page you are looking for has drifted into another galaxy. Let's get you back to the tools that matter.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Home size={20} /> Go Home
                    </Link>
                    <Link to="/tools" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Search size={20} /> Discover Tools
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
