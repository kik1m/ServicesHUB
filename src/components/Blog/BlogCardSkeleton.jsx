import React from 'react';
import SkeletonLoader from '../SkeletonLoader';

/**
 * Skeleton component for BlogCard
 */
const BlogCardSkeleton = () => {
  return (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.02)', 
      borderRadius: '24px', 
      overflow: 'hidden', 
      border: '1px solid rgba(255, 255, 255, 0.05)',
      height: '100%'
    }}>
      {/* Image Skeleton */}
      <SkeletonLoader type="image" height="240px" width="100%" />
      
      <div style={{ padding: '2rem' }}>
        {/* Category & Date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <SkeletonLoader type="text" width="60px" />
          <SkeletonLoader type="text" width="80px" />
        </div>
        
        {/* Title */}
        <SkeletonLoader type="title" width="90%" style={{ marginBottom: '1rem' }} />
        <SkeletonLoader type="title" width="60%" style={{ marginBottom: '1.5rem' }} />
        
        {/* Excerpt */}
        <SkeletonLoader type="text" width="100%" />
        <SkeletonLoader type="text" width="100%" />
        <SkeletonLoader type="text" width="40%" style={{ marginBottom: '2rem' }} />
        
        {/* Author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <SkeletonLoader type="avatar" size="32px" />
          <SkeletonLoader type="text" width="100px" />
        </div>
      </div>
    </div>
  );
};

export default BlogCardSkeleton;
