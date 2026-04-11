import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import ToolCard from '../ToolCard';
import ToolCardSkeleton from '../Tools/ToolCardSkeleton';
import SkeletonLoader from '../SkeletonLoader';
import styles from './ProfileCollections.module.css';

const ProfileCollections = ({ loadingFavorites, favorites }) => {
    return (
        <div className={`${styles.toolsGrid} fade-in`}>
            {loadingFavorites ? (
                [1, 2, 3].map(i => <ToolCardSkeleton key={i} />)
            ) : favorites.length > 0 ? (
                favorites.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                ))
            ) : (
                <div className={`glass-card ${styles.emptyStateCard}`}>
                    <Heart size={64} className={styles.emptyStateIcon} />
                    <h4 className={styles.emptyStateTitle}>Your collection is empty</h4>
                    <p className={styles.emptyStateText}>
                        Discover amazing AI tools and save them to your profile to build your personal toolkit.
                    </p>
                    <Link to="/tools" className={`btn-primary ${styles.exploreBtn}`}>
                        Explore Directory
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ProfileCollections;
