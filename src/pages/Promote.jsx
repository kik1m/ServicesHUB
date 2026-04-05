import React, { useState, useEffect } from 'react';
import { 
    Zap, CheckCircle2, ShieldCheck, ArrowRight, Loader2,
    Rocket, Star, Globe, TrendingUp, HelpCircle, Layout
} from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import SkeletonLoader from '../components/SkeletonLoader';
import CustomSelect from '../components/CustomSelect';
import { useAuth } from '../context/AuthContext';
import Breadcrumbs from '../components/Breadcrumbs';

const Promote = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate('/auth');
        }
    }, [user, authLoading, navigate]);

    const toolId = searchParams.get('toolId');
    const [toolName, setToolName] = useState('');
    const [userTools, setUserTools] = useState([]);
    const [selectedToolId, setSelectedToolId] = useState(toolId || '');
    const [loadingPlan, setLoadingPlan] = useState(null);
    const [loadingTools, setLoadingTools] = useState(false);

    const plans = [
        {
            id: 'featured',
            name: "Featured",
            price: "$49",
            amount: 49,
            period: "/mo",
            desc: "Dominant homepage presence for 30 days.",
            features: ["Homepage Hero slot (30 days)", "Priority Category Ranking", "Newsletter Spotlight", "Social Media Shoutout", "Verified Tool Badge"],
            recommended: true,
            theme: "#00d2ff",
            glow: "rgba(0, 210, 255, 0.3)",
            cta: "Get Featured"
        },
        {
            id: 'enterprise',
            name: "Market Authority",
            price: "$149",
            amount: 149,
            period: "/mo",
            desc: "Ultimate visibility & SEO power.",
            features: ["Permanent Featured Status", "Do-Follow Backlink (SEO)", "Dedicated Review Article", "Side-wide Banner Ads", "Priority Review Sync"],
            recommended: false,
            theme: "#bf5af2",
            glow: "rgba(191, 90, 242, 0.3)",
            cta: "Go Enterprise"
        }
    ];

    useEffect(() => {
        const initializePromote = async () => {
            if (authLoading) return;
            if (!user) return;

            if (toolId) {
                const { data } = await supabase.from('tools').select('name').eq('id', toolId).single();
                if (data) {
                    setToolName(data.name);
                    setSelectedToolId(toolId);
                }
            } else {
                setLoadingTools(true);
                try {
                    const { data } = await supabase
                        .from('tools')
                        .select('id, name')
                        .eq('user_id', user.id)
                        .eq('is_approved', true);

                    setUserTools(data || []);
                } catch (err) {
                    console.error('Fetch user tools error:', err);
                } finally {
                    setLoadingTools(false);
                }
            }
        };

        initializePromote();
    }, [toolId, user, authLoading]);

    const handlePromote = async (plan) => {
        if (!selectedToolId) {
            showToast('Please select a tool to promote first.', 'warning');
            return;
        }

        setLoadingPlan(plan.name);
        try {
            const { data } = await axios.post(`/api/create-checkout-session`, {
                userId: user.id,
                toolId: selectedToolId,
                toolName: toolName || userTools.find(t => t.id === selectedToolId)?.name,
                planName: plan.name,
                priceAmount: plan.amount,
                itemType: 'tool_promotion'
            });

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error('Promotion error:', err);
            showToast('Failed to initiate checkout.', 'error');
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="promote-view-container" style={{ padding: '60px 5% 100px' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Promote Tool' }]} />

                {/* Hero Section */}
                <header className="promote-header-slim" style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
                    <div className="promote-status-badge">ADVERTISING & GROWTH</div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem' }}>
                        Scale Your <span className="blue-purple-gradient">Visibility</span>
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        Reach thousands of AI enthusiasts, developers, and founders every day. Choose the boost your tool deserves.
                    </p>
                </header>

                {/* Step 1: Tool Selection */}
                <section className="promote-step-card" style={{ marginBottom: '3.5rem' }}>
                    <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-12px', left: '20px', background: 'var(--primary)', color: 'white', padding: '2px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800' }}>
                            STEP 1
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '5px' }}>
                                    {toolName ? "Selected Tool" : "Pick Your Tool"}
                                </h2>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Choose the approved tool you want to promote.</p>
                            </div>

                            <div style={{ flex: '1', maxWidth: '400px', minWidth: '280px' }}>
                                {toolName ? (
                                    <div style={{ 
                                        padding: '12px 20px', background: 'rgba(var(--primary-rgb), 0.1)', 
                                        borderRadius: '12px', border: '1px solid var(--primary)',
                                        display: 'flex', alignItems: 'center', gap: '10px', color: 'white', fontWeight: '700'
                                    }}>
                                        <Zap size={18} className="text-primary" /> {toolName}
                                    </div>
                                ) : (
                                    loadingTools ? (
                                        <SkeletonLoader height="48px" width="100%" borderRadius="12px" />
                                    ) : userTools.length > 0 ? (
                                        <CustomSelect
                                            options={userTools}
                                            value={selectedToolId}
                                            onChange={(val) => setSelectedToolId(val)}
                                            placeholder="Choose tool..."
                                            icon={Layout}
                                            style={{ marginBottom: '0' }}
                                        />
                                    ) : (
                                        <Link to="/submit" style={{ color: '#ff4757', fontSize: '0.9rem', fontWeight: '700' }}>
                                            No approved tools yet. Click to submit one &rarr;
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step 2: Plans */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                        <div style={{ background: 'var(--primary)', color: 'white', padding: '2px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '900' }}>STEP 2</div>
                        <h3 style={{ fontWeight: '800' }}>Choose Promotion Level</h3>
                    </div>

                    <div className="promote-plans-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '2rem'
                    }}>
                        {plans.map((plan) => (
                            <div key={plan.id} className="promote-plan-card" style={{
                                position: 'relative',
                                padding: '2.5rem 2rem',
                                borderRadius: '30px',
                                background: 'rgba(255,255,255,0.02)',
                                border: `1px solid rgba(255,255,255,0.1)`,
                                transition: 'all 0.3s ease',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                {/* Background Glow */}
                                <div className="plan-glow-overlay" style={{
                                    position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
                                    background: `radial-gradient(circle at 50% 50%, ${plan.glow} 0%, transparent 50%)`,
                                    opacity: 0.2, zIndex: -1
                                }}></div>

                                {plan.recommended && (
                                    <div style={{
                                        position: 'absolute', top: '15px', right: '20px',
                                        background: plan.theme, color: 'black', padding: '4px 12px',
                                        borderRadius: '100px', fontSize: '0.7rem', fontWeight: '900'
                                    }}>MOST POPULAR</div>
                                )}

                                <div style={{ marginBottom: '2rem' }}>
                                    <h4 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'white', marginBottom: '8px' }}>{plan.name}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.4' }}>{plan.desc}</p>
                                </div>

                                <div style={{ marginBottom: '2.5rem' }}>
                                    <span style={{ fontSize: '3.5rem', fontWeight: '1000', color: 'white' }}>{plan.price}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '700' }}>{plan.period}</span>
                                </div>

                                <div style={{ flex: '1', marginBottom: '3rem' }}>
                                    {plan.features.map((f, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>
                                            <CheckCircle2 size={16} style={{ color: plan.theme, flexShrink: 0, marginTop: '2px' }} />
                                            {f}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePromote(plan)}
                                    disabled={loadingPlan === plan.name || !selectedToolId}
                                    style={{
                                        width: '100%', padding: '16px', borderRadius: '15px',
                                        background: plan.theme, color: 'black', border: 'none',
                                        fontWeight: '900', fontSize: '1rem', cursor: selectedToolId ? 'pointer' : 'not-allowed',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                        opacity: selectedToolId ? 1 : 0.4,
                                        boxShadow: `0 10px 25px ${plan.glow}`
                                    }}
                                >
                                    {loadingPlan === plan.name ? <Loader2 className="animate-spin" /> : <>{plan.cta} <ArrowRight size={18} /></>}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Compact Trust Footer */}
                <footer style={{ 
                    marginTop: '8rem', padding: '3rem', borderRadius: '35px', 
                    background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)',
                    textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>
                    <ShieldCheck size={40} className="text-primary" style={{ marginBottom: '1.5rem', opacity: 0.6 }} />
                    <h3 style={{ marginBottom: '1rem', fontWeight: '800' }}>Secure Global Promotion</h3>
                    <p style={{ maxWidth: '600px', fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                        Trusted by 500+ SaaS founders. Our payment processing is handled securely via <strong>Lemon Squeezy</strong>.
                    </p>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {[
                            { label: 'Lemon Squeezy', icon: <CheckCircle2 size={14} /> },
                            { label: 'Instant Activation', icon: <TrendingUp size={14} /> },
                            { label: 'Analytics Included', icon: <Star size={14} /> }
                        ].map((tag, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                <span style={{ color: 'var(--primary)' }}>{tag.icon}</span> {tag.label}
                            </div>
                        ))}
                    </div>
                </footer>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .promote-status-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    background: rgba(var(--primary-rgb), 0.1);
                    color: var(--primary);
                    border-radius: 100px;
                    font-size: 0.7rem;
                    font-weight: 800;
                    letter-spacing: 1.5px;
                    margin-bottom: 1rem;
                    border: 1px solid rgba(var(--primary-rgb), 0.2);
                }
                .blue-purple-gradient {
                    background: linear-gradient(90deg, #00d2ff 0%, #bf5af2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .promote-plan-card:hover {
                    transform: translateY(-8px);
                    border-color: rgba(255,255,255,0.2);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                }
                @media (max-width: 768px) {
                    .promote-header-slim h1 { font-size: 2.2rem !important; }
                    .promote-step-card .glass-card { padding: 1.5rem !important; }
                }
            `}} />
        </div>
    );
};

export default Promote;
