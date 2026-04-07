import React from 'react';
import { Link } from 'react-router-dom';
import { Share2, Plus } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs';

const DashboardHeader = ({ isCreator, user, showToast }) => {
    return (
        <header className="dashboard-header-premium">
            <div className="dash-breadcrumb-wrapper">
                <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Dashboard' }]} />
            </div>
            
            <div className="dash-header-main">
                <div className="dash-header-info">
                    <div className="dash-badge-pill">MEMBER AREA</div>
                    <h1 className="dash-title">
                        {isCreator ? 'Creator ' : 'My '}<span>Dashboard</span>
                    </h1>
                    <p className="dash-subtitle">
                        {isCreator ? 'Monitoring your tool clinical performance and listings' : 'Explore your favorites and community activity'}
                    </p>
                </div>

                <div className="dash-header-actions">
                    <button
                        onClick={() => {
                            const url = `${window.location.origin}/u/${user.id}`;
                            navigator.clipboard.writeText(url);
                            showToast('Public profile link copied!', 'success');
                        }}
                        className="btn-secondary dash-action-btn"
                    >
                        <Share2 size={18} /> <span>Share Profile</span>
                    </button>
                    <Link to="/submit" className="btn-primary dash-action-btn">
                        <Plus size={18} /> <span>{isCreator ? 'Submit Tool' : 'Become Creator'}</span>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
