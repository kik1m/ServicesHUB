import React, { useState, useEffect } from 'react';
import { Target, Zap, TrendingUp, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import SkeletonLoader from '../components/SkeletonLoader';
import CustomSelect from '../components/CustomSelect';
import { useAuth } from '../context/AuthContext';

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
            name: "Featured",
            price: "$49",
            amount: 49,
            period: "/month",
            desc: "Boost your tool for 30 days",
            features: ["Homepage Featured slot (30 days)", "Highlight in Category", "Newsletter mention", "Social media post", "Verified Badge"],
            recommended: true,
            cta: "Get Featured"
        },
        {
            name: "Enterprise",
            price: "$149",
            amount: 149,
            period: "/month",
            desc: "Maximum visibility for your tool",
            features: ["Permanent Featured status (Monthly)", "Direct Backlink (SEO)", "Dedicated Blog Article", "Custom Banner Ads", "Priority review for this tool"],
            recommended: false,
            cta: "Upgrade Tool"
        }
    ];

    useEffect(() => {
        const initializePromote = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/auth');
                return;
            }

            if (toolId) {
                const { data } = await supabase.from('tools').select('name').eq('id', toolId).single();
                if (data) {
                    setToolName(data.name);
                    setSelectedToolId(toolId);
                }
            } else {
                // Fetch user's approved tools to let them pick
                setLoadingTools(true);
                const { data } = await supabase
                    .from('tools')
                    .select('id, name')
                    .eq('user_id', user.id)
                    .eq('is_approved', true);
                
                setUserTools(data || []);
                setLoadingTools(false);
            }
        };
        
        initializePromote();
    }, [toolId, navigate]);

    const handlePromote = async (plan) => {
        if (!selectedToolId) {
            showToast('Please select a tool to promote first.', 'info');
            return;
        }

        setLoadingPlan(plan.name);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/auth');
                return;
            }

            // Use relative path for Stripe API to work in both Local and Production
            const { data } = await axios.post(`/api/create-checkout-session`, {
                userId: user.id,
                toolId: selectedToolId,
                toolName: toolName,
                planName: plan.name,
                priceAmount: plan.amount,
                itemType: 'tool_promotion'
            });

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error('Promotion session error:', err);
            showToast('Failed to initiate checkout. Please try again.', 'error');
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="page-wrapper promote-page">
            <header className="page-header hero-section" style={{ minHeight: '40vh', paddingBottom: '30px' }}>
                <div className="hero-content">
                    <div className="badge">PARTNERSHIPS & ADS</div>
                    <h1 className="hero-title">
                        {toolName ? <>Promote <span className="gradient-text">{toolName}</span></> : <>Put Your Tool in Front of <span className="gradient-text">Thousands</span></>}
                    </h1>
                    <p className="hero-subtitle">The fastest way to get your SaaS discovered by founders, developers, and tech enthusiasts.</p>
                </div>
            </header>

            <section className="main-section">
                {/* Tool Selection Section */}
                <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem', border: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem' }}>
                        {toolName ? "Target Tool" : "1. Select a Tool to Promote"}
                    </h2>
                    
                    {toolName ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: '700', fontSize: '1.2rem' }}>
                                <Zap size={24} /> {toolName}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                Promoting this specific tool only
                            </div>
                        </div>
                    ) : (
                        <div style={{ maxWidth: '400px' }}>
                            {loadingTools ? (
                                <SkeletonLoader height="50px" width="100%" borderRadius="12px" />
                            ) : userTools.length > 0 ? (
                                <CustomSelect 
                                    options={userTools}
                                    value={selectedToolId}
                                    onChange={(val) => setSelectedToolId(val)}
                                    placeholder="-- Choose one of your tools --"
                                    icon={Zap}
                                    style={{ marginBottom: '0' }}
                                />
                            ) : (
                                <p style={{ color: '#ff4757', fontSize: '0.9rem' }}>
                                    You don't have any approved tools yet. <Link to="/submit" style={{ color: 'var(--primary)' }}>Submit a tool first</Link>.
                                </p>
                            )}
                        </div>
                    )}
                </div>
                
                <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '2rem' }}>2. Choose a Promotion Plan</h2>
                <div className="pricing-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                    gap: '2rem',
                    alignItems: 'center'
                }}>
                    {plans.map((plan, idx) => (
                        <div key={idx} className={`pricing-card glass-card ${plan.recommended ? 'premium-glow' : ''}`} style={{ 
                            padding: '3.5rem 2.5rem',
                            position: 'relative',
                            border: plan.recommended ? '2px solid var(--primary)' : '1px solid var(--border)',
                            background: plan.recommended ? 'rgba(0,136,204,0.05)' : 'rgba(255,255,255,0.02)',
                            transform: plan.recommended ? 'scale(1.05)' : 'scale(1)',
                            zIndex: plan.recommended ? 2 : 1
                        }}>
                            {plan.recommended && (
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '-15px', 
                                    left: '50%', 
                                    transform: 'translateX(-50%)',
                                    background: 'var(--gradient)',
                                    color: 'white',
                                    padding: '5px 20px',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    fontWeight: '800'
                                }}>MOST POPULAR</div>
                            )}
                            
                            <h4 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{plan.name}</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>{plan.desc}</p>
                            
                            <div className="price" style={{ marginBottom: '2.5rem' }}>
                                <span style={{ fontSize: '3.5rem', fontWeight: '900' }}>{plan.price}</span>
                                {plan.period && <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>{plan.period}</span>}
                            </div>

                            <div className="features-list" style={{ marginBottom: '3rem' }}>
                                {plan.features.map((feat, fIdx) => (
                                    <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)' }}>
                                        <CheckCircle2 size={18} color="var(--primary)" /> {feat}
                                    </div>
                                ))}
                            </div>

                            {plan.amount > 0 ? (
                                <button 
                                    onClick={() => handlePromote(plan)} 
                                    disabled={loadingPlan === plan.name || !selectedToolId}
                                    className={plan.recommended ? "btn-primary" : "btn-secondary"} 
                                    style={{ width: '100%', display: 'flex', justifyContent: 'center', cursor: selectedToolId ? 'pointer' : 'not-allowed', opacity: selectedToolId ? 1 : 0.5 }}
                                >
                                    {loadingPlan === plan.name ? <Loader2 className="animate-spin" size={20} /> : <>{plan.cta} <ArrowRight size={18} style={{ marginLeft: '10px' }} /></>}
                                </button>
                            ) : (
                                <Link 
                                    to="/submit" 
                                    className={plan.recommended ? "btn-primary" : "btn-secondary"} 
                                    style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                                >
                                    {plan.cta} <ArrowRight size={18} style={{ marginLeft: '10px' }} />
                                </Link>
                            )}
                        </div>
                    ))}
                </div>

                {/* Final Trust Section */}
                <div style={{ textAlign: 'center', marginTop: '8rem', padding: '4rem', background: 'rgba(0,0,0,0.2)', borderRadius: '40px', border: '1px solid var(--border)' }}>
                     <ShieldCheck size={48} color="var(--primary)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                     <h2 style={{ marginBottom: '1.5rem' }}>Ready to Scale Your SaaS?</h2>
                     <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                        Join over 500+ founders who have grown their user base through ServicesHUB. 
                        Our team is dedicated to professional, ethical, and high-impact tool promotion.
                     </p>
                     <Link to="/contact" className="btn-primary" style={{ padding: '15px 40px' }}>Schedule a Consultation</Link>
                </div>
            </section>
        </div>
    );
};

export default Promote;
