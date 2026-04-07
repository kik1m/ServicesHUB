import React from 'react';

const LegalSection = ({ icon: Icon, number, title, children }) => {
    return (
        <div className="legal-clause-unit">
            <h3 className="legal-clause-header">
                {Icon && <Icon size={24} color="var(--primary)" />} {number}. {title}
            </h3>
            <div className="legal-clause-text">
                {children}
            </div>
        </div>
    );
};

export default LegalSection;
