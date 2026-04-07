import React from 'react';
import SkeletonLoader from '../SkeletonLoader';

const ToolDetailSkeleton = () => {
    return (
        <div className="page-wrapper tool-detail-page">
            <header className="tool-detail-header" style={{ paddingTop: '30px', paddingBottom: '60px', borderBottom: '1px solid var(--border)' }}>
                <div className="main-section">
                    <div className="tool-header-flex">
                        <SkeletonLoader type="avatar" width="140px" height="140px" borderRadius="24px" />
                        <div style={{ flex: 1 }}>
                            <SkeletonLoader type="text" width="100px" height="20px" style={{ marginBottom: '1rem' }} />
                            <SkeletonLoader type="title" width="60%" style={{ marginBottom: '1rem' }} />
                            <SkeletonLoader type="text" width="80%" height="24px" />
                        </div>
                    </div>
                </div>
            </header>
            <section className="main-section tool-detail-main">
                <div className="tool-grid-layout">
                    <div>
                        <SkeletonLoader type="title" width="40%" style={{ marginBottom: '1.5rem' }} />
                        <SkeletonLoader type="text" height="100px" style={{ marginBottom: '1.5rem' }} />
                        <div className="features-checklist">
                            <SkeletonLoader height="150px" />
                            <SkeletonLoader height="150px" />
                        </div>
                    </div>
                    <SkeletonLoader height="400px" borderRadius="24px" />
                </div>
            </section>
        </div>
    );
};

export default ToolDetailSkeleton;
