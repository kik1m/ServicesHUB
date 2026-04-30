import React, { memo } from 'react';
import { Layout, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Skeleton from '../ui/Skeleton';
import Select from '../ui/Select';
import Safeguard from '../ui/Safeguard';
import styles from './ToolSelector.module.css';

/**
 * ToolSelector - Elite Selection Component
 * Rule #14: Constant-driven content
 */
const ToolSelector = ({ toolName, loadingTools, userTools = [], selectedToolId, setSelectedToolId, isLoading, error, onRetry, content }) => {
    return (
        <Safeguard error={error} onRetry={onRetry} title="Tool Selector Unavailable">
            <div className={styles.selectorWrapper}>
                <div className={styles.sectionHeader}>
                    <div className={styles.stepBadge}>STEP 1</div>
                    <h3 className={styles.sectionTitle}>{content?.title}</h3>
                </div>

                {(isLoading || (loadingTools && !userTools?.length)) ? (
                    <div className={styles.skeletonCard}>
                        <div className={styles.skeletonInfo}>
                            <Skeleton width="60%" height="16px" />
                        </div>
                        <div className={styles.skeletonAction}>
                            <Skeleton width="100%" height="44px" borderRadius="12px" />
                        </div>
                    </div>
                ) : (
                    <div className={styles.glassCard}>
                        <div className={styles.infoArea}>
                            <p className={styles.description}>
                                {toolName ? `${content?.placeholder}: ${toolName}` : content?.placeholder}
                            </p>
                        </div>

                        <div className={styles.inputArea}>
                            {toolName ? (
                                <div className={styles.activeBadge}>
                                    <Zap size={16} /> <span>{toolName}</span>
                                </div>
                            ) : userTools?.length > 0 ? (
                                <Select
                                    options={userTools}
                                    value={selectedToolId}
                                    onChange={setSelectedToolId}
                                    placeholder={content?.placeholder}
                                    icon={Layout}
                                    className={styles.toolSelect}
                                />
                            ) : (
                                <Link to="/submit" className={styles.emptyLink}>
                                    {content?.submitNew} &rarr;
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Safeguard>
    );
};

export default memo(ToolSelector);
