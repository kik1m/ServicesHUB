import React from 'react';
import { ArrowLeft, Award, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';

const SubmitHeader = ({ toolCount, isLimitReached, navigate }) => {
    return (
        <>
            <div className="submit-breadcrumbs-wrapper">
                <Breadcrumbs items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Submit Tool' }]} />
            </div>

            <header className="submit-header">
                <div className="submit-header-title-row">
                    <button onClick={() => navigate('/dashboard')} className="icon-btn-slim">
                        <ArrowLeft size={20} />
                    </button>
                    <h1>Submit New Tool</h1>
                </div>
                <p>
                    Join {toolCount > 0 ? toolCount : 'our'} community of innovators.
                </p>
            </header>

            {isLimitReached && (
                <div className="limit-alert-card fade-in">
                    <Award size={30} color="#FFD700" />
                    <div className="limit-alert-content">
                        <h4>Free Limit Reached</h4>
                        <p>You have reached the 2-tool limit for free accounts. Upgrade to list unlimited tools.</p>
                    </div>
                    <Link to="/premium" className="upgrade-btn-gold">Upgrade Now</Link>
                </div>
            )}
        </>
    );
};

export default SubmitHeader;
