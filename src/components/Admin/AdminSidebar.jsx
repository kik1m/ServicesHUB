import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const AdminSidebar = ({ activeTab }) => {
    if (activeTab !== 'pending' && activeTab !== 'featured') return null;

    return (
        <aside className="admin-sidebar">
            <div className="glass-card admin-health-card">
                <h2>Platform Health</h2>
                <div className="admin-health-stat">
                    <div>
                        <div className="admin-stat-row">
                            <span>Database Connection</span>
                            <span className="admin-text-secondary">Stable</span>
                        </div>
                        <div className="admin-progress-bg">
                            <div className="admin-progress-bar secondary" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="admin-stat-row">
                            <span>Auth Service</span>
                            <span className="admin-text-primary-bold">Active</span>
                        </div>
                        <div className="admin-progress-bg">
                            <div className="admin-progress-bar primary" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card admin-shortcut-card">
                <h4>Admin Shortcuts</h4>
                <nav className="admin-shortcut-links">
                    <Link to="/tools" className="admin-shortcut-link"><ArrowUpRight size={14} /> View Directory</Link>
                    <Link to="/blog" className="admin-shortcut-link"><ArrowUpRight size={14} /> View Blog</Link>
                </nav>
            </div>
        </aside>
    );
};

export default AdminSidebar;
