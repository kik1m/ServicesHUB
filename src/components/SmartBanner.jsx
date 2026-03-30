import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Zap, ChevronLeft, ChevronRight, Eye, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const SmartBanner = () => {
    const [tools, setTools] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTools = async () => {
            try {
                const now = new Date().toISOString();
                const { data: featuredData } = await supabase
                    .from('tools')
                    .select('id, name, short_description, image_url, url, slug, is_verified')
                    .eq('is_featured', true)
                    .gt('featured_until', now)
                    .limit(5);
                
                if (featuredData && featuredData.length > 0) {
                    setTools(featuredData);
                } else {
                    // 2. Fallback: Fetch latest approved tools
                    const { data: latestData } = await supabase
                        .from('tools')
                        .select('id, name, short_description, image_url, url, slug, is_verified')
                        .eq('is_approved', true)
                        .order('created_at', { ascending: false })
                        .limit(5);
                    
                    setTools(latestData || []);
                }
            } catch (error) {
                console.error('Banner Fetch Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTools();
    }, []);

    useEffect(() => {
        if (tools.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % tools.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [tools]);

    if (loading || tools.length === 0) return null;

    const currentTool = tools[currentIndex];

    return (
        <div className="smart-banner-new">
            <div className="banner-inner">
                {/* Visual Section */}
                <div className="banner-visual">
                    <img src={currentTool.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop'} alt={currentTool.name} className="banner-img" />
                    <div className="img-overlay"></div>
                </div>

                {/* Content Section */}
                <div className="banner-details">
                    <div className="banner-top-meta">
                        <span className="featured-badge">
                            <Sparkles size={14} /> NEW & FEATURED
                        </span>
                        <div className="banner-nav-minimal">
                             <button onClick={() => setCurrentIndex((prev) => (prev - 1 + tools.length) % tools.length)} className="nav-btn-min">
                                <ChevronLeft size={16} />
                            </button>
                            <span className="count-label">{currentIndex + 1} / {tools.length}</span>
                             <button onClick={() => setCurrentIndex((prev) => (prev + 1) % tools.length)} className="nav-btn-min">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="banner-text-content">
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {currentTool.name}
                            {currentTool.is_verified && <CheckCircle2 size={24} color="#00d2ff" fill="rgba(0,210,255,0.1)" />}
                        </h2>
                        <p>{currentTool.short_description}</p>
                    </div>

                    <div className="banner-cta-group">
                        <Link to={`/tool/${currentTool.slug || currentTool.id}`} className="banner-cta detail">
                            <Eye size={18} /> View Details
                        </Link>
                        <a href={currentTool.url} target="_blank" rel="noopener noreferrer" className="banner-cta visit">
                            Visit Website <ExternalLink size={18} />
                        </a>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .smart-banner-new {
                    width: 100%;
                    background: rgba(7, 7, 9, 0.4);
                    border-bottom: 1px solid var(--border);
                    backdrop-filter: blur(20px);
                    position: relative;
                    z-index: 900;
                    overflow: hidden;
                }
                .banner-inner {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 450px 1fr;
                    min-height: 280px;
                    padding: 0;
                }
                .banner-visual {
                    position: relative;
                    height: 100%;
                    overflow: hidden;
                }
                .banner-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 10s linear;
                }
                .smart-banner-new:hover .banner-img {
                    transform: scale(1.1);
                }
                .img-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, transparent 50%, rgba(7, 7, 9, 1) 100%);
                }
                .banner-details {
                    padding: 40px 60px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 1.5rem;
                }
                .banner-top-meta {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .featured-badge {
                    background: rgba(var(--primary-rgb), 0.15);
                    border: 1px solid rgba(var(--primary-rgb), 0.3);
                    color: var(--primary);
                    padding: 6px 16px;
                    border-radius: 100px;
                    font-size: 0.75rem;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    letter-spacing: 1px;
                }
                .banner-nav-minimal {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(255,255,255,0.05);
                    padding: 4px 12px;
                    border-radius: 100px;
                }
                .nav-btn-min {
                    background: transparent;
                    border: none;
                    color: white;
                    cursor: pointer;
                    opacity: 0.6;
                    transition: 0.3s;
                    display: flex;
                    align-items: center;
                }
                .nav-btn-min:hover { opacity: 1; color: var(--primary); }
                .count-label { font-size: 0.75rem; font-weight: 700; opacity: 0.5; font-family: monospace; }
                
                .banner-text-content h2 {
                    font-size: 2.2rem;
                    font-weight: 900;
                    margin-bottom: 0.5rem;
                    background: linear-gradient(to right, #fff, rgba(255,255,255,0.7));
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .banner-text-content p {
                    font-size: 1.05rem;
                    color: var(--text-muted);
                    max-width: 700px;
                    line-height: 1.5;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .banner-cta-group {
                    display: flex;
                    gap: 15px;
                }
                .banner-cta {
                    padding: 12px 28px;
                    border-radius: 14px;
                    font-size: 0.95rem;
                    font-weight: 800;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.3s;
                }
                .banner-cta.visit {
                    background: var(--gradient);
                    color: white;
                    box-shadow: 0 4px 20px var(--primary-glow);
                }
                .banner-cta.detail {
                    background: rgba(255,255,255,0.05);
                    color: white;
                    border: 1px solid var(--border);
                }
                .banner-cta:hover { transform: translateY(-3px); filter: brightness(1.1); }

                @media (max-width: 1024px) {
                    .banner-inner { grid-template-columns: 1fr; }
                    .banner-visual { height: 200px; }
                    .img-overlay {
                        background: linear-gradient(0deg, rgba(7, 7, 9, 1) 0%, transparent 100%);
                    }
                    .banner-details { padding: 30px; }
                    .banner-text-content h2 { font-size: 1.8rem; }
                }

                @media (max-width: 480px) {
                    .banner-cta-group { flex-direction: column; }
                    .banner-text-content p { font-size: 0.95rem; }
                }
            ` }} />
        </div>
    );
};

export default SmartBanner;
