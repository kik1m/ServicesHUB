import React from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--bg-dark)',
                    padding: '2rem',
                    textAlign: 'center',
                    fontFamily: 'var(--font-main)'
                }}>
                    <div className="glass-card" style={{ maxWidth: '500px', padding: '3rem' }}>
                        <div style={{ 
                            width: '80px', height: '80px', background: 'rgba(255, 80, 80, 0.1)', 
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.5rem', border: '1px solid rgba(255, 80, 80, 0.2)'
                        }}>
                            <AlertCircle size={40} color="#ff5050" />
                        </div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: '800' }}>Oops! Something <span className="gradient-text">went wrong</span></h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
                            We encountered an unexpected error. Don&apos;t worry, our team has been notified.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <RefreshCcw size={18} /> Reload Page
                            </button>
                            <Link 
                                to="/" 
                                className="btn-secondary"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                                onClick={() => this.setState({ hasError: false })}
                            >
                                <Home size={18} /> Go Home
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
