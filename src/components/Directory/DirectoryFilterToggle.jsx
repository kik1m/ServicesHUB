import React from 'react';
import { Filter } from 'lucide-react';
import styles from './DirectoryFilterToggle.module.css';

const DirectoryFilterToggle = ({ onClick }) => {
    return (
        <button 
            className={styles.mobileFilterToggle}
            onClick={onClick}
            aria-label="Toggle Filters"
        >
            <Filter size={18} />
            Filters
        </button>
    );
};

export default React.memo(DirectoryFilterToggle);
