import React from 'react';
import Safeguard from './ui/Safeguard';

/**
 * Global ErrorBoundary - Elite Root Safety Net
 * Now refactored to use the unified Safeguard system.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Here we could log to an external service like Sentry
        console.error("Critical Platform Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Safeguard 
                    fullPage 
                    title="Critical Error"
                    error="We've encountered a platform-wide technical issue. Please reload the page."
                    onRetry={() => window.location.reload()}
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
