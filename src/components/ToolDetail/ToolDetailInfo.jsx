import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ToolDetailInfo.module.css';

const ToolDetailInfo = ({ tool, isLoading, error, onRetry, content }) => {
    // Rule #11 & #4: Component-Owned Skeletons
    if (isLoading) {
        return (
            <div className={styles.toolMainInfo}>
                <div className={styles.detailSection}>
                    <Skeleton width="180px" height="32px" className={styles.mb1_5rem} borderRadius="8px" />
                    <div className={styles.skeletonTextRows}>
                        <Skeleton width="100%" height="18px" />
                        <Skeleton width="95%" height="18px" />
                        <Skeleton width="98%" height="18px" />
                        <Skeleton width="60%" height="18px" />
                    </div>
                </div>
                <div className={styles.detailSection}>
                    <Skeleton width="150px" height="32px" className={styles.mb1_5rem} borderRadius="8px" />
                    <div className={styles.featuresChecklist}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={`skeleton-feature-${i}`} className={styles.featureItemPremium}>
                                <Skeleton width="44px" height="44px" borderRadius="12px" />
                                <div className={styles.skeletonFlex1}>
                                    <Skeleton width="100%" height="20px" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Rule #36: Component Resilience
    if (!tool) return null;

    // Rule #32: Defensive Rendering for features
    const safeFeatures = tool?.features?.filter(Boolean) ?? [];

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.toolMainInfo}>
                <div className={styles.detailSection}>
                    <h3 className={styles.sectionSubtitle}>
                        {content?.tabs?.overview} <span className={styles.highlight}>{tool?.name || content?.tabs?.thisTool}</span>
                    </h3>

                    {/* 🔥 RESTORED OLD PARSING SYSTEM (FIXED COMPATIBILITY) */}
                    {(tool?.description || tool?.short_description || content?.tabs?.defaultDesc)
                        .split('\n\n')
                        .map((section, i) => {
                            let title = null;
                            let contentText = section.trim();

                            // Case 1: old format [TITLE][CONTENT]
                            const titleMatch = section.match(/\[TITLE\](.*?)\[CONTENT\]/s);
                            if (titleMatch) {
                                title = titleMatch[1].trim();
                                contentText = section.split('[CONTENT]')[1]?.trim() || '';
                            }

                            // Case 2: new format (Overview:, Innovation:, Impact:)
                            else {
                                const newFormatMatch = section.match(/^(Overview|Innovation|Impact):\s*/i);

                                if (newFormatMatch) {
                                    title = newFormatMatch[1].trim();
                                    contentText = section.replace(/^(Overview|Innovation|Impact):\s*/i, '').trim();
                                }
                            }

                            return (
                                <div key={`desc-section-${i}`} className={styles.descriptionSection}>
                                    {title ? (
                                        <>
                                            <h4 className={styles.sectionEntryTitle}>{title}</h4>
                                            <p className={styles.sectionText}>{contentText}</p>
                                        </>
                                    ) : (
                                        <p className={styles.sectionText}>{contentText}</p>
                                    )}
                                </div>
                            );
                        })}
                </div>

                {tool?.use_cases?.length > 0 && (
                    <div className={styles.detailSection}>
                        <h3 className={styles.sectionSubtitle}>Best For / Use Cases</h3>
                        <div className={styles.useCasesGrid}>
                            {tool.use_cases.map((useCase, i) => (
                                <div key={`usecase-${i}`} className={styles.useCaseTag}>
                                    <span className={styles.useCaseBullet}>•</span>
                                    {useCase}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {safeFeatures.length > 0 && (
                    <div className={styles.detailSection}>
                        <h3 className={styles.sectionSubtitle}>{content?.tabs?.features}</h3>
                        <div className={styles.featuresChecklist}>
                            {safeFeatures.map((feature, i) => (
                                <div key={`${tool?.id}-feature-${i}`} className={styles.featureItemPremium}>
                                    <div className={styles.featureIconBox}>
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <p className={styles.featureText}>{feature}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Safeguard>
    );
};

export default ToolDetailInfo;