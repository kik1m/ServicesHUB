import React from 'react';
import { Trophy, BrainCircuit } from 'lucide-react';
import Skeleton from '../../ui/Skeleton';
import styles from './MatrixVerdict.module.css';
import { renderStructuredText } from './MatrixUtils';

const MatrixVerdict = ({ 
    tool1, 
    tool2, 
    isTool1Loading, 
    isTool2Loading, 
    isAiLoading, 
    aiResults, 
    score1, 
    score2, 
    tool1IsWinner, 
    tool2IsWinner, 
    displayWinner, 
    isScoreFromAI, 
    activeTab
}) => {
    return (
        <div className={styles.matrixScrollArea}>
            <div className={styles.verdictContainer}>
                {/* Tool 1 Score */}
                <div className={`${styles.scoreBox} ${activeTab === 2 ? styles.hideOnMobile : ''}`}>
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
                            {(tool1IsWinner || displayWinner === 1) && (
                                <div className={styles.matrixWinnerBadge}>
                                    <Trophy size={14} />
                                    <span>WINNER</span>
                                </div>
                            )}
                        </div>
                    )}
                    <h4 className={styles.toolScoreName}>{isTool1Loading ? <Skeleton width="100px" height="20px" /> : tool1?.name}</h4>
                    {isScoreFromAI && !isTool1Loading && <span className={styles.aiScoreBadge}>AI SCORE</span>}
                </div>

                {/* AI Verdict Text */}
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
                            renderStructuredText(aiResults?.verdict?.reasoning)
                        )}
                    </div>
                    {!isAiLoading && aiResults && (
                        <div className={`${styles.winnerHighlight} ${((activeTab === 1 && !tool1IsWinner) || (activeTab === 2 && !tool2IsWinner)) ? styles.hideOnMobile : ''}`}>
                            <Trophy size={18} />
                            <span>{aiResults.verdict?.winner} - DOMINANT CHOICE</span>
                        </div>
                    )}
                </div>

                {/* Tool 2 Score */}
                <div className={`${styles.scoreBox} ${activeTab === 1 ? styles.hideOnMobile : ''}`}>
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
                            {(tool2IsWinner || displayWinner === 2) && (
                                <div className={styles.matrixWinnerBadge}>
                                    <Trophy size={14} />
                                    <span>WINNER</span>
                                </div>
                            )}
                        </div>
                    )}
                    <h4 className={styles.toolScoreName}>{isTool2Loading ? <Skeleton width="100px" height="20px" /> : tool2?.name}</h4>
                    {isScoreFromAI && !isTool2Loading && <span className={styles.aiScoreBadge}>AI SCORE</span>}
                </div>
            </div>
        </div>
    );
};

export default MatrixVerdict;
