import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { LayoutGrid, ArrowRight, ArrowLeft, Upload, CheckCircle2, Globe, Send, ShieldCheck, Zap, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const SubmitTool = () => {
    const [step, setStep] = useState(1);
    const [isSuccess, setIsSuccess] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        website_url: '',
        short_description: '',
        description: '',
        category_id: '',
        pricing_type: 'Free',
        icon_name: 'Zap'
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('*');
            if (data) {
                setCategories(data);
                if (data.length > 0) setFormData(prev => ({ ...prev, category_id: data[0].id }));
            }
        };
        fetchCategories();
    }, [step]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/auth');
                return;
            }

            // Generate Slug
            const slug = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

            const { error: insertError } = await supabase
                .from('tools')
                .insert([{
                    ...formData,
                    slug,
                    user_id: user.id,
                    is_approved: false,
                    rating: 5.0,
                    reviews_count: 0
                }]);

            if (insertError) throw insertError;

            setIsSuccess(true);
            window.scrollTo(0, 0);
        } catch (err) {
            console.error('Submission error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="page-wrapper" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-card success-card" style={{ maxWidth: '600px', textAlign: 'center', padding: '4rem 3rem' }}>
                    <div className="success-icon-wrapper" style={{ 
                        width: '100px', height: '100px', background: 'rgba(0, 255, 170, 0.1)', 
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 2rem', border: '1px solid rgba(0, 255, 170, 0.2)'
                    }}>
                        <CheckCircle2 size={60} color="#00ffaa" />
                    </div>
                    <h2 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Submission <span className="gradient-text">Received!</span></h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
                        Thank you for submitting your tool. Our team will review the details and publish it in the directory within 24-48 hours.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button onClick={() => navigate('/tools')} className="btn-primary">Browse Directory</button>
                        <button onClick={() => setIsSuccess(false) || setStep(1)} className="btn-secondary">Submit Another</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper submit-tool-page">
            <header className="hero-section" style={{ minHeight: '35vh', paddingBottom: '40px' }}>
                <div className="hero-content">
                    <div className="badge">DIRECTORY GROWTH</div>
                    <h1 className="hero-title">Submit Your <span className="gradient-text">SaaS Tool</span></h1>
                    <p className="hero-subtitle">Put your product in front of thousands of founders, developers, and early adopters.</p>
                </div>
            </header>

            <section className="main-section" style={{ maxWidth: '800px' }}>
                {/* Error Alert */}
                {error && (
                    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid #ff475733', color: '#ff4757', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                {/* Progress Bar */}
                <div className="progress-container" style={{ marginBottom: '4rem' }}>
                    <div className="progress-labels" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>
                        <span style={{ color: step >= 1 ? 'var(--primary)' : '' }}>BASICS</span>
                        <span style={{ color: step >= 2 ? 'var(--primary)' : '' }}>CONTENT</span>
                        <span style={{ color: step >= 3 ? 'var(--primary)' : '' }}>PRICING</span>
                        <span style={{ color: step >= 4 ? 'var(--primary)' : '' }}>REVIEW</span>
                    </div>
                    <div className="progress-bar-bg" style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', position: 'relative' }}>
                        <div className="progress-fill" style={{ 
                            position: 'absolute', top: 0, left: 0, height: '100%', 
                            width: `${(step / 4) * 100}%`, background: 'var(--gradient)', 
                            borderRadius: '10px', transition: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 0 15px var(--primary-glow)'
                        }}></div>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '3rem' }}>
                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="step-content">
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Globe size={24} color="var(--primary)" /> Basic Information
                                </h3>
                                <div className="form-group" style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Product Name</label>
                                    <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="e.g. ServicesHUB" style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', fontSize: '1rem', outline: 'none' }} required />
                                </div>
                                <div className="form-group" style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Website URL</label>
                                    <input name="website_url" type="url" value={formData.website_url} onChange={handleChange} placeholder="https://yourtool.com" style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', fontSize: '1rem', outline: 'none' }} required />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>One-Sentence Pitch</label>
                                    <input name="short_description" type="text" value={formData.short_description} onChange={handleChange} placeholder="The ultimate directory for modern SaaS tools." style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', fontSize: '1rem', outline: 'none' }} required />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="step-content">
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <LayoutGrid size={24} color="var(--primary)" /> Content & Niche
                                </h3>
                                <div className="form-group" style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Category</label>
                                    <select name="category_id" value={formData.category_id} onChange={handleChange} style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', fontSize: '1rem', outline: 'none' }}>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Full Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} rows="5" placeholder="Describe what your tool does, its key benefits, and who it's for..." style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', fontSize: '1rem', outline: 'none', resize: 'vertical' }} required></textarea>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="step-content">
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Zap size={24} color="var(--primary)" /> Pricing Model
                                </h3>
                                <div className="form-group" style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Select Plan Type</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        {['Free', 'Freemium', 'Paid', 'Contact'].map(type => (
                                            <button 
                                                key={type}
                                                type="button" 
                                                onClick={() => setFormData(prev => ({ ...prev, pricing_type: type }))}
                                                style={{ 
                                                    padding: '1.5rem', borderRadius: '16px', 
                                                    background: formData.pricing_type === type ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
                                                    border: '1px solid var(--border)', color: 'white', cursor: 'pointer', transition: '0.3s'
                                                }}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="step-content">
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <ShieldCheck size={24} color="var(--primary)" /> Final Review
                                </h3>
                                <div className="review-box" style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                                        <div style={{ width: '50px', height: '50px', background: 'var(--gradient)', borderRadius: '12px' }}></div>
                                        <div>
                                            <h4 style={{ fontSize: '1.2rem' }}>{formData.name || 'Your SaaS Product'}</h4>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pricing: {formData.pricing_type}</p>
                                        </div>
                                    </div>
                                    <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#00ffaa" /> Detailed description added</li>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#00ffaa" /> Correct category selected</li>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#00ffaa" /> Website links verified</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                            {step > 1 ? (
                                <button type="button" onClick={prevStep} className="btn-secondary">
                                    <ArrowLeft size={18} /> Back
                                </button>
                            ) : <div></div>}
                            
                            {step < 4 ? (
                                <button type="button" onClick={nextStep} className="btn-primary">
                                    Continue <ArrowRight size={18} />
                                </button>
                            ) : (
                                <button type="submit" disabled={loading} className="btn-primary" style={{ background: 'var(--primary)', boxShadow: '0 0 20px var(--primary-glow)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                    Submit Tool
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default SubmitTool;
