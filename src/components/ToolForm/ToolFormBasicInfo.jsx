import React, { memo } from 'react';
import { Info, Zap, Globe, Layout, Star, MousePointer2, Plus, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
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
const ToolFormBasicInfo = memo(({ 
    formData, setFormData, categories, fieldErrors, isFetchingInitialData, error, onRetry, content,
    handlePlanChange, handlePlanFeatureChange, addPlan, removePlan, addPlanFeature, removePlanFeature
}) => {
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
                        aria-label="Select tool category"
                    />

                    <Select
                        label={basic?.fields?.pricing?.label}
                        icon={Star}
                        options={basic?.fields?.pricing?.options}
                        value={formData?.pricing_type}
                        onChange={(val) => setFormData({ ...formData, pricing_type: val })}
                        aria-label="Select pricing model"
                    />

                    <Input
                        label={basic?.fields?.details?.label}
                        icon={MousePointer2}
                        placeholder={basic?.fields?.details?.placeholder}
                        value={formData?.pricing_details || ''}
                        onChange={(e) => setFormData({ ...formData, pricing_details: e.target.value })}
                    />
                </div>

                <div className={styles.pricingBuilderWrapper}>
                    <div className={styles.sectionsHeader}>
                        <label className={styles.slimHeaderLabel}>{basic?.fields?.pricing_plans?.label}</label>
                        <Button 
                            variant="ghost" 
                            onClick={addPlan} 
                            icon={Plus}
                            iconSize={16}
                            type="button"
                        >
                            {basic?.fields?.pricing_plans?.addPlan}
                        </Button>
                    </div>

                    <div className={styles.premiumInfoBanner}>
                        <div className={styles.bannerIconBg}>
                            <Info size={22} />
                        </div>
                        <div className={styles.bannerContent}>
                            <h4>{basic?.fields?.pricing_plans?.guidelines?.title}</h4>
                            <p>{basic?.fields?.pricing_plans?.guidelines?.text}</p>
                        </div>
                    </div>

                    {(formData?.pricing_plans || []).map((plan, planIndex) => (
                        <div key={planIndex} className={styles.planBlock}>
                            <div className={styles.planBlockHeader}>
                                <Input 
                                    placeholder={basic?.fields?.pricing_plans?.planNamePlaceholder}
                                    value={plan.name}
                                    onChange={(e) => handlePlanChange(planIndex, 'name', e.target.value)}
                                    wrapperClassName={styles.planNameInput}
                                />
                                {formData?.pricing_plans?.length > 1 && (
                                    <button 
                                        type="button" 
                                        className={styles.removePlanBtn} 
                                        onClick={() => removePlan(planIndex)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>

                            <div className={styles.planFeaturesList}>
                                {plan.features.map((feature, featureIndex) => (
                                    <div key={featureIndex} className={styles.featureRow}>
                                        <Input 
                                            placeholder={basic?.fields?.pricing_plans?.featurePlaceholder}
                                            value={feature}
                                            onChange={(e) => handlePlanFeatureChange(planIndex, featureIndex, e.target.value)}
                                            wrapperClassName={styles.planFeatureInput}
                                        />
                                        {plan.features.length > 1 && (
                                            <button 
                                                type="button" 
                                                className={styles.removeFeatureBtn} 
                                                onClick={() => removePlanFeature(planIndex, featureIndex)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            <Button 
                                variant="ghost" 
                                onClick={() => addPlanFeature(planIndex)} 
                                icon={Plus}
                                iconSize={14}
                                type="button"
                                className={styles.addFeatureBtn}
                            >
                                {basic?.fields?.pricing_plans?.addFeature}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </Safeguard>
    );
});

export default ToolFormBasicInfo;
