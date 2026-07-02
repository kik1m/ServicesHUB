import React from 'react';
import { Globe, Brain, Sparkles, Cpu, Database } from 'lucide-react';
import styles from './TypingIndicator.module.css';

const PHASE_CONFIG = {
    searching: {
        icon: <Globe size={12} />,
        text: 'Searching the web...',
        cls: 'phaseSearch',
    },
    thinking: {
        icon: <Brain size={12} />,
        text: 'Analyzing...',
        cls: 'phaseThink',
    },
    typing: {
        icon: <Sparkles size={12} />,
        text: 'Generating response...',
        cls: 'phaseType',
    },
    building: {
        icon: <Cpu size={12} />,
        text: 'Building visual...',
        cls: 'phaseType',
    },
    database: {
        icon: <Database size={12} />,
        text: 'Fetching data...',
        cls: 'phaseThink',
    },
};

export default function TypingIndicator({ phase }) {
    let config;

    if (phase && phase.startsWith('Executing:')) {
        const toolName = phase.replace('Executing:', '').replace(/_/g, ' ').trim();
        // Map tool names to better labels
        const isSearch = toolName.includes('search') || toolName.includes('market') || toolName.includes('external');
        const isDB = toolName.includes('table') || toolName.includes('admin') || toolName.includes('tool');
        config = {
            icon: isSearch ? <Globe size={12} /> : isDB ? <Database size={12} /> : <Sparkles size={12} />,
            text: isSearch
                ? 'Searching the web...'
                : isDB
                ? `Fetching ${toolName.replace('get_', '').replace(/_/g, ' ')}...`
                : `Running ${toolName}...`,
            cls: isSearch ? 'phaseSearch' : 'phaseThink',
        };
    } else {
        config = PHASE_CONFIG[phase] || PHASE_CONFIG.typing;
    }

    return (
        <div className={styles.typingIndicator} translate="no">
            <div className={`${styles.phaseChip} ${styles[config.cls]}`}>
                {config.icon}
                <span>{config.text}</span>
            </div>
            <div className={styles.dotRow}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
            </div>
        </div>
    );
}
