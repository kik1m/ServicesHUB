import React from 'react';
import { ImageIcon, Info, Upload, Loader2, Type, AlignLeft } from 'lucide-react';
import styles from './ToolFormMedia.module.css';

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
        <div className={styles.sectionCard}>
            <div className={styles.sectionTitleRow}>
                <div className={styles.titleIconBg}>
                    <ImageIcon size={22} className="text-primary" />
                </div>
                <h3>Media & Content</h3>
            </div>

            <div className={styles.uploadWrapperSlim}>
                <div className={styles.uploadHeaderRow}>
                    <label className={styles.slimHeaderLabel}>THUMBNAIL IMAGE</label>
                    <button type="button" onClick={() => setUseManualUrl(!useManualUrl)} className={styles.premiumToggleBtn}>
                        {useManualUrl ? (
                            <><Upload size={14} /> Use Upload</>
                        ) : (
                            <><ImageIcon size={14} /> Manual URL</>
                        )}
                    </button>
                </div>

                <div className={styles.premiumInfoBanner}>
                    <div className={styles.bannerIconBg}>
                        <Info size={22} />
                    </div>
                    <div className={styles.bannerContent}>
                        <h4>Image Requirements</h4>
                        <p>Recommended dimensions: <strong>1200 x 630 pixels</strong>. Best formats: <strong>WebP</strong> or <strong>PNG</strong>.</p>
                    </div>
                </div>

                {useManualUrl ? (
                    <div className={styles.inputGroupSlim}>
                        <input 
                            type="url" 
                            className={styles.slimInputField} 
                            placeholder="https://paste-your-image-url-here.com/image.png" 
                            value={formData.image_url || ''}
                            onChange={(e) => { 
                                setFormData({...formData, image_url: e.target.value}); 
                                if (setImagePreview) setImagePreview(e.target.value); 
                            }}
                        />
                    </div>
                ) : (
                    <div className={styles.slimDropzone}>
                        {imagePreview && !uploading ? (
                            <div className={styles.imagePreviewBox}>
                                <img src={imagePreview} alt="Preview" />
                                <label className={styles.changeImgOverlay}>
                                    <Upload size={18} /> Change Image
                                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                </label>
                            </div>
                        ) : (
                            <label className={styles.dropzoneLabel}>
                                {uploading ? <Loader2 className="animate-spin" size={32} /> : <Upload size={40} className="text-primary" style={{ opacity: 0.6 }} />}
                                <span className={styles.dropzoneText}>
                                    {uploading ? 'Processing Image...' : 'Click to select tool image'}
                                </span>
                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} disabled={uploading} />
                            </label>
                        )}
                    </div>
                )}
            </div>

            <div className={styles.inputGrid2}>
                <div className={styles.inputGroupSlim}>
                    <label><Type size={14} /> Short Pitch (Catchy)</label>
                    <input 
                        type="text" 
                        className={styles.slimInputField} 
                        value={formData.short_description || ''} 
                        onChange={(e) => setFormData({...formData, short_description: e.target.value})} 
                        placeholder="One sentence describing the tool..."
                    />
                    {fieldErrors.short_description && <span className={styles.errorText}>{fieldErrors.short_description}</span>}
                </div>
            </div>

            <div className={styles.inputGroupSlim}>
                <label><AlignLeft size={14} /> Full Description</label>
                <textarea 
                    className={`${styles.slimInputField} ${styles.textareaField}`} 
                    value={formData.description || ''} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    placeholder="Explain how it works and the value it provides..."
                ></textarea>
                {fieldErrors.description && <span className={styles.errorText}>{fieldErrors.description}</span>}
            </div>
        </div>
    );
};

export default ToolFormMedia;
