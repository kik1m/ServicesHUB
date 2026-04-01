import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { sendNotification } from '../utils/notifications';
import CustomSelect from '../components/CustomSelect';
import { 
    ArrowLeft, 
    Globe, Zap, Loader2, 
    Image as ImageIcon, Save, AlignLeft, Upload
} from 'lucide-react';

const EditTool = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [useManualUrl, setUseManualUrl] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        short_description: '',
        description: '',
        category_id: '',
        url: '',
        pricing_type: 'Free',
        image_url: ''
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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
                // If it's not a supabase URL, assume manual mode
                if (tool.image_url && !tool.image_url.includes('supabase.co')) {
                    setUseManualUrl(true);
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate, user, authLoading]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        console.log('--- EDIT UPLOAD START (POST) ---');
        console.log('File:', file.name, 'Size:', (file.size / 1024).toFixed(2), 'KB');

        if (file.size > 2 * 1024 * 1024) {
            showToast('File too large (Max 2MB)', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);

        setUploading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
            const filePath = `tool-thumbnails/${fileName}`;

            console.log('Target Path:', filePath, 'Mode: POST');

            const { error: uploadError } = await supabase.storage
                .from('tool-images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                    resumable: false // CRITICAL: Standard POST
                });

            if (uploadError) {
                console.error('Supabase Error:', uploadError);
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('tool-images')
                .getPublicUrl(filePath);

            console.log('Success URL:', publicUrl);
            setFormData(prev => ({ ...prev, image_url: publicUrl }));
            showToast('Image updated!', 'success');
        } catch (err) {
            console.error('Final Catch:', err);
            const msg = err.name === 'AbortError' ? 'Upload timed out. Try manual URL.' : `Upload failed: ${err.message}`;
            showToast(msg, 'error');
        } finally {
            clearTimeout(timeoutId);
            setUploading(false);
            console.log('--- EDIT UPLOAD END ---');
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name || formData.name.length < 2) errors.name = "Name is too short";
        if (!formData.url || !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.url)) errors.url = "Invalid URL format";
        if (!formData.short_description || formData.short_description.length < 10) errors.short_description = "Description too short (min 10 chars)";
        if (!formData.description || formData.description.length < 50) errors.description = "Detailed description too short (min 50 chars)";
        if (!formData.category_id) errors.category_id = "Please select a category";
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showToast('Please correct the errors in the form.', 'error');
            return;
        }
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
            console.error('Update Error:', err);
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
                            <input type="text" className="nav-search-wrapper" style={{ width: '100%', padding: '15px', color: 'white', background: 'rgba(255,255,255,0.03)', border: `1px solid ${fieldErrors.name ? '#ff4757' : 'var(--border)'}` }} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                            {fieldErrors.name && <p style={{ color: '#ff4757', fontSize: '0.75rem', marginTop: '5px' }}>{fieldErrors.name}</p>}
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>
                                <Globe size={16} color="var(--primary)" /> Website URL
                            </label>
                            <input type="url" className="nav-search-wrapper" style={{ width: '100%', padding: '15px', color: 'white', background: 'rgba(255,255,255,0.03)', border: `1px solid ${fieldErrors.url ? '#ff4757' : 'var(--border)'}` }} value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} required />
                            {fieldErrors.url && <p style={{ color: '#ff4757', fontSize: '0.75rem', marginTop: '5px' }}>{fieldErrors.url}</p>}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <CustomSelect label="Category" options={categories} value={formData.category_id} onChange={(val) => setFormData({...formData, category_id: val})} />
                            <CustomSelect label="Pricing" options={[{id:'Free', name:'Free'}, {id:'Freemium', name:'Freemium'}, {id:'Paid', name:'Paid'}]} value={formData.pricing_type} onChange={(val) => setFormData({...formData, pricing_type: val})} />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                                    <ImageIcon size={16} color="var(--primary)" /> Tool Thumbnail
                                </label>
                                <button 
                                    type="button" 
                                    onClick={() => setUseManualUrl(!useManualUrl)}
                                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    {useManualUrl ? "Switch to File Upload" : "Upload issues? Enter URL manually"}
                                </button>
                            </div>

                            {useManualUrl ? (
                                <div className="manual-url-input">
                                    <input 
                                        type="url" 
                                        placeholder="https://example.com/image.png"
                                        className="nav-search-wrapper"
                                        value={formData.image_url}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, image_url: e.target.value }));
                                            setImagePreview(e.target.value);
                                        }}
                                        style={{ width: '100%', padding: '15px', color: 'white', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}
                                    />
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '5px' }}>Paste a direct link to your tool&apos;s thumbnail.</p>
                                </div>
                            ) : (
                                <div className="file-upload-wrapper">
                                    {imagePreview && !uploading ? (
                                        <div className="preview-img-container" style={{ position: 'relative' }}>
                                            <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px' }} />
                                            <label className="edit-image-btn" style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'var(--primary)', color: 'white', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}>
                                                Change Image
                                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                            </label>
                                        </div>
                                    ) : (
                                        <label className="file-upload-label" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem', border: '2px dashed var(--border)', borderRadius: '16px', cursor: 'pointer', position: 'relative' }}>
                                            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} disabled={uploading} />
                                            {uploading ? <Loader2 className="animate-spin" /> : <Upload size={24} />}
                                            <span>{uploading ? 'Uploading...' : 'Click to upload image'}</span>
                                            {uploading && (
                                                <button 
                                                    type="button" 
                                                    onClick={(e) => {
                                                        e.preventDefault(); e.stopPropagation();
                                                        setUploading(false);
                                                    }}
                                                    style={{ 
                                                        position: 'absolute', top: '10px', right: '10px', 
                                                        background: 'rgba(255, 71, 87, 0.2)', color: '#ff4757', 
                                                        border: '1px solid rgba(255, 71, 87, 0.3)', padding: '5px 10px', 
                                                        borderRadius: '6px', fontSize: '0.7rem', cursor: 'pointer' 
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </label>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>
                                <AlignLeft size={16} color="var(--primary)" /> Short Description
                            </label>
                            <input type="text" className="nav-search-wrapper" style={{ width: '100%', padding: '15px', color: 'white', background: 'rgba(255,255,255,0.03)', border: `1px solid ${fieldErrors.short_description ? '#ff4757' : 'var(--border)'}` }} value={formData.short_description} onChange={(e) => setFormData({...formData, short_description: e.target.value})} required />
                            {fieldErrors.short_description && <p style={{ color: '#ff4757', fontSize: '0.75rem', marginTop: '5px' }}>{fieldErrors.short_description}</p>}
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>
                                <AlignLeft size={16} color="var(--primary)" /> Long Description
                            </label>
                            <textarea className="nav-search-wrapper" style={{ width: '100%', padding: '15px', color: 'white', background: 'rgba(255,255,255,0.03)', border: `1px solid ${fieldErrors.description ? '#ff4757' : 'var(--border)'}`, minHeight: '150px', resize: 'vertical' }} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required></textarea>
                            {fieldErrors.description && <p style={{ color: '#ff4757', fontSize: '0.75rem', marginTop: '5px' }}>{fieldErrors.description}</p>}
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
