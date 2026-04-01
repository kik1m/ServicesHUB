import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ items }) => {
    return (
        <nav className="breadcrumbs" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '2rem',
            fontSize: '0.9rem',
            color: 'var(--text-muted)'
        }}>
            <Link to="/" style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
                <Home size={14} />
            </Link>
            
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <ChevronRight size={14} opacity={0.5} />
                    {item.link ? (
                        <Link to={item.link} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {item.label}
                        </Link>
                    ) : (
                        <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{item.label}</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
