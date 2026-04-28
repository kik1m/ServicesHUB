import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import styles from './Select.module.css';

/**
 * Advanced Shared Select Component (UI Atom)
 * Features: Searchable, Multi-select, Keyboard Nav, Premium Styling
 */
const Select = ({ 
    label, 
    options = [], 
    value, 
    onChange, 
    placeholder = "Select an option", 
    icon: Icon,
    isSearchable = false,
    isMulti = false,
    name
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [internalValue, setInternalValue] = useState(isMulti ? [] : '');
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // Support both Controlled and Uncontrolled state
    const isControlled = value !== undefined;
    const activeValue = isControlled ? value : internalValue;

    // Filtered options based on search
    const filteredOptions = useMemo(() => {
        return options.filter(opt => {
            const searchLabel = (opt.label || opt.name || opt.value || "").toLowerCase();
            return searchLabel.includes(searchTerm.toLowerCase());
        });
    }, [options, searchTerm]);

    // Derived Label(s) for the trigger
    const getDisplayLabel = () => {
        if (isMulti) {
            const selectedOptions = options.filter(opt => 
                Array.isArray(activeValue) && activeValue.includes(opt.value || opt.id)
            );
            if (selectedOptions.length === 0) return <span className={styles.placeholder}>{placeholder}</span>;
            return (
                <div className={styles.multiValueBox}>
                    {selectedOptions.map(opt => (
                        <span key={opt.value || opt.id} className={styles.chip}>
                            {opt.label || opt.name}
                        </span>
                    ))}
                </div>
            );
        }

        const selected = options.find(opt => (opt.value || opt.id) === activeValue);
        return selected ? (selected.label || selected.name) : <span className={styles.placeholder}>{placeholder}</span>;
    };

    // Outside click closer
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when opening
    useEffect(() => {
        if (isOpen && isSearchable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen, isSearchable]);

    const toggleOption = (val) => {
        let newValue;
        if (isMulti) {
            const currentArray = Array.isArray(activeValue) ? activeValue : [];
            newValue = currentArray.includes(val) 
                ? currentArray.filter(v => v !== val)
                : [...currentArray, val];
        } else {
            newValue = val;
            setIsOpen(false);
        }

        if (isControlled) {
            onChange(newValue);
        } else {
            setInternalValue(newValue);
            if (onChange) onChange(newValue);
        }
        
        setSearchTerm('');
    };

    // Keyboard Navigation
    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setFocusedIndex(prev => (prev + 1 < filteredOptions.length ? prev + 1 : 0));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedIndex(prev => (prev - 1 >= 0 ? prev - 1 : filteredOptions.length - 1));
                break;
            case 'Enter':
                e.preventDefault();
                if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
                    toggleOption(filteredOptions[focusedIndex].value || filteredOptions[focusedIndex].id);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
            case 'Tab':
                setIsOpen(false);
                break;
            default:
                break;
        }
    };

    return (
        <div className={styles.selectContainer} ref={dropdownRef} onKeyDown={handleKeyDown}>
            {label && <label className={styles.label}>{label}</label>}
            
            <div 
                className={`${styles.trigger} ${isOpen ? styles.triggerActive : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                tabIndex={0}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <div className={styles.displayValue}>
                    {Icon && <Icon size={18} className={styles.triggerIcon} />}
                    {getDisplayLabel()}
                </div>
                <ChevronDown 
                    size={18} 
                    style={{ 
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', 
                        transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        color: isOpen ? 'var(--secondary)' : 'var(--text-muted)'
                    }} 
                />
            </div>

            <div className={`${styles.dropdownMenu} ${isOpen ? styles.menuOpen : ''}`}>
                {isSearchable && (
                    <div className={styles.searchWrapper}>
                        <Search size={16} className={styles.searchIcon} />
                        <input 
                            ref={searchInputRef}
                            type="text" 
                            className={styles.searchInput}
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setFocusedIndex(0);
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}

                <div className={styles.optionsList} role="listbox">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((opt, index) => {
                            const optVal = opt.value || opt.id;
                            const isSelected = isMulti 
                                ? activeValue?.includes(optVal)
                                : activeValue === optVal;
                            
                            return (
                                <div 
                                    key={optVal} 
                                    className={`
                                        ${styles.option} 
                                        ${isSelected ? styles.optionSelected : ''} 
                                        ${index === focusedIndex ? styles.optionFocused : ''}
                                    `}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleOption(optVal);
                                    }}
                                    role="option"
                                    aria-selected={isSelected}
                                >
                                    <span>{opt.label || opt.name}</span>
                                    {isSelected && <Check size={14} />}
                                </div>
                            );
                        })
                    ) : (
                        <div className={styles.emptyResults}>No results found</div>
                    )}
                </div>
            </div>

            {/* Hidden native input for form compatibility */}
            <input type="hidden" name={name} value={activeValue} />
        </div>
    );
};

export default Select;





