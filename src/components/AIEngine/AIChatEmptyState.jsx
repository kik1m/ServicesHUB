import React from 'react';
import Image from 'next/image';
import Skeleton from '../ui/Skeleton';
import { AI_ENGINE_CONSTANTS } from '../../constants/aiEngineConstants';
import styles from './AIChatEmptyState.module.css';

export default function AIChatEmptyState({ isGeneratingSuggestions, suggestions, sendMessage, isCompareMode }) {
    return (
        <div className={styles.emptyState}>
            <div className={styles.emptyGlow} />
            <Image src="/logo.png" alt={AI_ENGINE_CONSTANTS.emptyState.title} width={64} height={64} className={styles.botIcon} />
            <h3>{AI_ENGINE_CONSTANTS.emptyState.title}</h3>
            
            {isCompareMode ? (
                <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '400px', margin: '1rem auto 0' }}>
                    Ask HUBly AI anything about this comparison. Get personalized recommendations and deep insights based on your specific use case.
                </div>
            ) : (
                <div className={styles.suggestionsContainer}>
                    {isGeneratingSuggestions ? (
                        <>
                            <Skeleton width="100%" height="42px" borderRadius="12px" />
                            <Skeleton width="100%" height="42px" borderRadius="12px" />
                            <Skeleton width="100%" height="42px" borderRadius="12px" />
                        </>
                    ) : suggestions && suggestions.length > 0 ? (
                        suggestions.map((suggestion, idx) => (
                            <button 
                                key={idx} 
                                className={styles.suggestionBtn}
                                onClick={() => sendMessage(null, suggestion)}
                            >
                                {suggestion}
                            </button>
                        ))
                    ) : null}
                </div>
            )}
        </div>
    );
}
