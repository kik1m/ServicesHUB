import React from 'react';
import { Link } from 'react-router-dom';

const SuccessActions = () => {
    return (
        <div className="success-actions-row">
            <Link to="/tools" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                Discover More Tools
            </Link>
            <Link to="/" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                Back to Home
            </Link>
        </div>
    );
};

export default SuccessActions;
