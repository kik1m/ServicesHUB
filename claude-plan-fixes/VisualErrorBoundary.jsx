'use client';
import React from 'react';

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
                <div style={{
                    padding: '20px',
                    margin: '12px 0',
                    border: '1px solid rgba(239,68,68,0.2)',
                    background: 'rgba(239,68,68,0.04)',
                    borderRadius: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                        <span style={{ fontWeight: 700, color: '#ef4444', fontSize: '14px' }}>
                            Visual component failed to render
                        </span>
                    </div>

                    <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                        The AI generated a component with a rendering issue. You can retry or continue the conversation.
                    </p>

                    {this.state.error?.message && (
                        <code style={{
                            display: 'block', fontSize: '11px', color: '#64748b',
                            background: 'rgba(0,0,0,0.3)', padding: '8px 12px',
                            borderRadius: '8px', fontFamily: 'monospace',
                            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                        }}>
                            {this.state.error.message.slice(0, 150)}
                        </code>
                    )}

                    <button
                        onClick={this.handleRetry}
                        style={{
                            alignSelf: 'flex-start',
                            padding: '7px 16px',
                            color: '#00d2ff',
                            background: 'rgba(0,210,255,0.08)',
                            border: '1px solid rgba(0,210,255,0.25)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 600,
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}
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
