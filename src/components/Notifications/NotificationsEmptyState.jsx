import React from 'react';
import { Bell } from 'lucide-react';

const NotificationsEmptyState = () => {
    return (
        <div className="notifications-empty-state">
            <Bell size={64} style={{ margin: '0 auto 1.5rem' }} />
            <h3>No notifications yet</h3>
        </div>
    );
};

export default NotificationsEmptyState;
