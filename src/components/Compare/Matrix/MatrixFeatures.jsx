import React from 'react';
import { Sparkles, ShieldCheck, BrainCircuit } from 'lucide-react';
import Skeleton from '../../ui/Skeleton';
import { parseInlineMarkdown } from './MatrixUtils';
import styles from './MatrixFeatures.module.css';

const MatrixFeatures = ({ 
    tool1, 
    tool2, 
    isAiLoading, 
    aiResults, 
    fallbackMatrix, 
    activeTab, 
    tool1IsWinner, 
    tool2IsWinner, 
    headers 
}) => {
    return (
        <>
            <div className={styles.matrixSectionHeader}>
                <Sparkles size={16} />
                <span>{aiResults ? "AI COMPARATIVE DIMENSIONS" : "CAPABILITY ANALYSIS"}</span>
            </div>

            <div className={styles.featuresGrid}>
                {/* Header Row */}
                <div className={`${styles.featureRow} ${styles.headerRowActive}`}>
                    <div className={styles.featureLabel}>{headers?.feature}</div>
                    <div className={`${styles.checkContainer} ${activeTab === 2 ? styles.hideOnMobile : ''}`}>
                        <strong className={tool1IsWinner ? styles.winnerName : styles.otherName}>
                            {tool1?.name}
                        </strong>
                    </div>
                    <div className={`${styles.checkContainer} ${activeTab === 1 ? styles.hideOnMobile : ''}`}>
                        <strong className={tool2IsWinner ? styles.winnerName : styles.otherName}>
                            {tool2?.name}
                        </strong>
                    </div>
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
                            {/* Feature label: full width on top */}
                            <div className={styles.featureLabel}>
                                <div className={styles.aiLabelTitle}>{row.feature}</div>
                                <div className={styles.aiLabelInsight}>{parseInlineMarkdown(row.insight)}</div>
                            </div>
                            {/* Values: side by side below */}
                            <div className={styles.valuesRow}>
                                <div className={`${styles.checkContainer} ${activeTab === 2 ? styles.hideOnMobile : ''}`}>
                                    <div className={`${row.winner === 1 ? styles.aiWinnerCell : ''}`}>
                                        <div className={styles.aiValue}>{row.tool1_value}</div>
                                        {row.winner === 1 && <ShieldCheck size={14} className={styles.winnerCheck} />}
                                    </div>
                                </div>
                                <div className={`${styles.checkContainer} ${activeTab === 1 ? styles.hideOnMobile : ''}`}>
                                    <div className={`${row.winner === 2 ? styles.aiWinnerCell : ''}`}>
                                        <div className={styles.aiValue}>{row.tool2_value}</div>
                                        {row.winner === 2 && <ShieldCheck size={14} className={styles.winnerCheck} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : fallbackMatrix ? (
                    fallbackMatrix.map((row, i) => (
                        <div key={i} className={styles.aiFeatureRow}>
                            <div className={styles.featureLabel}>
                                <div className={styles.aiLabelTitle}>{row.feature}</div>
                                <div className={styles.aiLabelInsight}>{parseInlineMarkdown(row.insight)}</div>
                            </div>
                            <div className={styles.valuesRow}>
                                <div className={`${styles.checkContainer} ${activeTab === 2 ? styles.hideOnMobile : ''}`}>
                                    <div className={`${row.winner === 1 ? styles.aiWinnerCell : ''}`}>
                                        <div className={styles.aiValue}>{row.tool1_value}</div>
                                        {row.winner === 1 && <ShieldCheck size={14} className={styles.winnerCheck} />}
                                    </div>
                                </div>
                                <div className={`${styles.checkContainer} ${activeTab === 1 ? styles.hideOnMobile : ''}`}>
                                    <div className={`${row.winner === 2 ? styles.aiWinnerCell : ''}`}>
                                        <div className={styles.aiValue}>{row.tool2_value}</div>
                                        {row.winner === 2 && <ShieldCheck size={14} className={styles.winnerCheck} />}
                                    </div>
                                </div>
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
        </>
    );
};

export default MatrixFeatures;
