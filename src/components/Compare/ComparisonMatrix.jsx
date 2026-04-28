import React, { useState } from 'react';
import { X, Star, CheckCircle2, Trophy, Info, Users, Calculator, Sparkles } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ComparisonMatrix.module.css';

/**
 * ComparisonMatrix - Elite v3.1 (Unified Branding)
 * Feature: Unified Check Icons (CheckCircle2) across all sections.
 */
const ComparisonMatrix = ({ tool1, tool2, isLoading, error, onRetry, results, content }) => {
    const [teamSize, setTeamSize] = useState(10);

    const headers = content?.headers || { feature: "Feature", tool1: "Tool 1", tool2: "Tool 2" };
    const features = content?.features || { rating: "Rating", pricing: "Pricing" };

    const calculateTCO = (factor, size) => {
        if (!factor) return '0';
        return (factor * size).toLocaleString();
    };

    return (
        <Safeguard error={error} onRetry={onRetry} title="Comparison Analysis Offline">
        <div className={styles.matrixWrapper}>
            {isLoading ? (
                <div className={styles.skeletonArea}>
                    <Skeleton className={styles.skeletonMatrixHeader} />
                    <Skeleton height="150px" borderRadius="32px" style={{ marginBottom: '2rem' }} />
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className={styles.featureRow}>
                            <Skeleton width="40%" height="20px" />
                            <Skeleton width="20%" height="20px" />
                            <Skeleton width="20%" height="20px" />
                        </div>
                    ))}
                </div>
            ) : (!tool1 || !tool2) ? (
                <div className={styles.emptyMatrix}>
                    <Info size={40} className={styles.emptyMatrixIcon} />
                    <p>{content?.sections?.empty?.title || "Hydrate tool slots to begin deep analytical comparison."}</p>
                </div>
            ) : (
                <>
                    {/* 🏆 Section 1: Ultimate Verdict Dashboard */}
                    <div className={styles.verdictContainer}>
                        <div className={styles.scoreBox}>
                            <div className={`${styles.scoreRing} ${results?.overallWinner === 1 ? styles.winnerRing : ''}`} style={{ '--score': `${results?.score1}%`, '--score-color': results?.overallWinner === 1 ? 'var(--success)' : 'var(--secondary)' }}>
                                <div className={styles.scoreInner}>
                                    <span className={styles.scoreNumber}>{results?.score1}</span>
                                    <span className={styles.scoreLabel}>SCORE</span>
                                </div>
                            </div>
                            <h4 className={styles.toolScoreName}>{tool1?.name}</h4>
                        </div>

                        <div className={styles.verdictCenter}>
                            <div className={styles.matrixTitle}>
                                {results?.overallWinner === 0 ? "It's a Tie!" : "Ultimate Verdict"}
                            </div>
                            <p className={styles.verdictText}>
                                {results?.overallWinner === 1 ? `${tool1?.name} ${content?.verdict?.winnerSuffix}` : 
                                 results?.overallWinner === 2 ? `${tool2?.name} ${content?.verdict?.winnerSuffix}` :
                                 content?.verdict?.draw}
                            </p>
                            {results?.overallWinner !== 0 && (
                                <div className={styles.winnerHighlight}>
                                    <Trophy size={18} />
                                    <span>{results?.overallWinner === 1 ? tool1?.name : tool2?.name} - DOMINANT CHOICE</span>
                                </div>
                            )}
                        </div>

                        <div className={styles.scoreBox}>
                            <div className={`${styles.scoreRing} ${results?.overallWinner === 2 ? styles.winnerRing : ''}`} style={{ '--score': `${results?.score2}%`, '--score-color': results?.overallWinner === 2 ? 'var(--success)' : 'var(--secondary)' }}>
                                <div className={styles.scoreInner}>
                                    <span className={styles.scoreNumber}>{results?.score2}</span>
                                    <span className={styles.scoreLabel}>SCORE</span>
                                </div>
                            </div>
                            <h4 className={styles.toolScoreName}>{tool2?.name}</h4>
                        </div>
                    </div>

                    {/* 📊 Section 2: Predictive Cost Scaling (TCO) */}
                    <div className={styles.tcoSection}>
                        <div className={styles.tcoHeader}>
                            <Calculator size={20} color="var(--secondary)" />
                            <h4>{content?.tco?.title}</h4>
                        </div>
                        <p className={styles.tcoDesc}>{content?.tco?.desc}</p>
                        
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
                            <div className={styles.sliderMarks}>
                                <span>SOLO</span>
                                <span>MID-SIZE</span>
                                <span>ENTERPRISE</span>
                            </div>
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

                    {/* 🛠️ Section 3: Feature Matrix */}
                    <div className={styles.matrixSectionHeader}>
                        <Sparkles size={16} />
                        <span>CAPABILITY ANALYSIS</span>
                    </div>

                    <div className={styles.featuresGrid}>
                        <div className={`${styles.featureRow} ${styles.headerRowActive}`}>
                            <div className={styles.featureLabel}>{headers?.feature}</div>
                            <div className={styles.checkContainer}><strong>{tool1?.name}</strong></div>
                            <div className={styles.checkContainer}><strong>{tool2?.name}</strong></div>
                        </div>

                        {/* Ratings & Trust */}
                        <div className={styles.featureRow}>
                            <div className={styles.featureLabel}>{features?.rating}</div>
                            <div className={styles.checkContainer}>
                                <div className={styles.ratingCell}>
                                    <Star size={16} fill="var(--warning)" color="var(--warning)" />
                                    <span>{tool1?.average_rating?.toFixed(1) || '5.0'}</span>
                                </div>
                            </div>
                            <div className={styles.checkContainer}>
                                <div className={styles.ratingCell}>
                                    <Star size={16} fill="var(--warning)" color="var(--warning)" />
                                    <span>{tool2?.average_rating?.toFixed(1) || '5.0'}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.featureRow}>
                            <div className={styles.featureLabel}>{features?.verified || "Trust Verified"}</div>
                            <div className={styles.checkContainer}>
                                {tool1?.is_verified ? <CheckCircle2 size={20} color="var(--secondary)" /> : <X size={20} color="var(--text-muted-op)" />}
                            </div>
                            <div className={styles.checkContainer}>
                                {tool2?.is_verified ? <CheckCircle2 size={20} color="var(--secondary)" /> : <X size={20} color="var(--text-muted-op)" />}
                            </div>
                        </div>

                        {/* Capability Segmentation - Using Unified CheckCircle2 */}
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
                    </div>

                    {/* 📝 Section 4: Side-by-Side Context */}
                    <div className={styles.descriptionGrid}>
                        <div className={styles.descriptionBox}>
                            <h4>Overview: {tool1?.name}</h4>
                            <p className={styles.descriptionText}>{tool1?.description}</p>
                        </div>
                        <div className={styles.descriptionBox}>
                            <h4>Overview: {tool2?.name}</h4>
                            <p className={styles.descriptionText}>{tool2?.description}</p>
                        </div>
                    </div>
                </>
            )}
        </div>
        </Safeguard>
    );
};

export default ComparisonMatrix;
