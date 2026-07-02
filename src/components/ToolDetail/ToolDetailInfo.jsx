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

    // --- 🚀 SCANNABLE CONTENT ENGINE ---
    const renderScannableContent = (text) => {
        if (!text) return null;
        
        // Split by sentences, but be smart about abbreviations (e.g., i.e.)
        // We look for a dot followed by a space and a capital letter
        const sentences = text.split(/\. (?=[A-Z])/).map(s => s.trim()).filter(Boolean);
        
        if (sentences.length <= 1) {
            return <p className={styles.sectionText}>{text}</p>;
        }

        return (
            <ul className={styles.scannableList}>
                {sentences.map((sentence, idx) => (
                    <li key={idx} className={styles.scannableItem}>
                        {sentence.endsWith('.') ? sentence : `${sentence}.`}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.toolMainInfo}>
                <div className={styles.detailSection}>
                    <h2 className={`${styles.sectionSubtitle} ${styles.mainSectionTitle}`}>
                        {content?.tabs?.overview} <span className={styles.highlight}>{tool?.name || content?.tabs?.thisTool}</span>
                    </h2>

                    {(() => {
                        const rawDescription = tool?.description || tool?.short_description || content?.tabs?.defaultDesc || '';
                        let sections = [];

                        // 🧠 SMART PARSER (V3) - Auto-injects default headings for raw paragraphs
                        try {
                            if (rawDescription.trim().startsWith('{')) {
                                const parsed = JSON.parse(rawDescription);
                                sections = Object.entries(parsed).map(([title, text]) => ({
                                    title: title.charAt(0).toUpperCase() + title.slice(1),
                                    contentText: text
                                }));
                            } 
                            else {
                                const rawSections = rawDescription.split('\n\n').filter(s => s.trim().length > 0);
                                const defaultTitles = ['OVERVIEW', 'INNOVATION', 'IMPACT', 'SUMMARY'];
                                
                                sections = rawSections.map((section, index) => {
                                    // Sub-case: [TITLE] format
                                    const titleMatch = section.match(/\[TITLE\](.*?)\[CONTENT\]/s);
                                    if (titleMatch) {
                                        return {
                                            title: titleMatch[1].trim(),
                                            contentText: section.split('[CONTENT]')[1]?.trim() || ''
                                        };
                                    }

                                    // Sub-case: Header: format (Overview:, Innovation:, etc.)
                                    const headerMatch = section.match(/^(Overview|Innovation|Impact|Description|Features|About|Goal):\s*/i);
                                    if (headerMatch) {
                                        return {
                                            title: headerMatch[1].trim(),
                                            contentText: section.replace(/^(Overview|Innovation|Impact|Description|Features|About|Goal):\s*/i, '').trim()
                                        };
                                    }

                                    // Sub-case: Plain paragraph without explicit header
                                    // Assign default title based on index so it matches the UI design perfectly
                                    return { 
                                        title: defaultTitles[index] || null, 
                                        contentText: section.trim() 
                                    };
                                }).filter(s => s.contentText);
                            }
                        } catch (err) {
                            console.warn('Description Parsing Failed:', err);
                            sections = [{ title: 'OVERVIEW', contentText: rawDescription }];
                        }

                        return sections.map((sec, i) => (
                            <div key={`desc-section-${i}`} className={styles.descriptionSection}>
                                {sec.title && <h3 className={styles.sectionEntryTitle}>{sec.title}</h3>}
                                {renderScannableContent(sec.contentText)}
                            </div>
                        ));
                    })()}
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