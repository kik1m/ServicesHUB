import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import ToolCard from '../ToolCard';
import SkeletonLoader from '../SkeletonLoader';

const ProfileCollections = ({ loadingFavorites, favorites }) => {
    return (
        <div className="profile-tools-grid fade-in">
            {loadingFavorites ? (
                [1, 2, 3].map(i => <SkeletonLoader key={i} height="240px" borderRadius="16px" />)
            ) : favorites.length > 0 ? (
                favorites.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                ))
            ) : (
                <div className="glass-card empty-state-card">
                    <Heart size={64} className="empty-state-icon" />
                    <h4 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '10px', color: 'white' }}>Your collection is empty</h4>
                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>Discover amazing AI tools and save them to your profile to build your personal toolkit.</p>
                    <Link to="/tools" className="btn-primary" style={{ marginTop: '2.5rem', display: 'inline-flex', padding: '14px 32px', textDecoration: 'none', borderRadius: '14px' }}>Explore Directory</Link>
                </div>
            )}
        </div>
    );
};

export default ProfileCollections;
