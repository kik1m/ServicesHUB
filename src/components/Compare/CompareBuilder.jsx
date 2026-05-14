import React, { useMemo, useEffect, memo } from 'react';
import { X, ArrowRight, Zap } from 'lucide-react';
import { useSearchEngine } from '../../hooks/useSearchEngine';
import DirectorySidebar from '../Directory/DirectorySidebar';
import DirectoryResults from '../Directory/DirectoryResults';
import Button from '../ui/Button';
import Input from '../ui/Input';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';
import Safeguard from '../ui/Safeguard';
import { SEARCH_UI_CONSTANTS } from '../../constants/searchConstants';
import { COMPARE_UI_CONSTANTS } from '../../constants/compareConstants';
import styles from './CompareBuilder.module.css';

/**
 * 🚀 The Elite Compare Builder (Unified Engine Version)
 * Replaces the old popup with a Full-Screen, URL-Synchronized "Search Engine" Wizard.
 * Rule #16: Orchestrated via useSearchEngine
 */
const CompareBuilder = ({ isSelectingFor, tool1, tool2, onSelect, onClose, onClear, onSwitchStep }) => {
    
    // 1. Hook into the Unified Search Engine
    const {
        isLoading: isToolsLoading,
        error: toolsError,
        loadingMore,
        searchQuery,
        setQuery: setSearchQuery,
        selectedCategory,
        setCategory: setSelectedCategory,
        selectedPrice,
        setPrice: setSelectedPrice,
        sortBy,
        setSort: setSortBy,
        page,
        setPageNum: setPage,
        hasMore,
        results,
        categories,
        displayedCategories,
        hiddenCount,
        catSearchQuery,
        setCatSearchQuery,
        showAllCats,
        setShowAllCats,
        pricingModels,
        refresh: refetchTools
    } = useSearchEngine({ 
        mode: isSelectingFor === 'tool2' ? 'category' : 'full',
        fixedCategory: (isSelectingFor === 'tool2' && tool1?.categories?.name) ? tool1.categories.name : 'All',
        syncUrl: false,
        itemsPerPage: 12
    });

    // 🏆 Contextual Intelligence: If selecting Tool 2, default the category filter to Tool 1's category!
    useEffect(() => {
        if (isSelectingFor === 'tool2' && tool1?.categories?.name) {
            if (selectedCategory === 'All') {
                setSelectedCategory(tool1.categories.name);
            }
        }
    }, [isSelectingFor, tool1, selectedCategory, setSelectedCategory]);

    // Rule #11: Isolate scroll locking logic
    useLockBodyScroll(true);

    // 🧹 Elite Cleanup: Wipe search-related URL params on unmount
    useEffect(() => {
        return () => {
            const params = new URLSearchParams(window.location.search);
            const searchParamsToDelete = ['q', 'category', 'price', 'page', 'sort'];
            let changed = false;
            searchParamsToDelete.forEach(p => {
                if (params.has(p)) {
                    params.delete(p);
                    changed = true;
                }
            });
            if (changed) {
                window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
            }
        };
    }, []);

    const categoryFilter = useMemo(() => ({
        selectedCategory,
        setSelectedCategory,
        filteredCategories: categories
    }), [selectedCategory, setSelectedCategory, categories]);

    const pricingFilter = useMemo(() => ({
        pricingModels,
        selectedPrice,
        setSelectedPrice
    }), [pricingModels, selectedPrice, setSelectedPrice]);

    const wizardTitle = useMemo(() => isSelectingFor === 'tool1' 
        ? COMPARE_UI_CONSTANTS.wizard.step1
        : `${COMPARE_UI_CONSTANTS.wizard.step2} ${tool1?.name || 'Selected Tool'}`,
    [isSelectingFor, tool1?.name]);

    const stepTrackerExtra = useMemo(() => (
        <div className={styles.stepIndicator}>
            <div 
                className={`${styles.stepItem} ${isSelectingFor === 'tool1' ? styles.active : styles.done}`}
                onClick={() => onSwitchStep('tool1')}
            >
                <span className={styles.stepNumber}>{tool1 ? '✓' : '1'}</span>
                <div className={styles.stepTextContent}>
                    <span className={styles.stepLabel}>{tool1 ? tool1.name : COMPARE_UI_CONSTANTS.wizard.placeholderA}</span>
                    {tool1 && isSelectingFor === 'tool2' && (
                        <Button 
                            variant="ghost"
                            size="sm"
                            className={styles.stepRemoveBtn} 
                            onClick={(e) => { e.stopPropagation(); onClear('tool1'); onSwitchStep('tool1'); }}
                            icon={X}
                            iconSize={12}
                        />
                    )}
                </div>
            </div>
            
            <div className={styles.stepLinkLine}>
                <div 
                    className={styles.stepProgressFill} 
                    style={{ '--progress-width': tool1 ? '100%' : '0%' }} 
                />
            </div>

            <div 
                className={`${styles.stepItem} ${isSelectingFor === 'tool2' ? styles.active : (tool2 ? styles.done : '')}`}
                onClick={() => tool1 && onSwitchStep('tool2')}
            >
                <span className={styles.stepNumber}>{tool2 ? '✓' : '2'}</span>
                <div className={styles.stepTextContent}>
                    <span className={styles.stepLabel}>{tool2 ? tool2.name : COMPARE_UI_CONSTANTS.wizard.placeholderB}</span>
                    {tool2 && (
                        <Button 
                            variant="ghost"
                            size="sm"
                            className={styles.stepRemoveBtn} 
                            onClick={(e) => { e.stopPropagation(); onClear('tool2'); onSwitchStep('tool2'); }}
                            icon={X}
                            iconSize={12}
                        />
                    )}
                </div>
            </div>
        </div>
    ), [isSelectingFor, tool1, tool2, onSwitchStep, onClear]);
    
    return (
        <Safeguard error={toolsError} onRetry={refetchTools}>
            <div className={styles.builderOverlay}>
                <div className={styles.builderContainer}>
                    
                    <div className={styles.builderHeader}>
                        <div className={styles.headerTitleGroup}>
                            <div className={styles.wizardStatus}>
                                <Zap className={styles.wizardIcon} size={18} />
                                <h2>{wizardTitle}</h2>
                            </div>
                            
                            <div className={styles.headerSearchWrapper}>
                                <Input 
                                    type="text" 
                                    placeholder={isSelectingFor === 'tool1' ? COMPARE_UI_CONSTANTS?.wizard?.searchA : `${COMPARE_UI_CONSTANTS?.wizard?.searchB} ${tool1?.name || 'the selected tool'}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={styles.builderSearchInput}
                                    autoFocus
                                />
                            </div>
                        </div>
                        
                        <Button 
                            variant="ghost" 
                            onClick={onClose} 
                            aria-label="Cancel Selection"
                            icon={X}
                            iconSize={20}
                            className={styles.closeBtn}
                        />
                    </div>

                    <div className={styles.builderGrid}>
                        <div className={styles.builderGridSidebar}>
                            <DirectorySidebar 
                                categoryFilter={categoryFilter}
                                pricingFilter={pricingFilter}
                                isLoading={isToolsLoading && categories?.length === 0}
                                error={null}
                                refetch={() => {}}
                                className={styles.builderSidebarOverride}
                                content={SEARCH_UI_CONSTANTS?.sidebar}
                                displayedCategories={displayedCategories}
                                hiddenCount={hiddenCount}
                                catSearchQuery={catSearchQuery}
                                setCatSearchQuery={setCatSearchQuery}
                                showAllCats={showAllCats}
                                setShowAllCats={setShowAllCats}
                            />
                        </div>

                        <div className={styles.builderGridMain}>
                            <DirectoryResults 
                                results={results}
                                isLoading={isToolsLoading}
                                loadingMore={loadingMore}
                                hasMore={hasMore}
                                setPage={setPage}
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                error={toolsError}
                                refetch={refetchTools}
                                onToolClick={(selectedTool) => onSelect(selectedTool)}
                                className={styles.builderResults}
                                content={SEARCH_UI_CONSTANTS?.results}
                                headerExtra={stepTrackerExtra}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </Safeguard>
    );
};

export default memo(CompareBuilder);
