import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
    LayoutGrid, ArrowLeft, CheckCircle2, 
    Globe, Send, ShieldCheck, Zap, Loader2, AlertCircle, 
    Image as ImageIcon, Star, Award, Upload, Info, Type, AlignLeft
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SkeletonLoader from '../components/SkeletonLoader';
import CustomSelect from '../components/CustomSelect';
import { useToast } from '../context/ToastContext';
import { sendNotification } from '../utils/notifications';
import Breadcrumbs from '../components/Breadcrumbs';

const SubmitTool = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    
    // States
    const [isSuccess, setIsSuccess] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [toolCount, setToolCount] = useState(0);
    const [isLimitReached, setIsLimitReached] = useState(false);
    const [useManualUrl, setUseManualUrl] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const [formData, setFormData] = useState({
        name: '',
        url: '',
        short_description: '',
        description: '',
        category_id: '',
        pricing_type: 'Free',
        pricing_details: '',
        image_url: '',
        features: []
    });

    useEffect(() => {
        const checkLimitAndFetch = async () => {
            if (authLoading) return;
            if (!user) {
                navigate('/auth');
                return;
            }

            setIsLoading(true);
            try {
                // Fetch Categories
                const { data: catData } = await supabase.from('categories').select('*').order('name');
                setCategories(catData || []);
                if (catData?.length > 0) {
                    setFormData(prev => ({ ...prev, category_id: catData[0].id }));
                }

                // Check Subscription Limit
                const { data: profile } = await supabase.from('profiles').select('is_premium').eq('id', user.id).single();
                const { count } = await supabase.from('tools').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
                
                setToolCount(count || 0);
                if ((count || 0) >= 2 && !profile?.is_premium) {
                    setIsLimitReached(true);
                }
            } catch (err) {
                console.error('Initial Fetch Error:', err);
            } finally {
                setIsLoading(false);
            }
        };
        checkLimitAndFetch();
    }, [user, authLoading, navigate]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            showToast('File too large (Max 2MB)', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
            const filePath = `tool-thumbnails/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('tool-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('tool-images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
            showToast('Image uploaded successfully!', 'success');
        } catch (err) {
            console.error('Upload error:', err);
            showToast('Failed to upload image', 'error');
        } finally {
            setUploading(false);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name || formData.name.length < 2) errors.name = "Name is too short";
        if (!formData.url) errors.url = "Website URL is required";
        if (!formData.short_description || formData.short_description.length < 10) errors.short_description = "Min 10 characters";
        if (!formData.description || formData.description.length < 50) errors.description = "Min 50 characters";
        if (!formData.category_id) errors.category_id = "Category required";
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLimitReached) {
            showToast('Submission limit reached. Upgrade to Premium!', 'warning');
            return;
        }
        if (!validateForm()) {
            showToast('Please fix errors in the form.', 'error');
            return;
        }

        setLoading(true);
        try {
            const slug = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const { error: submitError } = await supabase
                .from('tools')
                .insert([{
                    ...formData,
                    slug,
                    user_id: user.id,
                    is_approved: false,
                    rating: 5.0,
                    reviews_count: 0,
                    view_count: 0,
                    created_at: new Date().toISOString()
                }]);

            if (submitError) throw submitError;

            await sendNotification(
                user.id, 
                'Submission Received', 
                `Your request to add "${formData.name}" has been successfully received. All new tools undergo a detailed review process to ensure quality. You will receive a notification once the review is complete (typically within 24-48 hours).`, 
                'info'
            );
            setIsSuccess(true);
            window.scrollTo(0, 0);
        } catch (err) {
            console.error('Submit error:', err);
            showToast(`Error: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) return (
        <div className="slim-edit-container" style={{ padding: '120px 5% 60px', textAlign: 'center' }}>
            <Loader2 className="animate-spin text-primary" size={40} style={{ margin: '0 auto' }} />
        </div>
    );

    if (isSuccess) return (
        <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5%' }}>
            <div className="glass-card-slim" style={{ maxWidth: '600px', textAlign: 'center', padding: '4rem 3rem', borderRadius: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '100px', height: '100px', background: 'rgba(0, 255, 170, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '1px solid rgba(0, 255, 170, 0.2)' }}>
                    <CheckCircle2 size={60} color="#00ffaa" />
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', marginBottom: '1rem' }}>Success!</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
                    Your tool <strong>{formData.name}</strong> has been submitted. Our team will review and publish it within 24-48 hours.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={() => navigate('/dashboard')} className="btn-primary">Dashboard</button>
                    <button onClick={() => window.location.reload()} className="btn-outline">Add Another</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="slim-edit-container" style={{ 
            padding: '60px 20px 100px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
        }}>
            <div style={{ width: '100%', maxWidth: '850px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Breadcrumbs items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Submit Tool' }]} />
                </div>

                <header style={{ 
                    textAlign: 'center', 
                    marginBottom: '3.5rem', 
                    marginTop: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <button onClick={() => navigate('/dashboard')} className="icon-btn-slim" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '10px', borderRadius: '12px', color: 'white', cursor: 'pointer' }}>
                            <ArrowLeft size={20} />
                        </button>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', letterSpacing: '-1px' }}>Submit New Tool</h1>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                        Join {toolCount > 0 ? toolCount : 'our'} community of innovators.
                    </p>
                </header>

                {isLimitReached && (
                    <div className="glass-card-slim" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid #FFD70033', background: 'rgba(255, 215, 0, 0.05)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <Award size={30} color="#FFD700" />
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontWeight: '800', color: '#FFD700' }}>Free Limit Reached</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>You have reached the 2-tool limit for free accounts. Upgrade to list unlimited tools.</p>
                        </div>
                        <Link to="/premium" className="btn-primary" style={{ padding: '10px 20px', background: '#FFD700', color: 'black' }}>Upgrade Now</Link>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', opacity: isLimitReached ? 0.6 : 1, pointerEvents: isLimitReached ? 'none' : 'auto' }}>
                    
                    {/* Section 1: Basic Info */}
                    <div className="glass-card-slim" style={{ padding: '2.5rem', borderRadius: '28px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.2rem' }}>
                            <div style={{ color: 'var(--primary)' }}>
                                <Info size={22} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Core Identity</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                            <div className="input-group-slim">
                                <label><Zap size={14} /> Product Name</label>
                                <input type="text" className="slim-input-field" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. ServicesHUB" required />
                                {fieldErrors.name && <span className="error-text">{fieldErrors.name}</span>}
                            </div>
                            <div className="input-group-slim">
                                <label><Globe size={14} /> Website URL</label>
                                <input type="url" className="slim-input-field" value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} placeholder="https://..." required />
                                {fieldErrors.url && <span className="error-text">{fieldErrors.url}</span>}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                            <CustomSelect label="Product Niche" options={categories} value={formData.category_id} onChange={(val) => setFormData({...formData, category_id: val})} icon={LayoutGrid} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <CustomSelect label="Pricing " options={[{id:'Free', name:'Free'}, {id:'Freemium', name:'Freemium'}, {id:'Paid', name:'Paid'}]} value={formData.pricing_type} onChange={(val) => setFormData({...formData, pricing_type: val})} icon={Star} />
                                <input type="text" className="slim-input-field" placeholder="Briefly explain (e.g. $9/mo)" value={formData.pricing_details} onChange={(e) => setFormData({...formData, pricing_details: e.target.value})} />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Visuals & Narrative */}
                    <div className="glass-card-slim" style={{ padding: '2.5rem', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                            <ImageIcon size={18} className="text-primary" />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Media & Content</h3>
                        </div>

                        <div className="upload-wrapper-slim" style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>THUMBNAIL IMAGE</label>
                                <button type="button" onClick={() => setUseManualUrl(!useManualUrl)} className="text-link-slim">{useManualUrl ? "Upload File" : "Use Manual URL"}</button>
                            </div>

                            {/* Image Guidelines Alert */}
                            <div style={{ 
                                background: 'rgba(var(--primary-rgb), 0.05)', 
                                border: '1px solid rgba(var(--primary-rgb), 0.1)', 
                                borderRadius: '14px', 
                                padding: '1rem', 
                                marginBottom: '1.5rem',
                                display: 'flex',
                                gap: '12px',
                                alignItems: 'flex-start'
                            }}>
                                <Info size={18} className="text-primary" style={{ marginTop: '2px', flexShrink: 0 }} />
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                    <strong style={{ color: 'white', display: 'block', marginBottom: '4px' }}>Image Requirements:</strong>
                                    • Recommended dimensions: <span style={{ color: 'var(--primary)', fontWeight: '700' }}>1200 x 630 pixels</span><br/>
                                    • Best format: <span style={{ color: 'var(--primary)', fontWeight: '700' }}>WebP</span> or <span style={{ color: 'var(--primary)', fontWeight: '700' }}>PNG</span><br/>
                                    • Tip: Compress your image for faster loading (Max 2MB).
                                </div>
                            </div>

                            {useManualUrl ? (
                                <input type="url" className="slim-input-field" placeholder="https://..." value={formData.image_url} onChange={(e) => { setFormData({...formData, image_url: e.target.value}); setImagePreview(e.target.value); }} />
                            ) : (
                                <div className="slim-dropzone" style={{ border: '2px dashed var(--border)', borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
                                    {imagePreview && !uploading ? (
                                        <div style={{ 
                                            position: 'relative', 
                                            width: '100%',
                                            aspectRatio: '1200 / 630',
                                            borderRadius: '12px', 
                                            overflow: 'hidden',
                                            background: 'rgba(255,255,255,0.02)',
                                            border: '1px solid var(--border)'
                                        }}>
                                            <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <label className="change-img-overlay">
                                                <Upload size={18} /> Change Image
                                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                            </label>
                                        </div>
                                    ) : (
                                        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '2rem 0' }}>
                                            {uploading ? <Loader2 className="animate-spin" /> : <Upload size={30} className="text-muted" />}
                                            <span style={{ fontSize: '0.9rem' }}>{uploading ? 'Uploading...' : 'Click to select tool image'}</span>
                                            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} disabled={uploading} />
                                        </label>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="input-group-slim" style={{ marginBottom: '1.5rem' }}>
                            <label><Type size={14} /> Short Pitch</label>
                            <input type="text" className="slim-input-field" value={formData.short_description} onChange={(e) => setFormData({...formData, short_description: e.target.value})} placeholder="One sentence pitch..." required />
                        </div>

                        <div className="input-group-slim">
                            <label><AlignLeft size={14} /> Full Description</label>
                            <textarea className="slim-input-field" style={{ minHeight: '160px', resize: 'vertical' }} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Explain your tool in detail..." required></textarea>
                        </div>
                    </div>

                    {/* Section 3: Features */}
                    <div className="glass-card-slim" style={{ padding: '2.5rem', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                            <CheckCircle2 size={18} className="text-primary" />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Features & Highlights</h3>
                        </div>
                        <div className="input-group-slim">
                            <label>Key Features (One per line)</label>
                            <textarea className="slim-input-field" style={{ minHeight: '120px' }} value={formData.features?.join('\n') || ''} onChange={(e) => setFormData({...formData, features: e.target.value.split('\n').filter(f => f.trim() !== '')})} placeholder="Enter features..."></textarea>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div style={{ display: 'flex', gap: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
                        <button type="submit" disabled={loading || uploading} className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '18px' }}>
                            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                            {loading ? 'Submitting...' : 'Submit for Review'}
                        </button>
                    </div>
                </form>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .input-group-slim { display: flex; flex-direction: column; gap: 10px; }
                .input-group-slim label { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); }
                .slim-input-field {
                    width: 100%; padding: 14px 18px; border-radius: 14px;
                    background: rgba(255,255,255,0.03); border: 1px solid var(--border);
                    color: white; font-size: 0.95rem; transition: 0.2s;
                }
                .slim-input-field:focus { border-color: var(--primary); background: rgba(0, 255, 170, 0.05); outline: none; }
                .text-link-slim { background: none; border: none; color: var(--primary); font-size: 0.75rem; cursor: pointer; text-decoration: underline; }
                .change-img-overlay {
                    position: absolute; inset: 0; background: rgba(0,0,0,0.5); opacity: 0;
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    cursor: pointer; transition: 0.3s; color: white; font-weight: 800;
                }
                .change-img-overlay:hover { opacity: 1; }
                .error-text { color: #ff4757; font-size: 0.75rem; margin-top: 4px; }
            `}} />
        </div>
    );
};

export default SubmitTool;
