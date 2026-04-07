import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomSelect = ({ label, options, value, onChange, placeholder, icon: Icon, style }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    // Support both ID-based and Name-based options
    const selectedOption = options.find(opt => 
        opt.id === value || opt.name === value || opt.label === value || opt.value === value
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="custom-select-container" ref={dropdownRef} style={style}>
            {label && <label className="custom-select-label">{label}</label>}
            <div 
                className="custom-select-trigger" 
                onClick={() => setIsOpen(!isOpen)}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {Icon && <Icon size={16} color="var(--primary)" />}
                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                        {selectedOption ? (selectedOption.name || selectedOption.label || selectedOption.value) : placeholder}
                    </span>
                </div>
                <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: '0.3s' }} />
            </div>
            
            <div className={`custom-options ${isOpen ? 'show' : ''}`}>
                {options.map((opt) => {
                    const optVal = opt.id || opt.name || opt.value || opt.label;
                    const isSelected = opt.id === value || opt.name === value || opt.label === value || opt.value === value;
                    
                    return (
                        <div 
                            key={optVal} 
                            className={`custom-option ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                                onChange(optVal);
                                setIsOpen(false);
                            }}
                        >
                            <span>{opt.name || opt.label || opt.value}</span>
                            {isSelected && <Check size={14} />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CustomSelect;
