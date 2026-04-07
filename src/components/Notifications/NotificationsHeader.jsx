import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';

const NotificationsHeader = ({ hasNotifications, onClearAll }) => {
    return (
        <div className="notifications-header-row">
            <div className="notifications-title-group">
                <Link to="/dashboard" style={{ color: 'var(--text-muted)' }}><ArrowLeft size={24} /></Link>
                <h1 style={{ margin: 0 }}>Notifications</h1>
            </div>
            {hasNotifications && (
                <button onClick={onClearAll} className="btn-clear-all">
                    <Trash2 size={18} /> Clear All
                </button>
            )}
        </div>
    );
};

export default NotificationsHeader;
