import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import styles from './ToolDetailInfo.module.css';

const ToolDetailInfo = ({ tool }) => {
    return (
        <div className={styles.toolMainInfo}>
            <div className={styles.detailSection}>
                <h3 className="section-subtitle">About <span className="gradient-text">{tool.name}</span></h3>
                <p className="section-text">{tool.description}</p>
            </div>

            <div className={styles.detailSection}>
                <h3 className="section-subtitle">Key Features</h3>
                <div className={styles.featuresChecklist}>
                    {tool.features?.map((feature, i) => (
                        <div key={i} className={`glass-card ${styles.featureItemPremium}`}>
                            <div className={styles.featureIconBox}>
                                <CheckCircle2 size={24} />
                            </div>
                            <p className={styles.featureText}>{feature}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ToolDetailInfo;
