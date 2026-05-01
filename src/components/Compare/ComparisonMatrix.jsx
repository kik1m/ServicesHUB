import React from 'react';
import { CheckCircle2, Trophy, Info, Calculator, Sparkles, BrainCircuit, ShieldCheck, Target } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ComparisonMatrix.module.css';

/**
 * ComparisonMatrix - Elite v5.0 (Pure AI Version)
 * Legacy engine removed. 100% powered by AI strategic analysis.
 */
const ComparisonMatrix = ({ tool1, tool2, isLoading, isTool1Loading, isTool2Loading, isAiLoading, aiResults, aiError, error, onRetry, content }) => {
    const [loadingMessageIndex, setLoadingMessageIndex] = React.useState(0);

    // Derive winner from AI verdict only — no legacy scoring engine
    const aiWinner = aiResults?.verdict?.winner;
    const tool1IsWinner = !!(aiResults && tool1?.name && aiWinner === tool1.name);
    const tool2IsWinner = !!(aiResults && tool2?.name && aiWinner === tool2.name);

    // Lightweight display score: local fallback during AI loading
    const calculateDisplayScore = (tool) => {
        if (!tool) return 0;
        let score = Math.round(((parseFloat(tool?.rating) || 0) / 5) * 55);
        if (tool?.is_verified) score += 20;
        const r = tool?.reviews_count || 0;
        if (r > 500) score += 25;
        else if (r > 100) score += 15;
        else if (r > 10) score += 10;
        else score += 5;
        return Math.min(score, 100);
    };

    // Prefer AI scores (contextual & strategic) — fall back to local scores during loading
    const aiScore1 = aiResults?.scores?.tool1;
    const aiScore2 = aiResults?.scores?.tool2;
    const score1 = (aiScore1 != null) ? aiScore1 : calculateDisplayScore(tool1);
    const score2 = (aiScore2 != null) ? aiScore2 : calculateDisplayScore(tool2);

    // Winner: AI verdict takes priority, then score comparison
    const displayWinner = tool1IsWinner ? 1 : tool2IsWinner ? 2 : (score1 > score2 ? 1 : score1 < score2 ? 2 : 0);
    const isScoreFromAI = aiScore1 != null && aiScore2 != null;

    // Fallback Matrix: Basic feature comparison when AI is unavailable or failing
    const fallbackMatrix = React.useMemo(() => {
        if (!tool1 || !tool2) return null;
        
        const f1 = tool1.features || [];
        const f2 = tool2.features || [];
        const uniqueTo1 = f1.filter(f => !f2.includes(f));
        const uniqueTo2 = f2.filter(f => !f1.includes(f));
        const shared = f1.filter(f => f2.includes(f));
        
        const combined = [...uniqueTo1.slice(0, 2), ...uniqueTo2.slice(0, 2), ...shared.slice(0, 1)];
        while (combined.length < 5 && (f1.length > 0 || f2.length > 0)) {
            const nextFeat = [...f1, ...f2].find(f => !combined.includes(f));
            if (!nextFeat) break;
            combined.push(nextFeat);
        }

        if (combined.length === 0) return null;

        return combined.map(feat => {
            const has1 = f1.includes(feat);
            const has2 = f2.includes(feat);
            return {
                feature: feat,
                tool1_value: has1 ? "Available" : "Not Supported",
                tool2_value: has2 ? "Available" : "Not Supported",
                winner: (has1 && !has2) ? 1 : (has2 && !has1) ? 2 : 0,
                insight: "Standard Database Feature"
            };
        });
    }, [tool1, tool2]);

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
                                    <div
                                        className={`${styles.scoreRing} ${(tool1IsWinner || displayWinner === 1) ? styles.winnerRing : ''}`}
                                        style={{ '--score': `${score1}%`, '--score-color': (tool1IsWinner || displayWinner === 1) ? 'var(--success)' : 'var(--secondary)' }}
                                    >
                                        <div className={styles.scoreInner}>
                                            <span className={styles.scoreNumber}>{score1}</span>
                                            <span className={styles.scoreLabel}>SCORE</span>
                                        </div>
                                    </div>
                                )}
                                <h4 className={styles.toolScoreName}>{isTool1Loading ? <Skeleton width="100px" height="20px" /> : tool1?.name}</h4>
                                {isScoreFromAI && !isTool1Loading && <span className={styles.aiScoreBadge}>AI SCORE</span>}
                            </div>

                            <div className={styles.verdictCenter}>
                                <div className={styles.matrixTitle}>
                                    {isAiLoading ? (
                                        <div className={styles.aiLoadingBadge}>
                                            <BrainCircuit size={14} />
                                            <span>AI ANALYZING</span>
                                        </div>
                                    ) : (aiResults ? 'AI Expert Verdict' : 'Awaiting Analysis')}
                                </div>
                                <div className={styles.verdictText}>
                                    {isAiLoading ? (
                                        <div className={styles.aiSkeletonStack}>
                                            <Skeleton width="80%" height="14px" style={{ marginBottom: '8px' }} />
                                            <Skeleton width="60%" height="14px" />
                                        </div>
                                    ) : (
                                        aiResults?.verdict?.reasoning || null
                                    )}
                                </div>
                                {!isAiLoading && aiResults && (
                                    <div className={styles.winnerHighlight}>
                                        <Trophy size={18} />
                                        <span>{aiResults.verdict?.winner} - DOMINANT CHOICE</span>
                                    </div>
                                )}
                            </div>

                            <div className={styles.scoreBox}>
                                {isTool2Loading || !tool2 ? (
                                    <Skeleton width="120px" height="120px" borderRadius="50%" />
                                ) : (
                                    <div
                                        className={`${styles.scoreRing} ${(tool2IsWinner || displayWinner === 2) ? styles.winnerRing : ''}`}
                                        style={{ '--score': `${score2}%`, '--score-color': (tool2IsWinner || displayWinner === 2) ? 'var(--success)' : 'var(--secondary)' }}
                                    >
                                        <div className={styles.scoreInner}>
                                            <span className={styles.scoreNumber}>{score2}</span>
                                            <span className={styles.scoreLabel}>SCORE</span>
                                        </div>
                                    </div>
                                )}
                                <h4 className={styles.toolScoreName}>{isTool2Loading ? <Skeleton width="100px" height="20px" /> : tool2?.name}</h4>
                                {isScoreFromAI && !isTool2Loading && <span className={styles.aiScoreBadge}>AI SCORE</span>}
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
                            ) : fallbackMatrix ? (
                                fallbackMatrix.map((row, i) => (
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
                                <div className={styles.noAiData}>
                                    <BrainCircuit size={36} className={styles.noAiIcon} />
                                    <p>Select both tools to generate analysis.</p>
                                </div>
                            )}
                        </div>


                        {/* 📊 Section 2: AI Pricing Analysis */}
                        {aiResults && (
                            <div className={styles.tcoSection}>
                                <div className={styles.tcoHeader}>
                                    <Calculator size={20} color="var(--secondary)" />
                                    <h4>{content?.tco?.title || 'Pricing Analysis'}</h4>
                                </div>
                                <p className={styles.tcoDesc}>{aiResults.pricing_analysis}</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Safeguard>
    );
};

export default ComparisonMatrix;
