import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import styles from './NotFoundActions.module.css';

const NotFoundActions = () => {
    return (
        <div className={styles.actionsRow}>
            <Link to="/" className="btn-primary">
                Return Home <Home size={18} />
            </Link>
            <Link to="/tools" className="btn-secondary">
                Explore Tools <Search size={18} />
            </Link>
        </div>
    );
};

export default NotFoundActions;
