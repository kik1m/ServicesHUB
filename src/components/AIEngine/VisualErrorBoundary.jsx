'use client';
import React from 'react';
import styles from './VisualRenderer.module.css';

/**
 * VisualErrorBoundary
 * Standard error boundary for sandbox visual frames.
 * Displays user-friendly error with details and retry support.
 */
export default class VisualErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null, retryKey: 0 };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('[HUBly Visual] Render Error:', error?.message, errorInfo?.componentStack?.slice(0, 200));
        this.setState({ errorInfo });
    }

    handleRetry = () => {
        this.setState(prev => ({
            hasError: false,
            error: null,
            errorInfo: null,
            retryKey: prev.retryKey + 1,
        }));
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className={styles.errorBox}>
                    <div className={styles.errorHeader}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                        <span className={styles.errorTitle}>
                            Visual component failed to render
                        </span>
                    </div>

                    <p className={styles.errorMsg}>
                        The AI generated a component with a rendering issue. You can retry or continue the conversation.
                    </p>

                    {this.state.error?.message && (
                        <code className={styles.errorCode}>
                            {this.state.error.message.slice(0, 150)}
                        </code>
                    )}

                    <button
                        onClick={this.handleRetry}
                        className={styles.errorRetryBtn}
                    >
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0114.142 1.5M20 15a9 9 0 01-14.142-1.5" />
                        </svg>
                        Retry Render
                    </button>
                </div>
            );
        }

        return (
            <React.Fragment key={this.state.retryKey}>
                {this.props.children}
            </React.Fragment>
        );
    }
}
