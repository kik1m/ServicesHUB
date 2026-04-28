import React from 'react';
import { Search } from 'lucide-react';
import Input from './Input';
import Button from './Button';
import styles from './SearchBar.module.css';

/**
 * SearchBar Molecule
 * A premium, unified search component that combines Input and Button atoms.
 */
const SearchBar = ({ 
    value, 
    onChange, 
    onKeyDown, 
    onSearch, 
    placeholder = "Search for tools...", 
    buttonText = "Search",
    showButton = true,
    className = "",
    iconColor = "var(--primary)"
}) => {
    return (
        <div className={`${styles.searchBarContainer} ${styles.glassEffect} ${className}`}>
            <Search 
                size={20} 
                className={styles.searchIcon} 
                color={iconColor}
            />
            
            <div className={styles.searchInputWrapper}>
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    className={styles.searchInputGroup}
                    fieldClassName={styles.searchInputField}
                    wrapperClassName={styles.searchInputWrapperOverride}
                    variant="naked" /* Naked variant doesn't have its own border/bg */
                />
            </div>

            {showButton && (
                <Button 
                    variant="primary" 
                    className={styles.searchButton}
                    onClick={onSearch}
                >
                    {buttonText}
                </Button>
            )}
        </div>
    );
};

export default SearchBar;
