import React from 'react';
import { Globe, Brain, Sparkles } from 'lucide-react';
import styles from './TypingIndicator.module.css';

export default function TypingIndicator({ phase }) {
    let isCustomPhase = phase && phase.startsWith('Executing:');
    let displayIcon, displayText, displayCls;

    if (isCustomPhase) {
        displayIcon = <Sparkles size={12} />;
        displayText = phase.replace('Executing:', '🚀 Executing: ').replace(/_/g, ' ') + '...';
        displayCls = styles.phaseThink;
    } else {
        const labels = {
            searching: { icon: <Globe size={12} />, text: 'Searching the web...', cls: styles.phaseSearch },
            thinking:  { icon: <Brain size={12} />, text: 'Analyzing...', cls: styles.phaseThink },
            typing:    { icon: <Sparkles size={12} />, text: 'Generating response...', cls: styles.phaseType },
        };
        const selected = labels[phase] || labels.typing;
        displayIcon = selected.icon;
        displayText = selected.text;
        displayCls = selected.cls;
    }

    return (
        <div className={styles.typingIndicator} translate="no">
            <div className={`${styles.phaseChip} ${displayCls}`}>
                {displayIcon}
                <span>{displayText}</span>
            </div>
            <div className={styles.dotRow}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
            </div>
        </div>
    );
}
