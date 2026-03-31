import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { sendNotification } from '../utils/notifications';
import SkeletonLoader from '../components/SkeletonLoader';
import CustomSelect from '../components/CustomSelect';
import { 
    LayoutGrid, ArrowLeft, Upload, CheckCircle2, 
    Globe, Send, ShieldCheck, Zap, Loader2, AlertCircle, 
    X, Image as ImageIcon, Star, Save, AlignLeft
} from 'lucide-react';

const EditTool = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (authLoading) return;
            if (!user) {
                navigate('/auth');
                return;
            }

            setLoading(true);
            try {
                const { data: catData } = await supabase.from('categories').select('*');
                setCategories(catData || []);

                const { data: tool, error: toolError } = await supabase
                    .from('tools')
                    .select('*')
                    .eq('id', id)
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
                    image_url: tool.image_url
                });
                setImagePreview(tool.image_url);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate, user, authLoading]);

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
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `tool-thumbnails/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('tool-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('tool-images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
            showToast('Image uploaded!', 'success');
        } catch (err) {
            console.error('Upload Error:', err);
            showToast('Upload failed', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { error: updateError } = await supabase
                .from('tools')
                .update({
                    ...formData,
                    is_approved: false, // Reset for review
                    updated_at: new Date()
                })
                .eq('id', id);

            if (updateError) throw updateError;
            
            await sendNotification(user.id, 'Tool Updated', `Changes to "${formData.name}" are under review.`, 'info');
            showToast('Changes saved! 🎉', 'success');
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return null; // Or skeleton

    return (
        <div className="edit-tool-page" style={{ padding: '120px 5% 60px' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                    <Link to="/dashboard" style={{ color: 'var(--text-muted)' }}><ArrowLeft size={24} /></Link>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Edit Listing</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Updating: <span style={{ color: 'var(--primary)' }}>{formData?.name}</span></p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '3rem' }}>
                    <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        <div className="input-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>
                                <Zap size={16} color="var(--primary)" /> Tool Name
                            </label>
                            <input type="text" className="nav-search-wrapper" style={{ width: '100%', padding: '15px', color: 'white', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>
                                <Globe size={16} color="var(--primary)" /> Website URL
                            </label>
                            <input type="url" className="nav-search-wrapper" style={{ width: '100%', padding: '15px', color: 'white', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }} value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} required />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <CustomSelect label="Category" options={categories} value={formData.category_id} onChange={(val) => setFormData({...formData, category_id: val})} />
                            <CustomSelect label="Pricing" options={[{id:'Free', name:'Free'}, {id:'Freemium', name:'Freemium'}, {id:'Paid', name:'Paid'}]} value={formData.pricing_type} onChange={(val) => setFormData({...formData, pricing_type: val})} />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>
                                <ImageIcon size={16} color="var(--primary)" /> Tool Thumbnail
                            </label>
                            <div className="file-upload-wrapper">
                                {imagePreview ? (
                                    <div className="preview-img-container" style={{ position: 'relative' }}>
                                        <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px' }} />
                                        <label className="edit-image-btn" style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'var(--primary)', color: 'white', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}>
                                            Change Image
                                            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                        </label>
                                    </div>
                                ) : (
                                    <label className="file-upload-label" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem', border: '2px dashed var(--border)', borderRadius: '16px', cursor: 'pointer' }}>
                                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                        {uploading ? <Loader2 className="animate-spin" /> : <Upload size={24} />}
                                        <span>Click to upload image</span>
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>
                                <AlignLeft size={16} color="var(--primary)" /> Short Description
                            </label>
                            <input type="text" className="nav-search-wrapper" style={{ width: '100%', padding: '15px', color: 'white', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }} value={formData.short_description} onChange={(e) => setFormData({...formData, short_description: e.target.value})} required />
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>
                                <AlignLeft size={16} color="var(--primary)" /> Long Description
                            </label>
                            <textarea className="nav-search-wrapper" style={{ width: '100%', padding: '15px', color: 'white', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', minHeight: '150px', resize: 'vertical' }} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required></textarea>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} disabled={saving || uploading}>
                                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <Link to="/dashboard" className="btn-outline" style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cancel</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTool;
