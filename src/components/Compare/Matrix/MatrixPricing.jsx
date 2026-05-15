import React from 'react';
import { Calculator } from 'lucide-react';
import styles from './MatrixPricing.module.css';
import { renderStructuredText } from './MatrixUtils';

const MatrixPricing = ({ 
    aiResults, 
    content
}) => {
    if (!aiResults) return null;

    return (
        <div className={styles.tcoSection}>
            <div className={styles.tcoHeader}>
                <Calculator size={20} color="var(--secondary)" />
                <h4>{content?.tco?.title || 'Pricing Analysis'}</h4>
            </div>
            <div className={styles.tcoContent}>
                {renderStructuredText(aiResults.pricing_analysis)}
            </div>
        </div>
    );
};

export default MatrixPricing;
