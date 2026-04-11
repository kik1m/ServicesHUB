import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Logo Component - The official HUBly branding
 */
const Logo = ({ size = 32, className = '', onClick }) => {
    return (
        <Link 
            to="/" 
            className={`logo-section ${className}`} 
            onClick={onClick}
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                textDecoration: 'none' 
            }}
        >
            <img 
                src="/logo.png" 
                alt="HUBly" 
                style={{ height: `${size}px`, width: 'auto' }} 
            />
            <div className="logo-text" style={{ fontSize: `${size * 0.65}px` }}>
                <span className="logo-white" style={{ fontWeight: '900', color: '#fff' }}>HUB</span>
                <span className="logo-gradient" style={{ 
                    fontWeight: '900', 
                    background: 'var(--gradient)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent' 
                }}>ly</span>
            </div>
        </Link>
    );
};

export default Logo;
