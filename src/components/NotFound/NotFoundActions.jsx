import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFoundActions = () => {
    return (
        <div className="not-found-actions-row">
            <Link to="/" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                <Home size={20} /> Go Home
            </Link>
            <Link to="/tools" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                <Search size={20} /> Discover Tools
            </Link>
        </div>
    );
};

export default NotFoundActions;
