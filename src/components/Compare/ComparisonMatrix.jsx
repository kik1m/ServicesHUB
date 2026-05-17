'use client';
import React from 'react';
import { Info } from 'lucide-react';
import Safeguard from '../ui/Safeguard';
import styles from './ComparisonMatrix.module.css';

// 🛡️ ELITE ARCHITECTURE: Import Sub-components
import MatrixVerdict from './Matrix/MatrixVerdict';
import MatrixInsights from './Matrix/MatrixInsights';
import MatrixFeatures from './Matrix/MatrixFeatures';
import MatrixPricing from './Matrix/MatrixPricing';

// 🧠 ELITE ARCHITECTURE: Import Logic Hook
import { useComparisonMatrix } from '../../hooks/useComparisonMatrix';

/**
 * ComparisonMatrix - Elite v6.0 (Modular Orchestrator)
 * 100% powered by AI strategic analysis.
 * Refactored for extreme maintainability and mobile parity.
 */
const ComparisonMatrix = ({ tool1, tool2, isLoading, isTool1Loading, isTool2Loading, isAiLoading, aiResults, aiError, error, onRetry, content }) => {

    // 🛡️ Logic Isolation: All state, calculations, and effects moved to custom hook
    const {
        activeTab,
        setActiveTab,
        loadingMessage,
        tool1IsWinner,
        tool2IsWinner,
        score1,
        score2,
        displayWinner,
        isScoreFromAI,
        fallbackMatrix
    } = useComparisonMatrix(tool1, tool2, isAiLoading, aiResults);

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
                    <div className={styles.container}>
                        {/* 📱 Mobile Tool Switcher: 1:1 Parity with legacy optimization */}
                        <div className={styles.mobileSwitcherContainer}>
                            <button
                                className={`${styles.switcherBtn} ${activeTab === 1 ? styles.activeSwitcher : ''}`}
                                onClick={() => setActiveTab(1)}
                            >
                                <div className={styles.switcherDot} style={{ background: 'var(--secondary)' }}></div>
                                <span>{tool1?.name || 'Tool 1'}</span>
                            </button>
                            <button
                                className={`${styles.switcherBtn} ${activeTab === 2 ? styles.activeSwitcher : ''}`}
                                onClick={() => setActiveTab(2)}
                            >
                                <div className={styles.switcherDot} style={{ background: 'var(--success)' }}></div>
                                <span>{tool2?.name || 'Tool 2'}</span>
                            </button>
                        </div>

                        <div className={styles.matrixContent}>
                            {/* 🧠 Section 0: AI Strategic Analysis */}
                            <MatrixInsights
                                tool1={tool1}
                                tool2={tool2}
                                isAiLoading={isAiLoading}
                                aiResults={aiResults}
                                aiError={aiError}
                                activeTab={activeTab}
                                loadingMessage={loadingMessage}
                            />

                            {/* 🏆 Section 1: Ultimate Verdict Dashboard */}
                            <MatrixVerdict
                                tool1={tool1}
                                tool2={tool2}
                                isTool1Loading={isTool1Loading}
                                isTool2Loading={isTool2Loading}
                                isAiLoading={isAiLoading}
                                aiResults={aiResults}
                                score1={score1}
                                score2={score2}
                                tool1IsWinner={tool1IsWinner}
                                tool2IsWinner={tool2IsWinner}
                                displayWinner={displayWinner}
                                isScoreFromAI={isScoreFromAI}
                                activeTab={activeTab}
                            />

                            {/* 🛠️ Section 2: Feature Matrix */}
                            <MatrixFeatures
                                tool1={tool1}
                                tool2={tool2}
                                isAiLoading={isAiLoading}
                                aiResults={aiResults}
                                fallbackMatrix={fallbackMatrix}
                                activeTab={activeTab}
                                tool1IsWinner={tool1IsWinner}
                                tool2IsWinner={tool2IsWinner}
                                headers={headers}
                            />
                        </div>

                        {/* 📊 Section 3: AI Pricing Analysis */}
                        <MatrixPricing
                            aiResults={aiResults}
                            content={content}
                        />
                    </div>
                )}
            </div>
        </Safeguard>
    );
};

export default ComparisonMatrix;
