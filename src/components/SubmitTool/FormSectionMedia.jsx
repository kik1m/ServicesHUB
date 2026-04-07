import React from 'react';
import { ImageIcon, Info, Upload, Loader2, Type, AlignLeft } from 'lucide-react';

const FormSectionMedia = ({
    useManualUrl, setUseManualUrl,
    formData, setFormData,
    imagePreview, setImagePreview,
    uploading, handleFileChange
}) => {
    return (
        <div className="form-section-card">
            <div className="section-title-row">
                <ImageIcon size={18} className="text-primary" />
                <h3>Media & Content</h3>
            </div>

            <div className="upload-wrapper-slim">
                <div className="upload-header-row">
                    <label className="upload-label-text">THUMBNAIL IMAGE</label>
                    <button
                        type="button"
                        onClick={() => setUseManualUrl(!useManualUrl)}
                        className="text-link-slim"
                    >
                        {useManualUrl ? "Upload File" : "Use Manual URL"}
                    </button>
                </div>

                {/* Image Guidelines Alert */}
                <div className="upload-instructions-alert">
                    <Info size={18} className="text-primary" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div className="instruction-content">
                        <strong>Image Requirements:</strong>
                        • Recommended dimensions: <span>1200 x 630 pixels</span><br />
                        • Best format: <span>WebP</span> or <span>PNG</span><br />
                        • Tip: Compress your image for faster loading (Max 2MB).
                    </div>
                </div>

                {useManualUrl ? (
                    <input
                        type="url"
                        className="slim-input-field"
                        placeholder="https://..."
                        value={formData.image_url}
                        onChange={(e) => {
                            setFormData({ ...formData, image_url: e.target.value });
                            setImagePreview(e.target.value);
                        }}
                    />
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
                            <label className="dropzone-label">
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
                <input
                    type="text"
                    className="slim-input-field"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    placeholder="One sentence pitch..."
                    required
                />
            </div>

            <div className="input-group-slim">
                <label><AlignLeft size={14} /> Full Description</label>
                <textarea
                    className="slim-input-field"
                    style={{ minHeight: '160px', resize: 'vertical' }}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Explain your tool in detail..."
                    required
                ></textarea>
            </div>
        </div>
    );
};

export default FormSectionMedia;
