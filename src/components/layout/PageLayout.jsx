import React from 'react';
import styles from './PageLayout.module.css';

/**
 * PageLayout Component - Unified standard for all pages (10/10 Architecture)
 * Rule #20: Layout Responsibilty & Scalability
 */
const PageLayout = ({ children, className = '', variant = 'default' }) => {
  return (
    <div className={`page-wrapper ${styles.layoutBase} ${styles[variant]} ${className}`}>
      <div className={styles.container}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
