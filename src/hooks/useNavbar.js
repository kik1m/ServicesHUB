import { useState, useEffect, useCallback } from 'react';

/**
 * 🚀 Elite Navbar Hook
 * Rule #1: Logic Isolation
 * Rule #2: Unified State Management
 */
export const useNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null); // 'more' | 'notifications' | 'account' | null
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // 1. Scroll Detection (Glassmorphic trigger)
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 2. Exclusive Dropdown Management
    const toggleDropdown = useCallback((id) => {
        setActiveDropdown(prev => prev === id ? null : id);
    }, []);

    const closeAll = useCallback(() => {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
    }, []);

    // 3. Body Scroll Lock (Elite implementation)
    useEffect(() => {
        if (isMobileMenuOpen) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isMobileMenuOpen]);

    return {
        isScrolled,
        activeDropdown,
        toggleDropdown,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        closeAll
    };
};
