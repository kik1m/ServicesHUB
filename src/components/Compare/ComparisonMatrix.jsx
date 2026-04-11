import React from 'react';
import { Check, Minus, Info } from 'lucide-react';
import styles from './ComparisonMatrix.module.css';

const ComparisonMatrix = ({ tool1, tool2 }) => {
    if (!tool1 || !tool2) return null;

    // Core comparison attributes
    const coreAttributes = [
        { label: 'Category', val1: tool1.categories?.name, val2: tool2.categories?.name },
        { label: 'Pricing Model', val1: tool1.pricing_type, val2: tool2.pricing_type },
        { label: 'Rating', val1: `${tool1.rating || '5.0'} / 5`, val2: `${tool2.rating || '5.0'} / 5` },
        { label: 'Verified Status', val1: tool1.is_verified ? 'Yes' : 'No', val2: tool2.is_verified ? 'Yes' : 'No' },
    ];

    // Combine all unique features from both tools
    const allFeatures = Array.from(new Set([
        ...(tool1.features || []),
        ...(tool2.features || [])
    ])).sort();

    return (
        <div className={styles.matrixWrapper}>
            <h3 className={styles.matrixTitle}>
                Detailed <span className="gradient-text">Comparison</span>
            </h3>
            
            <div className={styles.featuresGrid}>
                {/* Core Attribute Comparison */}
                {coreAttributes.map((attr, index) => (
                    <div key={`attr-${index}`} className={styles.featureRow}>
                        <span className={styles.featureLabel}>{attr.label}</span>
                        <div className={styles.checkContainer}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{attr.val1}</span>
                        </div>
                        <div className={styles.checkContainer}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{attr.val2}</span>
                        </div>
                    </div>
                ))}

                {/* Features Checklist */}
                {allFeatures.length > 0 ? (
                    <>
                        <div style={{ padding: '1.5rem 0 1rem', textAlign: 'center', opacity: 0.6, fontSize: '0.8rem', letterSpacing: '2px', fontWeight: '900', color: 'var(--secondary)' }}>
                            FEATURES MATRIX
                        </div>
                        {allFeatures.map((feature, i) => (
                            <div key={`feat-${i}`} className={styles.featureRow}>
                                <span className={styles.featureLabel}>{feature}</span>
                                <div className={styles.checkContainer}>
                                    {(tool1.features || []).includes(feature) ? 
                                        <Check size={20} color="var(--secondary)" strokeWidth={3} /> : 
                                        <Minus size={18} color="rgba(255,255,255,0.1)" />
                                    }
                                </div>
                                <div className={styles.checkContainer}>
                                    {(tool2.features || []).includes(feature) ? 
                                        <Check size={20} color="var(--secondary)" strokeWidth={3} /> : 
                                        <Minus size={18} color="rgba(255,255,255,0.1)" />
                                    }
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className={styles.emptyMatrix}> 
                        <Info size={24} style={{ marginBottom: '10px', opacity: 0.5 }} />
                        <p>No specific feature list available for detailed comparison.</p>
                    </div>
                )}
            </div>

            {/* Detailed Descriptions Section */}
            <div className={styles.descriptionGrid}>
                <div className={styles.descriptionBox}>
                    <h4>About {tool1.name}</h4>
                    <p className={styles.descriptionText}>{tool1.description || tool1.short_description}</p>
                </div>
                <div className={styles.descriptionBox}>
                    <h4>About {tool2.name}</h4>
                    <p className={styles.descriptionText}>{tool2.description || tool2.short_description}</p>
                </div>
            </div>
        </div>
    );
};

export default ComparisonMatrix;
