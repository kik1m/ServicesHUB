import { useState, useEffect, useCallback } from 'react';
import { compareService } from '../services/compareService';

/**
 * Hook for managing comparison page state and logic
 */
export const useCompareData = () => {
    const [tool1, setTool1] = useState(null);
    const [tool2, setTool2] = useState(null);
    const [isSelectingFor, setIsSelectingFor] = useState(null); // 'tool1' | 'tool2'
    const [searchQuery, setSearchQuery] = useState('');
    const [availableTools, setAvailableTools] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch tools for the selection modal with a slight debounce effect
    useEffect(() => {
        if (!isSelectingFor) return;

        const fetchTools = async () => {
            setLoading(true);
            setError(null);
            
            const { data, error: fetchError } = await compareService.searchTools(searchQuery);
            
            if (fetchError) {
                setError('Failed to load tools. Please try again.');
            } else {
                setAvailableTools(data || []);
            }
            setLoading(false);
        };

        const timer = setTimeout(fetchTools, 300);
        return () => clearTimeout(timer);
    }, [isSelectingFor, searchQuery]);

    const handleSelect = useCallback((tool) => {
        if (isSelectingFor === 'tool1') setTool1(tool);
        if (isSelectingFor === 'tool2') setTool2(tool);
        setIsSelectingFor(null);
        setSearchQuery('');
    }, [isSelectingFor]);

    const clearTool = useCallback((slot) => {
        if (slot === 'tool1') setTool1(null);
        if (slot === 'tool2') setTool2(null);
    }, []);

    const resetComparison = useCallback(() => {
        setTool1(null);
        setTool2(null);
    }, []);

    const openSelector = useCallback((slot) => {
        setIsSelectingFor(slot);
    }, []);

    const closeSelector = useCallback(() => {
        setIsSelectingFor(null);
        setSearchQuery('');
    }, []);

    return {
        tool1,
        setTool1,
        tool2,
        setTool2,
        isSelectingFor,
        setIsSelectingFor,
        searchQuery,
        setSearchQuery,
        availableTools,
        loading,
        error,
        handleSelect,
        clearTool,
        resetComparison,
        openSelector,
        closeSelector
    };
};
