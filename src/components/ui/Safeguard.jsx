import React from 'react';
import ErrorState from './ErrorState';
import styles from './Safeguard.module.css';

/**
 * 🛡️ Safeguard - Elite Unified Error Shield (v1.0)
 * Hybrid Architecture: Handles JS crashes (Boundary) + API errors (Props)
 * Rule #16: Pure Orchestration Pattern
 */
class ErrorBoundaryInner extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Safeguard caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className={styles.boundaryError}>
                    <ErrorState 
                        title="Component Failed"
                        message="A technical error occurred in this section."
                        onRetry={() => this.setState({ hasError: false })}
                    />
                </div>
            );
        }
        return this.props.children;
    }
}

const Safeguard = ({ 
    children, 
    error, 
    onRetry, 
    loading, 
    skeleton,
    title,
    fullPage = false 
}) => {
    // 1. Handle API Error State (Manual)
    if (error) {
        // Rule #29.5: Safe Error Extraction
        const displayMessage = typeof error === 'string' 
            ? error 
            : (error.message || "An unexpected data error occurred.");

        return (
            <div className={fullPage ? styles.fullPage : styles.safeguardContainer}>
                <ErrorState 
                    title={title || "Section Error"}
                    message={displayMessage}
                    onRetry={onRetry}
                    fullPage={fullPage}
                />
            </div>
        );
    }

    // 2. Handle Loading State (Optional - Integrated UX)
    if (loading && skeleton) {
        return <>{skeleton}</>;
    }

    // 3. Wrap Children in Boundary (Automatic JS Crash Protection)
    return (
        <ErrorBoundaryInner>
            {children}
        </ErrorBoundaryInner>
    );
};

export default Safeguard;
