import { useEffect } from 'react';

/**
 * Hook to lock body scroll when a modal or overlay is open
 */
export const useLockBodyScroll = (lock = true) => {
    useEffect(() => {
        if (!lock) return;

        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalStyle;
            document.documentElement.style.overflow = originalStyle;
        };
    }, [lock]);
};

export default useLockBodyScroll;
