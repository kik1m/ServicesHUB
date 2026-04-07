import React from 'react';
import { ImageIcon, Info, Upload, Loader2, Type, AlignLeft } from 'lucide-react';

const ToolFormMedia = ({ 
    formData, 
    setFormData, 
    imagePreview, 
    setImagePreview, 
    uploading, 
    useManualUrl, 
    setUseManualUrl, 
    handleFileChange, 
    fieldErrors 
}) => {
    return (
        <div className="form-section-card">
            <div className="section-title-row">
                <div className="title-icon-bg">
                    <ImageIcon size={22} className="text-primary" />
                </div>
                <h3>Media & Content</h3>
            </div>

            <div className="upload-wrapper-slim">
                <div className="upload-header-row">
                    <label className="slim-header-label">THUMBNAIL IMAGE</label>
                    <button type="button" onClick={() => setUseManualUrl(!useManualUrl)} className="premium-toggle-btn">
                        {useManualUrl ? (
                            <><Upload size={14} /> Use Upload</>
                        ) : (
                            <><ImageIcon size={14} /> Manual URL</>
                        )}
                    </button>
                </div>

                <div className="premium-info-banner">
                    <div className="banner-icon-bg">
                        <Info size={22} />
                    </div>
                    <div className="banner-content">
                        <h4>Image Requirements</h4>
                        <p>Recommended dimensions: <strong>1200 x 630 pixels</strong>. Best formats: <strong>WebP</strong> or <strong>PNG</strong>.</p>
                    </div>
                </div>

                {useManualUrl ? (
                    <div className="input-group-slim">
                        <input 
                            type="url" 
                            className="slim-input-field" 
                            placeholder="https://paste-your-image-url-here.com/image.png" 
                            value={formData.image_url || ''}
                            onChange={(e) => { 
                                setFormData({...formData, image_url: e.target.value}); 
                                setImagePreview(e.target.value); 
                            }}
                        />
                    </div>
                ) : (
                    <div className="slim-dropzone">
                        {imagePreview && !uploading ? (
                            <div className="image-preview-box">
                                <img src={imagePreview} alt="Preview" />
                                <label className="change-img-overlay">
                                    <Upload size={18} /> Change Image
                                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                </label>
                            </div>
                        ) : (
                            <label className="dropzone-label" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                                {uploading ? <Loader2 className="animate-spin" size={32} /> : <Upload size={40} className="text-primary" style={{ opacity: 0.6 }} />}
                                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                                    {uploading ? 'Processing Image...' : 'Click to select tool image'}
                                </span>
                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} disabled={uploading} />
                            </label>
                        )}
                    </div>
                )}
            </div>

            <div className="input-grid-2">
                <div className="input-group-slim">
                    <label><Type size={14} /> Short Pitch (Catchy)</label>
                    <input 
                        type="text" 
                        className="slim-input-field" 
                        value={formData.short_description || ''} 
                        onChange={(e) => setFormData({...formData, short_description: e.target.value})} 
                        placeholder="One sentence describing the tool..."
                    />
                    {fieldErrors.short_description && <span className="error-text">{fieldErrors.short_description}</span>}
                </div>
            </div>

            <div className="input-group-slim">
                <label><AlignLeft size={14} /> Full Description</label>
                <textarea 
                    className="slim-input-field" 
                    style={{ minHeight: '180px' }}
                    value={formData.description || ''} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    placeholder="Explain how it works and the value it provides..."
                ></textarea>
                {fieldErrors.description && <span className="error-text">{fieldErrors.description}</span>}
            </div>
        </div>
    );
};

export default ToolFormMedia;
