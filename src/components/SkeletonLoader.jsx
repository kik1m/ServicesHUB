import React from 'react';

const SkeletonLoader = ({ type = 'text', width, height, borderRadius, style, className = '' }) => {
    const baseStyle = {
        width: width || (type === 'title' ? '60%' : type === 'text' ? '100%' : '100%'),
        height: height || (type === 'title' ? '2.5rem' : type === 'text' ? '1rem' : type === 'avatar' ? '120px' : type === 'image' ? '200px' : '100%'),
        borderRadius: borderRadius || (type === 'avatar' ? '30px' : type === 'image' ? '16px' : '8px'),
        ...style
    };

    // Card/Tool Skeleton
    if (type === 'card') {
        return (
            <div className={`glass-card skeleton-card ${className}`} style={{ padding: '24px', height: '100%', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '1.5rem' }}>
                    <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '16px' }}></div>
                    <div style={{ flexGrow: 1 }}>
                        <div className="skeleton" style={{ width: '70%', height: '20px', marginBottom: '8px' }}></div>
                        <div className="skeleton" style={{ width: '40%', height: '14px' }}></div>
                    </div>
                </div>
                <div className="skeleton" style={{ width: '100%', height: '40px', marginBottom: '1.5rem', opacity: 0.6 }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <div className="skeleton" style={{ width: '60px', height: '1rem' }}></div>
                    <div className="skeleton" style={{ width: '100px', height: '1rem' }}></div>
                </div>
            </div>
        );
    }

    // Stat Item Skeleton
    if (type === 'stat') {
        return (
            <div className={`glass-card ${className}`} style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div className="skeleton" style={{ width: '50px', height: '50px', borderRadius: '15px' }}></div>
                <div style={{ flexGrow: 1 }}>
                    <div className="skeleton" style={{ width: '40%', height: '12px', marginBottom: '8px' }}></div>
                    <div className="skeleton" style={{ width: '60%', height: '24px' }}></div>
                </div>
            </div>
        );
    }

    // Category Item Skeleton
    if (type === 'category') {
        return (
            <div className={`glass-card ${className}`} style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem', height: '80px', borderRadius: '20px' }}>
                <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0 }}></div>
                <div style={{ flexGrow: 1 }}>
                    <div className="skeleton" style={{ width: '60%', height: '14px', marginBottom: '6px' }}></div>
                    <div className="skeleton" style={{ width: '30%', height: '10px' }}></div>
                </div>
            </div>
        );
    }

    // Blog Post Skeleton
    if (type === 'blog') {
        return (
            <div className={`glass-card ${className}`} style={{ padding: '0', overflow: 'hidden', height: '100%' }}>
                <div className="skeleton" style={{ width: '100%', height: '200px', borderRadius: '0' }}></div>
                <div style={{ padding: '1.5rem' }}>
                    <div className="skeleton" style={{ width: '40%', height: '12px', marginBottom: '1rem' }}></div>
                    <div className="skeleton" style={{ width: '90%', height: '20px', marginBottom: '8px' }}></div>
                    <div className="skeleton" style={{ width: '70%', height: '20px' }}></div>
                </div>
            </div>
        );
    }

    // Trending Item Skeleton
    if (type === 'trending') {
        return (
            <div className={`glass-card ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1.2rem 1.5rem', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div className="skeleton" style={{ width: '56px', height: '56px', borderRadius: '14px', flexShrink: 0 }}></div>
                <div style={{ flexGrow: 1 }}>
                    <div className="skeleton" style={{ width: '60%', height: '16px', marginBottom: '6px' }}></div>
                    <div className="skeleton" style={{ width: '30%', height: '10px' }}></div>
                </div>
            </div>
        );
    }

    return (
        <div 
            className={`skeleton ${className}`} 
            style={baseStyle}
        />
    );
};

export default SkeletonLoader;
