import React, { memo } from 'react';
import { Info, Zap, Globe, Layout, Star, MousePointer2 } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ToolFormBasicInfo.module.css';

/**
 * ToolFormBasicInfo - Elite Pure Component
 * Rule #25: Stable memoization for form sections
 * Rule #14: Centralized Constants Pattern
 */
const ToolFormBasicInfo = memo(({ formData, setFormData, categories, fieldErrors, isFetchingInitialData, error, onRetry, content }) => {
    const basic = content?.sections?.basic;

    if (isFetchingInitialData) {
        return (
            <div className={styles.sectionCard}>
                <div className={styles.sectionTitleRow}>
                    <Skeleton width="52px" height="52px" borderRadius="16px" />
                    <Skeleton width="200px" height="32px" borderRadius="12px" />
                </div>
                <div className={styles.inputGrid2}>
                    <Skeleton height="80px" borderRadius="14px" />
                    <Skeleton height="80px" borderRadius="14px" />
                </div>
                <div className={styles.inputGrid3}>
                    <Skeleton height="80px" borderRadius="14px" />
                    <Skeleton height="80px" borderRadius="14px" />
                    <Skeleton height="80px" borderRadius="14px" />
                </div>
            </div>
        );
    }

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.sectionCard}>
                <div className={styles.sectionTitleRow}>
                    <div className={styles.titleIconBg}>
                        <Info size={26} />
                    </div>
                    <h3>{basic?.title}</h3>
                </div>

                <div className={styles.inputGrid2}>
                    <Input
                        label={basic?.fields?.name?.label}
                        icon={Zap}
                        value={formData?.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={basic?.fields?.name?.placeholder}
                        error={fieldErrors?.name}
                    />
                    <Input
                        label={basic?.fields?.url?.label}
                        icon={Globe}
                        type="url"
                        value={formData?.url || ''}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder={basic?.fields?.url?.placeholder}
                        error={fieldErrors?.url}
                    />
                </div>

                <div className={styles.inputGrid3}>
                    <Select
                        label={basic?.fields?.category?.label}
                        icon={Layout}
                        options={categories}
                        value={formData?.category_id}
                        onChange={(val) => setFormData({ ...formData, category_id: val })}
                        error={fieldErrors?.category_id}
                    />

                    <Select
                        label={basic?.fields?.pricing?.label}
                        icon={Star}
                        options={basic?.fields?.pricing?.options}
                        value={formData?.pricing_type}
                        onChange={(val) => setFormData({ ...formData, pricing_type: val })}
                    />

                    <Input
                        label={basic?.fields?.details?.label}
                        icon={MousePointer2}
                        placeholder={basic?.fields?.details?.placeholder}
                        value={formData?.pricing_details || ''}
                        onChange={(e) => setFormData({ ...formData, pricing_details: e.target.value })}
                    />
                </div>
            </div>
        </Safeguard>
    );
});

export default ToolFormBasicInfo;
