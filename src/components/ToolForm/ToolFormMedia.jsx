import React, { memo } from 'react';
import { ImageIcon, Info, Upload, Loader2, Type, AlignLeft } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Skeleton from '../ui/Skeleton';
import styles from './ToolFormMedia.module.css';

/**
 * ToolFormMedia - Elite Content Section
 * Rule #29: Isolated failure handling for uploads
 * Rule #14: Centralized Constants Pattern
 */
const ToolFormMedia = memo(({ 
    formData, 
    setFormData, 
    imagePreview, 
    setImagePreview, 
    isUploading, 
    useManualUrl, 
    setUseManualUrl, 
    handleFileChange, 
    fieldErrors,
    isFetchingInitialData,
    content
}) => {
    const { media } = content.sections;

    if (isFetchingInitialData) {
        return (
            <div className={styles.sectionCard}>
                <div className={styles.sectionTitleRow}>
                    <Skeleton width="52px" height="52px" borderRadius="16px" />
                    <Skeleton width="220px" height="32px" borderRadius="12px" />
                </div>
                
                <div className={styles.uploadWrapperSlim}>
                    <Skeleton height="40px" borderRadius="10px" />
                    <Skeleton height="80px" borderRadius="16px" />
                    <Skeleton height="240px" borderRadius="20px" />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.sectionCard}>
            <div className={styles.sectionTitleRow}>
                <div className={styles.titleIconBg}>
                    <ImageIcon size={26} />
                </div>
                <h3>{media.title}</h3>
            </div>

            <div className={styles.uploadWrapperSlim}>
                <div className={styles.uploadHeaderRow}>
                    <label className={styles.slimHeaderLabel}>{media.upload.label}</label>
                    <Button 
                        variant="ghost" 
                        onClick={() => setUseManualUrl(!useManualUrl)} 
                        icon={useManualUrl ? Upload : ImageIcon}
                        iconSize={16}
                    >
                        {useManualUrl ? content.labels.switchUpload : content.labels.useManual}
                    </Button>
                </div>

                <div className={styles.premiumInfoBanner}>
                    <div className={styles.bannerIconBg}>
                        <Info size={22} />
                    </div>
                    <div className={styles.bannerContent}>
                        <h4>{media.upload.guidelines.title}</h4>
                        <p>{media.upload.guidelines.text}</p>
                    </div>
                </div>

                {useManualUrl ? (
                    <Input 
                        label={content.labels.imageUrl}
                        type="url" 
                        placeholder={content.labels.imageUrlPlaceholder} 
                        value={formData.image_url || ''}
                        onChange={(e) => { 
                            setFormData({...formData, image_url: e.target.value}); 
                            if (setImagePreview) setImagePreview(e.target.value); 
                        }}
                        error={fieldErrors.image_url}
                    />
                ) : (
                    <div className={styles.slimDropzone}>
                        {imagePreview && !isUploading ? (
                            <div className={styles.imagePreviewBox}>
                                <img src={imagePreview} alt="Preview" />
                                <label className={styles.changeImgOverlay}>
                                    <Upload size={22} /> {content.labels.changeImage}
                                    <input type="file" accept="image/*" onChange={handleFileChange} className={styles.hiddenInput} />
                                </label>
                            </div>
                        ) : (
                            <label className={styles.dropzoneLabel}>
                                {isUploading ? (
                                    <Loader2 className="animate-spin" size={40} color="var(--primary)" />
                                ) : (
                                    <Upload size={48} color="var(--primary)" className={styles.dropzoneIcon} />
                                )}
                                <span className={styles.dropzoneText}>
                                    {isUploading ? media.upload.uploading : media.upload.dropzone}
                                </span>
                                <input type="file" accept="image/*" onChange={handleFileChange} className={styles.hiddenInput} disabled={isUploading} />
                            </label>
                        )}
                    </div>
                )}
                {fieldErrors.image_url && !useManualUrl && <p className="text-error text-xs font-bold mt-1">{fieldErrors.image_url}</p>}
            </div>

            <Input 
                label={media.fields.pitch.label}
                icon={Type}
                value={formData.short_description || ''} 
                onChange={(e) => setFormData({...formData, short_description: e.target.value})} 
                placeholder={media.fields.pitch.placeholder}
                error={fieldErrors.short_description}
            />

            <Input 
                label={media.fields.desc.label}
                icon={AlignLeft}
                multiline={true}
                value={formData.description || ''} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                placeholder={media.fields.desc.placeholder}
                error={fieldErrors.description}
                className={styles.textareaField}
            />
        </div>
    );
});

export default ToolFormMedia;
