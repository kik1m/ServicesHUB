import React from 'react';

const SkeletonLoader = ({ type = 'card' }) => {
    if (type === 'card') {
        return (
            <div className="glass-card" style={{ padding: '1.5rem', height: '100%', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '1rem' }}>
                    <div className="skeleton" style={{ width: '56px', height: '56px', borderRadius: '16px' }}></div>
                    <div style={{ flexGrow: 1 }}>
                        <div className="skeleton" style={{ width: '70%', height: '20px', marginBottom: '8px' }}></div>
                        <div className="skeleton" style={{ width: '40%', height: '14px' }}></div>
                    </div>
                </div>
                <div className="skeleton" style={{ width: '100%', height: '14px', marginBottom: '10px' }}></div>
                <div className="skeleton" style={{ width: '90%', height: '14px', marginBottom: '20px' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="skeleton" style={{ width: '50px', height: '16px' }}></div>
                    <div className="skeleton" style={{ width: '60px', height: '16px' }}></div>
                </div>
            </div>
        );
    }

    if (type === 'stat') {
        return (
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div className="skeleton" style={{ width: '50px', height: '50px', borderRadius: '15px' }}></div>
                <div style={{ flexGrow: 1 }}>
                    <div className="skeleton" style={{ width: '40%', height: '12px', marginBottom: '8px' }}></div>
                    <div className="skeleton" style={{ width: '60%', height: '24px' }}></div>
                </div>
            </div>
        );
    }

    return null;
};

export default SkeletonLoader;
