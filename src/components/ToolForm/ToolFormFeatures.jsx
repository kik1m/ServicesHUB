import React, { memo } from 'react';
import { CheckCircle2, Plus, Trash2, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Skeleton from '../ui/Skeleton';
import styles from './ToolFormFeatures.module.css';

/**
 * ToolFormFeatures - Elite Dynamic List
 * Rule #25: Memoized dynamic interaction
 * Rule #14: Centralized Constants Pattern
 */
const ToolFormFeatures = memo(({ formData, addFeature, removeFeature, handleFeatureChange, isFetchingInitialData, content }) => {
    const sectionContent = content.sections.features;

    if (isFetchingInitialData) {
        return (
            <div className={styles.sectionCard}>
                <div className={styles.sectionTitleRow}>
                    <Skeleton width="52px" height="52px" borderRadius="16px" />
                    <Skeleton width="220px" height="32px" borderRadius="12px" />
                </div>
                <div className={styles.featuresDynamicList}>
                    <Skeleton height="100px" borderRadius="24px" />
                </div>
            </div>
        );
    }

    const features = formData.features || [];

    return (
        <div className={styles.sectionCard}>
            <div className={styles.sectionTitleRow}>
                <div className={styles.titleIconBg}>
                    <CheckCircle2 size={26} />
                </div>
                <h3>{sectionContent.title}</h3>
            </div>

            <div className={styles.featuresDynamicList}>
                <div className={styles.headerRow}>
                    <p className={styles.slimHeaderLabel}>{sectionContent.label}</p>
                    <Button 
                        variant="ghost" 
                        onClick={addFeature} 
                        icon={Plus}
                        iconSize={18}
                    >
                        {content.labels.addFeature}
                    </Button>
                </div>

                {features.length === 0 ? (
                    <div className={styles.premiumEmptyState}>
                        <div className={styles.emptyIconWrapper}>
                            <Sparkles size={48} color="var(--secondary)" />
                        </div>
                        <div className={styles.emptyTextWrapper}>
                            <h4>{sectionContent.empty.title}</h4>
                            <p>{sectionContent.empty.text}</p>
                        </div>
                        <Button 
                            variant="ghost" 
                            onClick={addFeature} 
                            icon={Plus}
                        >
                            {content.labels.addFirstFeature}
                        </Button>
                    </div>
                ) : (
                    <div className={styles.dynamicListWrapper}>
                        {features.map((feature, index) => (
                            <div key={index} className={styles.dynamicInputRow}>
                                <div className={styles.rowNumber}>{index + 1}</div>
                                <Input 
                                    placeholder={content.labels.featurePlaceholder} 
                                    value={feature}
                                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                                    className={styles.featureInput}
                                />
                                <Button 
                                    variant="ghost" 
                                    onClick={() => removeFeature(index)} 
                                    className={styles.premiumRemoveBtn}
                                    icon={Trash2}
                                    iconSize={20}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});

export default ToolFormFeatures;
