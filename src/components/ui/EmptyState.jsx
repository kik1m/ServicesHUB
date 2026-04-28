import React from 'react';
import { PackageOpen } from 'lucide-react';
import Button from './Button';
import styles from './EmptyState.module.css';

const EmptyState = ({ 
  title = "No data found", 
  message = "We couldn't find what you're looking for right now.", 
  icon: IconComponent = PackageOpen,
  actionText,
  onAction,
  className = "" 
}) => {
  return (
    <div className={`${styles.emptyStateContainer} ${className}`}>
      <div className={styles.iconWrapper}>
        <IconComponent size={48} className={styles.icon} strokeWidth={1.5} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {actionText && onAction && (
        <Button 
          variant="secondary" 
          onClick={onAction}
          className={styles.actionBtn}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
