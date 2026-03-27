import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Save, ArrowLeft, Upload, Globe, MessageSquare, Tag, AlignLeft, Loader2, AlertCircle } from 'lucide-react';

const EditTool = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    navigate('/auth');
                    return;
                }

                // Fetch Categories
                const { data: catData } = await supabase.from('categories').select('*');
                setCategories(catData || []);

                // Fetch Tool
                const { data: tool, error: toolError } = await supabase
                    .from('tools')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (toolError) throw toolError;

                // Security Check: Only owner or admin can edit
                if (tool.user_id !== user.id) {
                    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
                    if (profile?.role !== 'admin') {
                        throw new Error('Unauthorized: You do not own this toolListing');
                    }
                }

                setFormData({
                    name: tool.name,
                    short_description: tool.short_description,
                    description: tool.description,
                    category_id: tool.category_id,
                    website_url: tool.website_url,
                    pricing_type: tool.pricing_type,
                    image_url: tool.image_url
                });
            } catch (err) {
                console.error('Fetch edit data error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { error: updateError } = await supabase
                .from('tools')
                .update({
                    ...formData,
                    is_approved: false, // Reset approval for moderation review
                    updated_at: new Date()
                })
                .eq('id', id);

            if (updateError) throw updateError;
            navigate('/success');
        } catch (err) {
            console.error('Update tool error:', err);
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '120px 5%', textAlign: 'center' }}><Loader2 className="animate-spin" size={48} color="var(--primary)" /></div>;

    if (error) return (
        <div style={{ padding: '120px 5%', textAlign: 'center' }}>
            <AlertCircle size={48} color="#FF5252" style={{ marginBottom: '1rem' }} />
            <h2 style={{ color: '#FF5252' }}>{error}</h2>
            <Link to="/dashboard" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>Back to Dashboard</Link>
        </div>
    );

    return (
        <div className="edit-tool-page" style={{ padding: '120px 5% 60px' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                    <Link to="/dashboard" style={{ color: 'var(--text-muted)' }}><ArrowLeft size={24} /></Link>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Edit Listing</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Updating: <span style={{ color: 'var(--primary)' }}>{formData.name}</span></p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '3rem' }}>
                    <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        <div className="input-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>
                                <MessageSquare size={16} color="var(--primary)" /> Tool Name
                            </label>
                            <input 
                                type="text" 
                                className="nav-search-wrapper" 
                                style={{ width: '100%', padding: '15px', color: 'white', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>
                                <Globe size={16} color="var(--primary)" /> Website URL
                            </label>
                            <input 
                                type="url" 
                                className="nav-search-wrapper" 
                                style={{ width: '100%', padding: '15px', color: 'white', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}
                                value={formData.website_url}
                                onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div className="input-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>
                                    <Tag size={16} color="var(--primary)" /> Category
                                </label>
                                <select 
                                    className="nav-search-wrapper" 
                                    style={{ width: '100%', padding: '15px', color: 'white', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', appearance: 'none' }}
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                                    required
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id} style={{ background: '#111' }}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>
                                    <Tag size={16} color="var(--primary)" /> Pricing
                                </label>
                                <select 
                                    className="nav-search-wrapper" 
                                    style={{ width: '100%', padding: '15px', color: 'white', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', appearance: 'none' }}
                                    value={formData.pricing_type}
                                    onChange={(e) => setFormData({...formData, pricing_type: e.target.value})}
                                    required
                                >
                                    <option value="Free" style={{ background: '#111' }}>Free</option>
                                    <option value="Freemium" style={{ background: '#111' }}>Freemium</option>
                                    <option value="Paid" style={{ background: '#111' }}>Paid</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>
                                <AlignLeft size={16} color="var(--primary)" /> Short Description
                            </label>
                            <input 
                                type="text"
                                className="nav-search-wrapper" 
                                style={{ width: '100%', padding: '15px', color: 'white', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}
                                value={formData.short_description}
                                onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>
                                <AlignLeft size={16} color="var(--primary)" /> Long Description (Markdown supported)
                            </label>
                            <textarea 
                                className="nav-search-wrapper" 
                                style={{ width: '100%', padding: '15px', color: 'white', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', minHeight: '150px', resize: 'vertical' }}
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                            ></textarea>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} disabled={saving}>
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
