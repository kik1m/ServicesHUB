'use client';
import React, { useRef } from 'react';
import styles from './AIFloatingButton.module.css';

const AIFloatingButton = ({ onClick }) => {
    const buttonRef = useRef(null);

    // Track mouse for the CSS glow mask
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
            <button
                ref={buttonRef}
                className={styles.aiButton}
                onClick={onClick}
                onMouseMove={handleMouseMove}
            >
                <div className={styles.content}>
                    <span>AI STUDIO</span>
                </div>
            </button>
        </div>
    );
};

export default AIFloatingButton;
