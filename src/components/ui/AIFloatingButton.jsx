'use client';
import React, { useRef } from 'react';
import { Sparkles } from 'lucide-react';
import styles from './AIFloatingButton.module.css';

const AIFloatingButton = ({ onClick }) => {
    const buttonRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        buttonRef.current.style.setProperty('--mouse-x', `${x}px`);
        buttonRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <div className={styles.floatingWrapper}>
            {/* Dynamic ambient backdrop aura */}
            <div className={styles.ambientAura} aria-hidden="true" />

            <button
                ref={buttonRef}
                className={styles.aiButton}
                onClick={onClick}
                onMouseMove={handleMouseMove}
                aria-label="Open AI Studio"
            >
                {/* Glowing border overlay */}
                <span className={styles.borderGlow} aria-hidden="true" />
                
                {/* Shimmer light beam */}
                <span className={styles.shimmer} aria-hidden="true" />

                {/* Interactive cursor-tracking light */}
                <span className={styles.mouseGlow} aria-hidden="true" />

                <div className={styles.content}>
                    {/* Standalone Sparkles Icon */}
                    <Sparkles size={17} className={styles.sparkleIcon} />

                    <span className={styles.label}>AI Studio</span>
                </div>
            </button>
        </div>
    );
};

export default AIFloatingButton;
