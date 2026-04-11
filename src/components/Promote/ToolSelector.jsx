import React from 'react';
import { Layout, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import SkeletonLoader from '../SkeletonLoader';
import CustomSelect from '../CustomSelect';
import styles from './ToolSelector.module.css';

const ToolSelector = ({ toolName, loadingTools, userTools, selectedToolId, setSelectedToolId }) => {
    return (
        <section className={styles.promoteStepCard}>
            <div className={styles.sectionHeaderCompact}>
                <div className={styles.badgeStep}>STEP 1</div>
                <h3>Pick Your Tool</h3>
            </div>
            
            <div className={styles.glassCard}>
                <div className={styles.flexContainer}>
                    <div className={styles.infoBox}>
                        <p className={styles.description}>
                            {toolName ? "Selected tool for this promotion campaign." : "Choose the approved tool you want to promote."}
                        </p>
                    </div>

                    <div className={styles.selectorBox}>
                        {toolName ? (
                            <div className={styles.selectedToolBadge}>
                                <Zap size={16} className="text-primary" /> {toolName}
                            </div>
                        ) : (
                            loadingTools ? (
                                <SkeletonLoader height="42px" width="100%" borderRadius="10px" />
                            ) : userTools.length > 0 ? (
                                <CustomSelect
                                    options={userTools}
                                    value={selectedToolId}
                                    onChange={(val) => setSelectedToolId(val)}
                                    placeholder="Select a tool..."
                                    icon={Layout}
                                    style={{ marginBottom: '0' }}
                                />
                            ) : (
                                <Link to="/submit" className={styles.submitLink}>
                                    No approved tools yet. Click to submit &rarr;
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ToolSelector;
