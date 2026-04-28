import { Search } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Safeguard from '../ui/Safeguard';
import { CATEGORY_STRINGS, CATEGORY_CONFIG } from '../../constants/categoryConstants';
import { PRICING_MODELS } from '../../constants/searchConstants';
import styles from './CategoryToolsSearch.module.css';

/**
 * CategoryToolsSearch Component - Elite Centered Refinement
 * Rule #4: Using Unified UI Atoms (Select)
 * Rule #16: Section Responsibility
 */
const CategoryToolsSearch = (props) => {
    const { 
        searchQuery, 
        onSearchChange,
        priceFilter,
        onPriceChange,
        sortBy,
        onSortChange,
        isLoading,
        error,
        onRetry
    } = props;

    const strings = CATEGORY_STRINGS?.TOOLS;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.searchContainer}>
            <div className={styles.centeredContent}>
                <div className={styles.inputBox}>
                    <Input
                        placeholder={strings?.SEARCH_PLACEHOLDER}
                        icon={Search}
                        value={searchQuery}
                        onChange={onSearchChange}
                        variant="pill"
                        disabled={isLoading}
                        className={styles.resetMargin}
                    />
                </div>
                
                <div className={styles.filterGroup}>
                    <div className={styles.sortBox}>
                        <Select 
                            options={PRICING_MODELS}
                            value={priceFilter}
                            onChange={onPriceChange}
                            placeholder="Pricing"
                            className={styles.premiumSelect}
                        />
                    </div>
                    
                    <div className={styles.sortBox}>
                        <Select 
                            options={CATEGORY_CONFIG?.SORT_OPTIONS}
                            value={sortBy}
                            onChange={onSortChange}
                            placeholder={strings?.SORT_LABEL}
                            className={styles.premiumSelect}
                        />
                    </div>
                </div>
            </div>
        </div>
        </Safeguard>
    );
};

export default CategoryToolsSearch;
