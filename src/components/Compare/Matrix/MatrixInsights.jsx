import React from 'react';
import { BrainCircuit, Sparkles, Target, CheckCircle2, Info } from 'lucide-react';
import Skeleton from '../../ui/Skeleton';
import styles from './MatrixInsights.module.css';
import { renderStructuredText } from './MatrixUtils';

const MatrixInsights = ({ 
    tool1, 
    tool2, 
    isAiLoading, 
    aiResults, 
    aiError, 
    activeTab, 
    loadingMessage 
}) => {
    return (
        <div className={`${styles.aiPulseContainer} ${isAiLoading ? styles.pulseGlow : ''}`}>
            <div className={styles.aiPulseHeader}>
                <div className={styles.aiPulseTitle}>
                    <BrainCircuit size={20} className={styles.aiIcon} />
                    <h3>AI Strategic Analysis</h3>
                </div>
                {isAiLoading && (
                    <div className={styles.aiThinking}>
                        <div className={styles.pulseScanner}></div>
                        <span>{loadingMessage}</span>
                    </div>
                )}
            </div>

            {isAiLoading ? (
                <div className={styles.aiSkeleton}>
                    <Skeleton height="16px" width="90%" style={{ marginBottom: '12px' }} />
                    <Skeleton height="16px" width="85%" style={{ marginBottom: '12px' }} />
                    <Skeleton height="16px" width="40%" />
                </div>
            ) : aiError ? (
                <div className={styles.aiError}>
                    <Info size={16} color="var(--error)" />
                    <span>We're sorry! The AI expert is currently overwhelmed. Please try again in a few seconds for a fresh analysis.</span>
                </div>
            ) : aiResults ? (
                <div className={styles.aiInsights}>
                    <div className={styles.strategicGrid}>
                        {String(aiResults.strategic_overview).split(/\s*\[SPLIT\]\s*/i).filter(t => t.trim()).map((text, idx) => (
                            <div 
                                key={idx} 
                                className={`${styles.strategicCard} ${(idx === 0 && activeTab === 2) || (idx === 1 && activeTab === 1) ? styles.hideOnMobile : ''}`}
                            >
                                <div className={styles.strategicCardHeader}>
                                    <Sparkles size={14} />
                                    <span>{idx === 0 ? tool1?.name : tool2?.name} Positioning</span>
                                </div>
                                <div className={styles.strategicText}>
                                    {renderStructuredText(text.trim())}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.aiDecisionGrid}>
                        <div className={`${styles.aiDecisionBox} ${activeTab === 2 ? styles.hideOnMobile : ''}`}>
                            <div className={styles.decisionHeader}>
                                <Target size={16} color="var(--secondary)" />
                                <span>Why choose {tool1?.name}?</span>
                            </div>
                            <ul className={styles.decisionList}>
                                {aiResults.why_buy?.tool1?.map((reason, i) => (
                                    <li key={i}><CheckCircle2 size={12} /> {reason}</li>
                                ))}
                            </ul>
                        </div>
                        <div className={`${styles.aiDecisionBox} ${activeTab === 1 ? styles.hideOnMobile : ''}`}>
                            <div className={styles.decisionHeader}>
                                <Target size={16} color="var(--success)" />
                                <span>Why choose {tool2?.name}?</span>
                            </div>
                            <ul className={styles.decisionList}>
                                {aiResults.why_buy?.tool2?.map((reason, i) => (
                                    <li key={i}><CheckCircle2 size={12} /> {reason}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default MatrixInsights;
