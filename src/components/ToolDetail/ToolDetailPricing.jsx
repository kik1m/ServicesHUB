import React, { memo } from 'react';
import { Tag, CheckCircle2, ArrowUpRight, DollarSign, CreditCard } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import styles from './ToolDetailPricing.module.css';

/**
 * ToolDetailPricing - Elite Pricing Breakdown Component
 * Rule #2: Pure Component with clear props.
 * Displays short summary + full breakdown if available.
 */
const ToolDetailPricing = memo(({ tool, isLoading }) => {
    if (isLoading) {
        return (
            <div className={styles.pricingSection}>
                <Skeleton width="150px" height="32px" marginBottom="20px" />
                <Skeleton height="200px" borderRadius="16px" />
            </div>
        );
    }

    if (!tool?.pricing_details_full && !tool?.pricing_details) return null;

    // Logic to group features by [PlanName]
    const parsePricingData = (rawText) => {
        if (!rawText || rawText.toLowerCase().includes('not available') || rawText.toLowerCase().includes('not provided')) return [];
        
        // Cleanup: Remove stray asterisks and clean up whitespace
        const cleanRaw = rawText.replace(/\*/g, '').trim();
        
        // Split by pipes (|) OR our new [SPLIT] token
        const parts = cleanRaw.split(/\||\[SPLIT\]/).map(p => p.trim()).filter(Boolean);
        const groups = [];
        let currentGroup = null;

        parts.forEach(part => {
            // Defensive skip for AI "apology" messages
            if (part.toLowerCase().includes('not available') || part.toLowerCase().includes('not provided')) return;

            // Robust check for [Plan Name] or Plan Name:
            const planMatch = part.match(/\[(.*?)\]/);
            if (planMatch) {
                const planName = planMatch[1];
                currentGroup = {
                    name: planName,
                    features: []
                };
                
                // Add any text that might follow the bracket in the same part
                const remainingText = part.replace(/\[.*?\]/, '').trim();
                if (remainingText && remainingText.length > 2) {
                    currentGroup.features.push(remainingText);
                }
                groups.push(currentGroup);
            } else if (currentGroup) {
                if (part.length > 2) {
                    currentGroup.features.push(part);
                }
            } else {
                // Initial fallback
                groups.push({ name: 'Plan Details', features: [part] });
                currentGroup = groups[groups.length - 1];
            }
        });

        return groups;
    };

    const planGroups = parsePricingData(tool.pricing_details_full);

    return (
        <div className={styles.pricingSection}>
            <div className={styles.sectionHeader}>
                <div className={styles.iconBg}>
                    <DollarSign size={22} />
                </div>
                <h2>Detailed Pricing Plans</h2>
            </div>

            <div className={styles.pricingCard}>
                <div className={styles.mainPricingRow}>
                    <div className={styles.pricingTypeBadge}>
                        <Tag size={16} />
                        <span>{tool.pricing_type}</span>
                    </div>
                </div>

                {planGroups.length > 0 && (
                    <div className={styles.fullBreakdown}>
                        {planGroups.map((group, gIdx) => (
                            <div key={gIdx} className={styles.planCard}>
                                <div className={styles.breakdownHeader}>
                                    <CreditCard size={18} />
                                    <h3>{group.name}</h3>
                                </div>
                                <div className={styles.breakdownContent}>
                                    {group.features.map((feature, fIdx) => (
                                        <div key={fIdx} className={styles.breakdownLine}>
                                            <CheckCircle2 size={16} className={styles.checkIcon} />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {tool.pricing_url && (
                    <a 
                        href={tool.pricing_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.officialPricingLink}
                    >
                        <span>View Official Pricing Page</span>
                        <ArrowUpRight size={18} />
                    </a>
                )}
            </div>
        </div>
    );
});

export default ToolDetailPricing;
