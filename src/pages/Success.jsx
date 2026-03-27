import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Plus } from 'lucide-react';

const Success = () => {
    return (
        <div className="success-page" style={{ 
            minHeight: '80vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '100px 20px'
        }}>
            <div className="glass-card" style={{ 
                maxWidth: '500px', 
                textAlign: 'center', 
                padding: '3rem',
                border: '1px solid rgba(0, 210, 255, 0.3)'
            }}>
                <div style={{ 
                    margin: '0 auto 2rem',
                    color: 'var(--secondary)',
                    animation: 'pulse 2s infinite'
                }}>
                    <CheckCircle size={100} />
                </div>
                
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>
                    Welcome to <span className="gradient-text">Premium!</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.2rem', lineHeight: '1.6' }}>
                    Authentication successful! Your account has been upgraded. You now have full access to all premium tools, advanced analytics, and priority support.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/tools" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        Discover More Tools
                    </Link>
                    <Link to="/" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Success;
