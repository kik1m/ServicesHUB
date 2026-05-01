import React, { useState } from 'react';
import { X, Star, CheckCircle2, Trophy, Info, Users, Calculator, Sparkles, BrainCircuit, ShieldCheck, Target, Zap } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ComparisonMatrix.module.css';

/**
 * ComparisonMatrix - Elite v4.0 (AI Generative Version)
 * Feature: Live AI Strategic Analysis & Dynamic Feature Matrix.
 */
const ComparisonMatrix = ({ tool1, tool2, isLoading, isTool1Loading, isTool2Loading, isAiLoading, aiResults, aiError, error, onRetry, results, content }) => {
    const [teamSize, setTeamSize] = useState(10);
    const [loadingMessageIndex, setLoadingMessageIndex] = React.useState(0);

    const LOADING_MESSAGES = [
        "AI Analyst is distilling strategic insights...",
        "Deep-scanning feature vectors for both tools...",
        "Synthesizing comparative capability matrix...",
        "Calculating TCO scaling dynamics...",
        "Generating objective expert verdict...",
        "Aligning dimensional analysis with industry standards..."
    ];

    React.useEffect(() => {
        if (isAiLoading) {
            const interval = setInterval(() => {
                setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [isAiLoading]);

    const headers = content?.headers || { feature: "Feature", tool1: "Tool 1", tool2: "Tool 2" };

    const calculateTCO = (factor, size) => {
        if (!factor) return '0';
        return (factor * size).toLocaleString();
    };

    return (
        <Safeguard error={error} onRetry={onRetry} title="Comparison Analysis Offline">
            <div className={styles.matrixWrapper}>
                {(!tool1 || !tool2) && !isLoading ? (
                    <div className={styles.emptyMatrix}>
                        <Info size={40} className={styles.emptyMatrixIcon} />
                        <p>{content?.sections?.empty?.title || "Hydrate tool slots to begin deep analytical comparison."}</p>
                    </div>
                ) : (
                    <>
                        {/* 🧠 Section 0: AI Strategic Pulse (Live Generation) */}
                        <div className={`${styles.aiPulseContainer} ${isAiLoading ? styles.pulseGlow : ''}`}>
                            <div className={styles.aiPulseHeader}>
                                <div className={styles.aiPulseTitle}>
                                    <BrainCircuit size={20} className={styles.aiIcon} />
                                    <h3>AI Strategic Analysis</h3>
                                </div>
                                {isAiLoading && (
                                    <div className={styles.aiThinking}>
                                        <div className={styles.pulseScanner}></div>
                                        <span>{LOADING_MESSAGES[loadingMessageIndex]}</span>
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
                                    <span>AI Analysis Failed: {aiError}</span>
                                </div>
                            ) : aiResults ? (
                                <div className={styles.aiInsights}>
                                    <p className={styles.aiOverview}>{aiResults.strategic_overview}</p>

                                    <div className={styles.aiDecisionGrid}>
                                        <div className={styles.aiDecisionBox}>
                                            <div className={styles.decisionHeader}>
                                                <Target size={16} color="var(--secondary)" />
                                                <span>Why choose {tool1.name}?</span>
                                            </div>
                                            <ul className={styles.decisionList}>
                                                {aiResults.why_buy?.tool1?.map((reason, i) => (
                                                    <li key={i}><CheckCircle2 size={12} /> {reason}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className={styles.aiDecisionBox}>
                                            <div className={styles.decisionHeader}>
                                                <Target size={16} color="var(--success)" />
                                                <span>Why choose {tool2.name}?</span>
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

                        {/* 🏆 Section 1: Ultimate Verdict Dashboard */}
                        <div className={styles.verdictContainer}>
                            <div className={styles.scoreBox}>
                                {isTool1Loading || !tool1 ? (
                                    <Skeleton width="120px" height="120px" borderRadius="50%" />
                                ) : (
                                    <div className={`${styles.scoreRing} ${results?.overallWinner === 1 ? styles.winnerRing : ''}`} style={{ '--score': `${results?.score1}%`, '--score-color': results?.overallWinner === 1 ? 'var(--success)' : 'var(--secondary)' }}>
                                        <div className={styles.scoreInner}>
                                            <span className={styles.scoreNumber}>{results?.score1}</span>
                                            <span className={styles.scoreLabel}>SCORE</span>
                                        </div>
                                    </div>
                                )}
                                <h4 className={styles.toolScoreName}>{isTool1Loading ? <Skeleton width="100px" height="20px" /> : tool1?.name}</h4>
                            </div>

                            <div className={styles.verdictCenter}>
                                <div className={styles.matrixTitle}>
                                    {isAiLoading ? (
                                        <div className={styles.aiLoadingBadge}>
                                            <BrainCircuit size={14} />
                                            <span>AI ANALYZING</span>
                                        </div>
                                    ) : (aiResults ? "AI Expert Verdict" : (results?.overallWinner === 0 ? "It's a Tie!" : "Ultimate Verdict"))}
                                </div>
                                <div className={styles.verdictText}>
                                    {isAiLoading ? (
                                        <div className={styles.aiSkeletonStack}>
                                            <Skeleton width="80%" height="14px" style={{ marginBottom: '8px' }} />
                                            <Skeleton width="60%" height="14px" />
                                        </div>
                                    ) : (
                                        aiResults ? aiResults.verdict?.reasoning :
                                            (results?.overallWinner === 1 ? `${tool1?.name} ${content?.verdict?.winnerSuffix}` :
                                                results?.overallWinner === 2 ? `${tool2?.name} ${content?.verdict?.winnerSuffix}` :
                                                    content?.verdict?.draw)
                                    )}
                                </div>
                                {!isAiLoading && (aiResults || results?.overallWinner !== 0) && (
                                    <div className={styles.winnerHighlight}>
                                        <Trophy size={18} />
                                        <span>{aiResults ? aiResults.verdict?.winner : (results?.overallWinner === 1 ? tool1?.name : tool2?.name)} - DOMINANT CHOICE</span>
                                    </div>
                                )}
                            </div>

                            <div className={styles.scoreBox}>
                                {isTool2Loading || !tool2 ? (
                                    <Skeleton width="120px" height="120px" borderRadius="50%" />
                                ) : (
                                    <div className={`${styles.scoreRing} ${results?.overallWinner === 2 ? styles.winnerRing : ''}`} style={{ '--score': `${results?.score2}%`, '--score-color': results?.overallWinner === 2 ? 'var(--success)' : 'var(--secondary)' }}>
                                        <div className={styles.scoreInner}>
                                            <span className={styles.scoreNumber}>{results?.score2}</span>
                                            <span className={styles.scoreLabel}>SCORE</span>
                                        </div>
                                    </div>
                                )}
                                <h4 className={styles.toolScoreName}>{isTool2Loading ? <Skeleton width="100px" height="20px" /> : tool2?.name}</h4>
                            </div>
                        </div>

                        {/* 🛠️ Section 3: Feature Matrix (Dynamic AI Infusion) */}
                        <div className={styles.matrixSectionHeader}>
                            <Sparkles size={16} />
                            <span>{aiResults ? "AI COMPARATIVE DIMENSIONS" : "CAPABILITY ANALYSIS"}</span>
                        </div>

                        <div className={styles.featuresGrid}>
                            <div className={`${styles.featureRow} ${styles.headerRowActive}`}>
                                <div className={styles.featureLabel}>{headers?.feature}</div>
                                <div className={styles.checkContainer}><strong>{tool1?.name}</strong></div>
                                <div className={styles.checkContainer}><strong>{tool2?.name}</strong></div>
                            </div>

                            {/* AI Dynamic Matrix Rows or Loading Skeletons */}
                            {isAiLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className={styles.skeletonRow}>
                                        <Skeleton width="45%" height="16px" />
                                        <Skeleton width="20%" height="16px" />
                                        <Skeleton width="20%" height="16px" />
                                    </div>
                                ))
                            ) : aiResults ? (
                                aiResults.comparison_matrix?.map((row, i) => (
                                    <div key={i} className={styles.aiFeatureRow}>
                                        <div className={styles.featureLabel}>
                                            <div className={styles.aiLabelTitle}>{row.feature}</div>
                                            <div className={styles.aiLabelInsight}>{row.insight}</div>
                                        </div>
                                        <div className={`${styles.checkContainer} ${row.winner === 1 ? styles.aiWinnerCell : ''}`}>
                                            <div className={styles.aiValue}>{row.tool1_value}</div>
                                            {row.winner === 1 && <ShieldCheck size={14} className={styles.winnerCheck} />}
                                        </div>
                                        <div className={`${styles.checkContainer} ${row.winner === 2 ? styles.aiWinnerCell : ''}`}>
                                            <div className={styles.aiValue}>{row.tool2_value}</div>
                                            {row.winner === 2 && <ShieldCheck size={14} className={styles.winnerCheck} />}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                /* Fallback to Static Matrix only if AI Analysis failed or not present */
                                <>
                                    {results?.uniqueToA?.map((feat, i) => (
                                        <div key={`ua-${i}`} className={`${styles.featureRow} ${styles.featureRowHighlightA}`}>
                                            <div className={styles.featureLabel}>{feat}</div>
                                            <div className={styles.checkContainer}><CheckCircle2 size={20} color="var(--success)" /></div>
                                            <div className={styles.checkContainer}><X size={20} color="var(--text-muted-op)" /></div>
                                        </div>
                                    ))}

                                    {results?.uniqueToB?.map((feat, i) => (
                                        <div key={`ub-${i}`} className={`${styles.featureRow} ${styles.featureRowHighlightB}`}>
                                            <div className={styles.featureLabel}>{feat}</div>
                                            <div className={styles.checkContainer}><X size={20} color="var(--text-muted-op)" /></div>
                                            <div className={styles.checkContainer}><CheckCircle2 size={20} color="var(--success)" /></div>
                                        </div>
                                    ))}

                                    {results?.sharedFeatures?.map((feat, i) => (
                                        <div key={`sh-${i}`} className={styles.featureRow}>
                                            <div className={styles.featureLabel}>{feat}</div>
                                            <div className={styles.checkContainer}><CheckCircle2 size={20} color="var(--secondary)" /></div>
                                            <div className={styles.checkContainer}><CheckCircle2 size={20} color="var(--secondary)" /></div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>


                        {/* 📊 Section 2: Predictive Cost Scaling (TCO) */}
                        <div className={styles.tcoSection}>
                            <div className={styles.tcoHeader}>
                                <Calculator size={20} color="var(--secondary)" />
                                <h4>{content?.tco?.title}</h4>
                            </div>
                            <p className={styles.tcoDesc}>{aiResults ? aiResults.pricing_analysis : content?.tco?.desc}</p>

                            <div className={styles.sliderContainer}>
                                <div className={styles.sliderLabelRow}>
                                    <span className={styles.sliderLabel}><Users size={14} /> Team Members</span>
                                    <div className={styles.teamSizeBadge}>{teamSize} Members</div>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={teamSize}
                                    onChange={(e) => setTeamSize(parseInt(e.target.value))}
                                    className={styles.tcoSlider}
                                />
                            </div>

                            <div className={styles.tcoResults}>
                                <div className={styles.tcoResultCard}>
                                    <div className={styles.tcoLabel}>{tool1?.name} EST.</div>
                                    <div className={styles.tcoValue} style={{ '--tco-color': 'var(--secondary)' }}>
                                        ${calculateTCO(results?.factor1, teamSize)}<span>/yr</span>
                                    </div>
                                </div>
                                <div className={styles.tcoResultCard}>
                                    <div className={styles.tcoLabel}>{tool2?.name} EST.</div>
                                    <div className={styles.tcoValue} style={{ '--tco-color': 'var(--success)' }}>
                                        ${calculateTCO(results?.factor2, teamSize)}<span>/yr</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Safeguard>
    );
};

export default ComparisonMatrix;
