import React from 'react';
import SkeletonLoader from '../SkeletonLoader';

/**
 * High-end skeleton for ToolCard to match premium aesthetic
 */
const ToolCardSkeleton = () => {
  return (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.02)', 
      borderRadius: '24px', 
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* Logo & Title Area */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <SkeletonLoader type="avatar" width="60px" height="60px" borderRadius="16px" />
        <div style={{ flex: 1 }}>
          <SkeletonLoader type="title" width="70%" style={{ marginBottom: '8px' }} />
          <div style={{ display: 'flex', gap: '6px' }}>
            <SkeletonLoader type="text" width="40px" height="12px" borderRadius="4px" />
            <SkeletonLoader type="text" width="60px" height="12px" borderRadius="4px" />
          </div>
        </div>
      </div>

      {/* Description Area */}
      <div style={{ flex: 1 }}>
        <SkeletonLoader type="text" width="100%" />
        <SkeletonLoader type="text" width="90%" style={{ marginTop: '8px' }} />
      </div>

      {/* Footer Area */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <SkeletonLoader type="avatar" width="14px" height="14px" />
          <SkeletonLoader type="text" width="30px" height="12px" />
        </div>
        <SkeletonLoader type="text" width="60px" height="12px" />
      </div>
    </div>
  );
};

export default ToolCardSkeleton;
