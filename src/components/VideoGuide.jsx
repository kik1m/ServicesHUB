import React, { useState } from 'react';
import { Play, Info, CheckCircle2, Star, ShieldCheck, Zap } from 'lucide-react';

const VideoGuide = () => {
    const [activeTab, setActiveTab] = useState('seeker');

    const content = {
        seeker: {
            title: "For Tool Seekers",
            subtitle: "Find the perfect AI tool for your workflow in seconds.",
            videoId: "dQw4w9WgXcQ", // Placeholder
            features: [
                "Advanced filtering by category & price",
                "Real-user reviews and ratings",
                "Side-by-side tool comparisons",
                "Daily updates on new AI releases"
            ]
        },
        publisher: {
            title: "For Tool Publishers",
            subtitle: "Get your SaaS in front of thousands of potential users.",
            videoId: "dQw4w9WgXcQ", // Placeholder
            features: [
                "High-conversion tool landing pages",
                "Featured slots for maximum visibility",
                "Verified badges for ultimate trust",
                "Analytics to track your tool growth"
            ]
        }
    };

    const current = content[activeTab];

    return (
        <section className="video-guide-section main-section">
            <div className="section-header-centered">
                <div className="badge">LEARN & GROW</div>
                <h2 className="section-title">Master <span className="gradient-text">ServicesHUB</span></h2>
                <p className="section-desc">Choose your journey and unlock the power of professional AI discovery.</p>
            </div>

            <div className="guide-tabs">
                <button 
                    className={`guide-tab ${activeTab === 'seeker' ? 'active' : ''}`}
                    onClick={() => setActiveTab('seeker')}
                >
                    <Zap size={20} /> For Tool Seekers
                </button>
                <button 
                    className={`guide-tab ${activeTab === 'publisher' ? 'active' : ''}`}
                    onClick={() => setActiveTab('publisher')}
                >
                    <Star size={20} /> For Tool Publishers
                </button>
            </div>

            <div className="guide-container glass-card">
                <div className="guide-info">
                    <h3>{current.title}</h3>
                    <p>{current.subtitle}</p>
                    <ul className="guide-features">
                        {current.features.map((feat, idx) => (
                            <li key={idx}>
                                <CheckCircle2 size={18} color="var(--primary)" /> {feat}
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="guide-video-wrapper">
                    <iframe 
                        src={`https://www.youtube.com/embed/${current.videoId}`}
                        title="ServicesHUB Guide"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .section-header-centered {
                    text-align: center;
                    margin-bottom: 4rem;
                }
                .guide-tabs {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                .guide-tab {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border);
                    padding: 12px 24px;
                    border-radius: 100px;
                    color: var(--text-muted);
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: 0.3s;
                }
                .guide-tab.active {
                    background: var(--gradient);
                    color: white;
                    border-color: transparent;
                    box-shadow: 0 10px 20px rgba(0, 136, 204, 0.3);
                }
                .guide-container {
                    display: grid;
                    grid-template-columns: 1fr 1.5fr;
                    gap: 4rem;
                    padding: 3rem !important;
                    align-items: center;
                }
                .guide-info h3 {
                    font-size: 2rem;
                    font-weight: 900;
                    margin-bottom: 1rem;
                    color: white;
                }
                .guide-info p {
                    color: var(--text-muted);
                    font-size: 1.1rem;
                    margin-bottom: 2rem;
                }
                .guide-features {
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .guide-features li {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 500;
                    color: rgba(255,255,255,0.8);
                }
                .guide-video-wrapper {
                    border-radius: 20px;
                    overflow: hidden;
                    aspect-ratio: 16/9;
                    border: 1px solid var(--border);
                    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                }
                .guide-video-wrapper iframe {
                    width: 100%;
                    height: 100%;
                }
                @media (max-width: 1024px) {
                    .guide-container { grid-template-columns: 1fr; gap: 3rem; }
                }
            ` }} />
        </section>
    );
};

export default VideoGuide;
