import React from 'react';
import SkeletonLoader from '../SkeletonLoader';
import detailStyles from '../../pages/ToolDetail.module.css';
import headerStyles from './ToolDetailHeader.module.css';

const ToolDetailSkeleton = () => {
    return (
        <div className={`page-wrapper ${detailStyles.toolDetailPage}`}>
            <header className={headerStyles.toolDetailHeader}>
                <div className="main-section">
                    <div className={headerStyles.toolHeaderFlex}>
                        <SkeletonLoader type="avatar" width="100px" height="100px" borderRadius="20px" />
                        <div className={headerStyles.toolHeaderInfo}>
                            <SkeletonLoader type="text" width="100px" height="20px" style={{ marginBottom: '1rem' }} />
                            <SkeletonLoader type="title" width="60%" style={{ marginBottom: '1rem' }} />
                            <SkeletonLoader type="text" width="80%" height="24px" />
                        </div>
                    </div>
                </div>
            </header>
            <section className={`main-section ${detailStyles.toolDetailMain}`}>
                <div className={detailStyles.toolGridLayout}>
                    <div>
                        <SkeletonLoader type="title" width="40%" style={{ marginBottom: '1.5rem' }} />
                        <SkeletonLoader type="text" height="100px" style={{ marginBottom: '1.5rem' }} />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.2rem' }}>
                            <SkeletonLoader height="150px" borderRadius="20px" />
                            <SkeletonLoader height="150px" borderRadius="20px" />
                        </div>
                    </div>
                    <SkeletonLoader height="400px" borderRadius="24px" />
                </div>
            </section>
        </div>
    );
};

export default ToolDetailSkeleton;
