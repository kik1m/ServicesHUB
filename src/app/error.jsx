'use client';

import React, { useEffect } from 'react';
import Button from '../components/ui/Button';
import { RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global App Error:', error);
    }, [error]);

    return (
        <div className="error-container">
            <div className="error-card glass-card">
                <div className="error-icon">⚠️</div>
                <h1>System Interrupted</h1>
                <p>An unexpected error occurred during the orchestration of your request.</p>
                
                {error?.message && (
                    <div className="error-details">
                        <code>{error.message}</code>
                    </div>
                )}

                <div className="error-actions">
                    <Button variant="primary" onClick={() => reset()} icon={RefreshCcw}>
                        Try Again
                    </Button>
                    <Link href="/">
                        <Button variant="secondary" icon={Home}>
                            Return Home
                        </Button>
                    </Link>
                </div>
            </div>

            <style jsx>{`
                .error-container {
                    min-height: 80vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }
                .error-card {
                    max-width: 500px;
                    width: 100%;
                    text-align: center;
                    padding: 3rem;
                    border-radius: 2rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .error-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }
                h1 {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                    color: var(--text-primary);
                }
                p {
                    color: var(--text-secondary);
                    margin-bottom: 2rem;
                }
                .error-details {
                    background: rgba(0, 0, 0, 0.3);
                    padding: 1rem;
                    border-radius: 0.5rem;
                    margin-bottom: 2rem;
                    text-align: left;
                    overflow-x: auto;
                }
                code {
                    color: #ff4444;
                    font-family: monospace;
                    font-size: 0.85rem;
                }
                .error-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
            `}</style>
        </div>
    );
}
