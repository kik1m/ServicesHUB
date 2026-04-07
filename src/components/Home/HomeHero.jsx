import React from 'react';
import { Search, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UsersGroup = ({ statsCount }) => (
    <div className="users-group" style={{ display: 'flex', alignItems: 'center', marginLeft: '0.5rem' }}>
        {[
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1527980972134-d536b5951d6a?w=100&auto=format&fit=crop&q=60'
        ].map((url, i) => (
            <div key={i} className="user-avatar-mini" style={{
                width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--bg-dark)',
                background: `url(${url}) center/cover no-repeat`, marginLeft: i === 0 ? '0' : '-12px', overflow: 'hidden',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}></div>
        ))}
    </div>
);

const HomeHero = ({ searchQuery, setSearchQuery, navigate, statsCount }) => {
    return (
        <header className="hero-section-slim">
            <div className="hero-content">
                <div className="badge">Expertly Curated Tool Directory</div>
                <h1 className="hero-title-slim">
                    Get the Best Professional Tools for <span className="gradient-text">Your Projects</span>
                </h1>
                <p className="hero-subtitle-slim">
                    HUBly is your transparent window to the world&apos;s most innovative and reliable technical solutions. We save your valuable time by handpicking high-value, high-credibility tools that empower you to master new skills and scale your projects.
                </p>

                <div className="hero-search-wrapper-large glass-card">
                    <Search size={22} color="var(--primary)" />
                    <input
                        type="text"
                        placeholder="Search for tools, categories, or keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && navigate(`/search?q=${searchQuery}`)}
                    />
                    <button onClick={() => navigate(`/search?q=${searchQuery}`)} className="btn-primary">Search</button>
                </div>

                <div className="popular-tags">
                    <span>Popular:</span>
                    {['ChatGPT', 'SEO Tools', 'Logo Maker', 'Translation', 'Video AI'].map(tag => (
                        <button key={tag} onClick={() => navigate(`/search?q=${tag}`)} className="tag-link border-none bg-transparent cursor-pointer">
                            {tag}
                        </button>
                    ))}
                </div>

                <div className="hero-cta" style={{ marginTop: '2.5rem' }}>
                    <div className="user-trust">
                        <UsersGroup statsCount={statsCount} /> 
                        <span>A community of <strong>{(statsCount.users || 1200).toLocaleString()}</strong> makers worldwide</span>
                    </div>
                </div>

                <div className="trust-logos">
                    <p>Trusted by creators from</p>
                    <div className="logo-row">
                        <span className="logo-item">Product Hunt</span>
                        <span className="logo-item">Hacker News</span>
                        <span className="logo-item">Indie Hackers</span>
                        <span className="logo-item">Dev.to</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HomeHero;
