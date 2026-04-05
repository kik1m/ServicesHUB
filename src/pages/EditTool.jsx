import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { sendNotification } from '../utils/notifications';
import CustomSelect from '../components/CustomSelect';
import Breadcrumbs from '../components/Breadcrumbs';
import { 
    ArrowLeft, Globe, Zap, Loader2, 
    Image as ImageIcon, Save, AlignLeft, Upload,
    CheckCircle2, Info, Layout, Type, Star, MousePointer2, Plus, Trash2
} from 'lucide-react';

const EditTool = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    
    // States
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [useManualUrl, setUseManualUrl] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        image_url: '',
        is_approved: false
    });

    useEffect(() => {
        const fetchData = async () => {
            if (authLoading) return;
            if (!user) {
                navigate('/auth');
                return;
            }

            setLoading(true);
            try {
                const { data: catData } = await supabase.from('categories').select('*').order('name');
                setCategories(catData || []);

                const { data: tool, error: toolError } = await supabase
                    .from('tools')
                    .select('*, categories(name)')
                    .or(`id.eq.${id},slug.eq.${id}`)
                    .single();

                if (toolError) throw toolError;

                // Security Check
                if (tool.user_id !== user.id) {
                    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
                    if (profile?.role !== 'admin') {
                        throw new Error('Unauthorized');
                    }
                }

                setFormData({
                    name: tool.name,
                    short_description: tool.short_description,
                    description: tool.description,
                    category_id: tool.category_id,
                    url: tool.url,
                    pricing_type: tool.pricing_type,
                    pricing_details: tool.pricing_details || '',
                    features: tool.features || [],
                    image_url: tool.image_url,
                    is_approved: tool.is_approved
                });
                setImagePreview(tool.image_url);
                if (tool.image_url && !tool.image_url.includes('supabase.co')) {
                    setUseManualUrl(true);
                }
            } catch (err) {
                console.error('Fetch error:', err);
                showToast('Failed to load tool data', 'error');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate, user, authLoading, showToast]);

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...(formData.features || [])];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        setFormData(prev => ({ 
            ...prev, 
            features: [...(prev.features || []), ''] 
        }));
    };

    const removeFeature = (index) => {
        setFormData(prev => ({ 
            ...prev, 
            features: (prev.features || []).filter((_, i) => i !== index) 
        }));
    };

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
                .upload(filePath, file, { cacheControl: '3600', upsert: false });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('tool-images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
            showToast('Image uploaded!', 'success');
        } catch (err) {
            console.error('Upload failed:', err);
            showToast(`Upload failed: ${err.message}`, 'error');
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
        if (!validateForm()) {
            showToast('Check for errors in the form.', 'error');
            return;
        }

        setSaving(true);
        try {
            const isApproved = formData.is_approved;
            let updatePayload = {};

            if (isApproved) {
                // Keep live data, store changes in pending_changes
                updatePayload = {
                    pending_changes: {
                        ...formData,
                        updated_at: new Date().toISOString()
                    }
                };
            } else {
                // Not approved yet, update main columns directly
                updatePayload = {
                    ...formData,
                    is_approved: false, // Ensure it stays unapproved for initial review
                    updated_at: new Date().toISOString()
                };
            }

            const { error: updateError } = await supabase
                .from('tools')
                .update(updatePayload)
                .eq('id', id);

            if (updateError) throw updateError;
            
            // Professional English Notification
            await sendNotification(
                user.id, 
                'Update Under Review', 
                `The modifications for "${formData.name}" have been submitted for moderation. The live listing will remain unchanged until these updates are approved by our team.`, 
                'pending'
            );
            
            const successMsg = isApproved 
                ? 'Changes submitted for review. The live version remains visible!' 
                : 'Tool updated and pending initial review!';
                
            showToast(successMsg, 'success');
            navigate('/dashboard');
        } catch (err) {
            console.error('Update Error:', err);
            showToast(`Save failed: ${err.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 className="animate-spin text-primary" size={40} />
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
                    <Breadcrumbs items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Edit Tool' }]} />
                </div>

                {/* Compact Header */}
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
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', letterSpacing: '-1px' }}>Edit Listing</h1>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                        Modifying <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{formData.name}</span>
                    </p>
                </header>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Section 1: Basic Information */}
                    <div className="glass-card-slim" style={{ padding: '2.5rem', borderRadius: '28px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.2rem' }}>
                            <div style={{ color: 'var(--primary)' }}>
                                <Info size={22} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Basic Details</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                            <div className="input-group-slim">
                                <label><Zap size={14} /> Tool Name</label>
                                <input 
                                    type="text" 
                                    className="slim-input-field" 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                    placeholder="e.g. ChatGPT"
                                />
                                {fieldErrors.name && <span className="error-text">{fieldErrors.name}</span>}
                            </div>
                            <div className="input-group-slim">
                                <label><Globe size={14} /> Website URL</label>
                                <input 
                                    type="url" 
                                    className="slim-input-field" 
                                    value={formData.url} 
                                    onChange={(e) => setFormData({...formData, url: e.target.value})} 
                                    placeholder="https://yourapp.com"
                                />
                                {fieldErrors.url && <span className="error-text">{fieldErrors.url}</span>}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                            <CustomSelect 
                                label="Primary Category" 
                                options={categories} 
                                value={formData.category_id} 
                                onChange={(val) => setFormData({...formData, category_id: val})} 
                                icon={Layout}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <CustomSelect 
                                    label="Pricing Model" 
                                    options={[{id:'Free', name:'Free'}, {id:'Freemium', name:'Freemium'}, {id:'Paid', name:'Paid'}]} 
                                    value={formData.pricing_type} 
                                    onChange={(val) => setFormData({...formData, pricing_type: val})} 
                                    icon={Star}
                                />
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type="text" 
                                        className="slim-input-field" 
                                        placeholder="Pricing details (e.g. $10/mo)"
                                        value={formData.pricing_details} 
                                        onChange={(e) => setFormData({...formData, pricing_details: e.target.value})}
                                        style={{ paddingRight: '40px' }}
                                    />
                                    <MousePointer2 size={16} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Media & Content */}
                    <div className="glass-card-slim" style={{ padding: '2.5rem', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                            <ImageIcon size={18} className="text-primary" />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Media & Content</h3>
                        </div>

                        <div className="upload-wrapper-slim" style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>TOOL THUMBNAIL</label>
                                <button type="button" onClick={() => setUseManualUrl(!useManualUrl)} className="text-link-slim">
                                    {useManualUrl ? "Upload File" : "Enter Manual URL"}
                                </button>
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
                                    • Tip: Use tools like <span style={{ color: 'var(--primary)' }}>Squoosh.app</span> to compress or <span style={{ color: 'var(--primary)' }}>Canva</span> to resize.
                                </div>
                            </div>

                            {useManualUrl ? (
                                <input 
                                    type="url" 
                                    className="slim-input-field" 
                                    placeholder="https://..." 
                                    value={formData.image_url}
                                    onChange={(e) => { setFormData({...formData, image_url: e.target.value}); setImagePreview(e.target.value); }}
                                />
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
                            <label><Type size={14} /> Short Pitch (Catchy)</label>
                            <input 
                                type="text" 
                                className="slim-input-field" 
                                value={formData.short_description} 
                                onChange={(e) => setFormData({...formData, short_description: e.target.value})} 
                                placeholder="One sentence describing the tool..."
                            />
                            {fieldErrors.short_description && <span className="error-text">{fieldErrors.short_description}</span>}
                        </div>

                        <div className="input-group-slim">
                            <label><AlignLeft size={14} /> Full Description</label>
                            <textarea 
                                className="slim-input-field" 
                                style={{ minHeight: '160px', resize: 'vertical' }}
                                value={formData.description} 
                                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                                placeholder="Explain how it works and the value it provides..."
                            ></textarea>
                            {fieldErrors.description && <span className="error-text">{fieldErrors.description}</span>}
                        </div>
                    </div>

                    {/* Section 3: Features */}
                    <div className="glass-card-slim" style={{ padding: '2.5rem', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                            <CheckCircle2 size={18} className="text-primary" />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Features & Highlights</h3>
                        </div>

                        <div className="input-group-slim">
                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <span>Key Features & Highlights</span>
                                <button 
                                    type="button" 
                                    onClick={addFeature}
                                    className="add-feature-btn"
                                >
                                    <Plus size={14} /> Add Feature
                                </button>
                            </label>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                                {(formData.features || []).length > 0 ? (
                                    formData.features.map((feature, index) => (
                                        <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <div style={{ flex: 1, position: 'relative' }}>
                                                <input 
                                                    type="text" 
                                                    className="slim-input-field" 
                                                    value={feature}
                                                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                                                    placeholder={`Feature #${index + 1}`}
                                                    style={{ paddingLeft: '45px' }}
                                                />
                                                <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
                                                    <CheckCircle2 size={16} className="text-primary" />
                                                </div>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => removeFeature(index)}
                                                className="remove-feature-btn"
                                                title="Remove feature"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '30px', background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px dashed var(--border)' }}>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No features added yet.</p>
                                        <button type="button" onClick={addFeature} className="text-link-slim">Click to add your first feature</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div style={{ 
                        display: 'flex', gap: '1.5rem', marginTop: '1rem', 
                        padding: '1rem', background: 'rgba(0,0,0,0.2)', 
                        borderRadius: '20px', border: '1px solid var(--border)' 
                    }}>
                        <button 
                            type="submit" 
                            disabled={saving || uploading} 
                            className="btn-primary" 
                            style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '18px' }}
                        >
                            {saving ? <Loader2 className="animate-spin" size={22} /> : <Save size={22} />}
                            {saving ? 'Saving...' : 'Save & Submit for Review'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => navigate('/dashboard')} 
                            className="btn-outline" 
                            style={{ flex: 1, padding: '18px' }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .input-group-slim { display: flex; flexDirection: column; gap: 10px; }
                .input-group-slim label { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); }
                .slim-input-field {
                    width: 100%; padding: 14px 18px; border-radius: 14px;
                    background: rgba(255,255,255,0.03); border: 1px solid var(--border);
                    color: white; font-size: 0.95rem; transition: all 0.2s ease;
                }
                .slim-input-field:focus { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.05); outline: none; }
                .text-link-slim { background: none; border: none; color: var(--primary); font-size: 0.75rem; cursor: pointer; text-decoration: underline; }
                .error-text { color: #ff4757; font-size: 0.75rem; font-weight: 700; margin-top: 4px; }
                .change-img-overlay {
                    position: absolute; inset: 0; background: rgba(0,0,0,0.5); opacity: 0;
                    display: flex; align-items: center; justifyContent: center; gap: 8px;
                    cursor: pointer; transition: 0.3s; font-weight: 800; color: white;
                }
                .change-img-overlay:hover { opacity: 1; pointer-events: auto; }
                .add-feature-btn {
                    display: flex; align-items: center; gap: 6px; 
                    background: rgba(var(--primary-rgb), 0.1); color: var(--primary);
                    border: 1px solid rgba(var(--primary-rgb), 0.2);
                    padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; 
                    font-weight: 800; cursor: pointer; transition: 0.2s;
                }
                .add-feature-btn:hover { background: var(--primary); color: black; }
                .remove-feature-btn {
                    background: rgba(255, 71, 87, 0.1); color: #ff4757;
                    border: none; padding: 12px; border-radius: 12px;
                    cursor: pointer; transition: 0.2s;
                }
                .remove-feature-btn:hover { background: #ff4757; color: white; }
            `}} />
        </div>
    );
};

export default EditTool;
