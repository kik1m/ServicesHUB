import React, { useState, useEffect } from 'react';
import { 
    Target, Shield, CheckCircle2, Users, Zap, 
    Search, Heart, Rocket, Award, Globe
} from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';
import Breadcrumbs from '../components/Breadcrumbs';

const About = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    const stats = [
        { icon: <Zap size={20} />, label: 'AI ToolsVetted', value: '2,500+' },
        { icon: <Users size={20} />, label: 'Active Innovators', value: '50k+' },
        { icon: <Globe size={20} />, label: 'Monthly Reach', value: '1.2M+' },
        { icon: <Award size={20} />, label: 'Market Trust', value: '98%' },
    ];

    if (loading) {
        return (
            <div className="about-view-wrapper" style={{ padding: '120px 5% 60px' }}>
                <div className="container" style={{ maxWidth: '1100px' }}>
                    <SkeletonLoader height="400px" borderRadius="32px" />
                </div>
            </div>
        );
    }

    return (
        <div className="about-view-wrapper" style={{ padding: '80px 5% 60px' }}>
            <div className="container" style={{ maxWidth: '1100px' }}>
                <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'About Us' }]} />

                {/* Hero Section - unique classes to avoid global CSS leaks */}
                <header className="about-custom-header" style={{ textAlign: 'center', marginBottom: '5rem', marginTop: '2rem' }}>
                    <div className="about-badge">OUR STORY</div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1.5rem', lineHeight: '1.1' }}>
                        Beyond Just a <span className="gradient-text">Directory</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
                        We build the bridge between human creativity and the world's most advanced artificial intelligence tools.
                    </p>
                </header>

                {/* Growth Stats Row */}
                <div className="about-stats-grid" style={{ 
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '1.5rem', marginBottom: '5rem' 
                }}>
                    {stats.map((stat, i) => (
                        <div key={i} className="glass-card stat-card-slim" style={{ 
                            padding: '2rem', textAlign: 'center', backdropFilter: 'blur(15px)',
                            border: '1px solid var(--border)', borderRadius: '24px'
                        }}>
                            <div style={{ color: 'var(--primary)', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                                {stat.icon}
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '4px' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Main Content Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'start', marginBottom: '5rem' }}>
                    <div className="glass-card" style={{ padding: '3.5rem', borderRadius: '32px', backdropFilter: 'blur(20px)' }}>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '1.5rem' }}>Our Mission</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>
                            In an era where thousands of AI tools are released weekly, finding the right one is overwhelming. 
                            ServicesHUB was born to solve this. We meticulously curate, test, and categorize 
                            the world's most innovative software to ensure you spend less time searching 
                            and more time building.
                        </p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {[
                                'Human-Vetted Content', 'Daily Tool Updates', 
                                'Creator Growth Tools', 'Transparent Reviews'
                            ].map((point, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <CheckCircle2 size={18} color="var(--primary)" />
                                    <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>{point}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px' }}>
                            <div className="about-icon-box"><Target size={22} color="var(--secondary)" /></div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>The Vision</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                To create the most trusted authority for software discovery in the AI era.
                            </p>
                        </div>
                        <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px' }}>
                            <div className="about-icon-box"><Shield size={22} color="var(--primary)" /></div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>The Trust</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                We partner with vetted creators to ensure every tool provides real value.
                            </p>
                        </div>
                        <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px', background: 'var(--gradient)', color: 'white' }}>
                            <Rocket size={24} style={{ marginBottom: '1rem' }} />
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>Join the Journey</h3>
                            <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '1.5rem' }}>
                                Be part of the fastest growing AI community.
                            </p>
                            <a href="/auth" style={{ 
                                display: 'inline-block', padding: '10px 20px', background: 'white', 
                                color: 'var(--bg-dark)', borderRadius: '12px', fontWeight: '800', 
                                fontSize: '0.85rem', textDecoration: 'none' 
                            }}>Get Started</a>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .about-view-wrapper {
                    min-height: 100vh;
                }
                .about-badge {
                    display: inline-block;
                    padding: 6px 16px;
                    background: rgba(0, 210, 255, 0.1);
                    color: var(--primary);
                    border-radius: 100px;
                    font-size: 0.75rem;
                    font-weight: 800;
                    letter-spacing: 2px;
                    margin-bottom: 1.5rem;
                    border: 1px solid rgba(0, 210, 255, 0.2);
                }
                .about-icon-box {
                    width: 44px;
                    height: 44px;
                    background: rgba(255,255,255,0.03);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1.2rem;
                    border: 1px solid var(--border);
                }
                .stat-card-slim:hover {
                    border-color: var(--primary) !important;
                    transform: translateY(-5px);
                }
            `}} />
        </div>
    );
};

export default About;
