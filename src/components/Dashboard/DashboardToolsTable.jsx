import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ShieldCheck, Edit2, ExternalLink, Trash2 } from 'lucide-react';
import SmartImage from '../ui/SmartImage';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import Safeguard from '../ui/Safeguard';
import styles from './DashboardToolsTable.module.css';
import { SKELETON_COUNTS } from '../../constants/dashboardConstants';

/**
 * DashboardToolsTable - Elite Tool Management Table
 * Rule #29: Pure View with Safeguard protection
 */
const DashboardToolsTable = memo(({ userTools, handleDeleteTool, isLoading, error, onRetry, content }) => {
    const navigate = useNavigate();

    return (
        <Safeguard error={error} onRetry={onRetry}>
            {isLoading ? (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>{content.columns.info}</th>
                                <th>{content.columns.status}</th>
                                <th>{content.columns.marketing}</th>
                                <th>{content.columns.pricing}</th>
                                <th>{content.columns.views}</th>
                                <th>{content.columns.clicks}</th>
                                <th>{content.columns.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {SKELETON_COUNTS.TOOLS_TABLE.map(i => (
                                <tr key={`skeleton-row-${i}`}>
                                    <td>
                                        <div className={styles.toolInfoCell}>
                                            <Skeleton width="48px" height="48px" borderRadius="12px" />
                                            <div className={styles.toolMeta}>
                                                <Skeleton width="120px" height="16px" style={{ marginBottom: '4px' }} />
                                                <Skeleton width="80px" height="12px" />
                                            </div>
                                        </div>
                                    </td>
                                    <td><Skeleton width="80px" height="24px" borderRadius="100px" /></td>
                                    <td><Skeleton width="100px" height="18px" /></td>
                                    <td><Skeleton width="60px" height="16px" /></td>
                                    <td><Skeleton width="40px" height="16px" /></td>
                                    <td><Skeleton width="40px" height="16px" /></td>
                                    <td>
                                        <div className={styles.actionGroup}>
                                            <Skeleton width="32px" height="32px" borderRadius="8px" />
                                            <Skeleton width="32px" height="32px" borderRadius="8px" />
                                            <Skeleton width="32px" height="32px" borderRadius="8px" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (!userTools || userTools.length === 0) ? null : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>{content?.columns?.info}</th>
                                <th>{content?.columns?.status}</th>
                                <th>{content?.columns?.marketing}</th>
                                <th>{content?.columns?.pricing}</th>
                                <th>{content?.columns?.views}</th>
                                <th>{content?.columns?.clicks}</th>
                                <th>{content?.columns?.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userTools?.map((tool) => (
                                <tr key={tool?.id}>
                                    <td>
                                        <div className={styles.toolInfoCell}>
                                            <div className={styles.toolThumb}>
                                                <SmartImage 
                                                    src={tool?.image_url} 
                                                    alt={tool?.name}
                                                    width="48px"
                                                    height="48px"
                                                />
                                            </div>
                                            <div className={styles.toolMeta}>
                                                <span className={styles.toolName}>{tool?.name}</span>
                                                <span className={styles.toolDate}>Created {tool?.display_date}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${tool?.is_approved ? styles.statusPublished : styles.statusPending}`}>
                                            {tool?.is_approved ? content?.status?.published : content?.status?.pending}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.marketingCell}>
                                            <div className={styles.marketingIcons}>
                                                {tool?.is_featured && <TrendingUp size={16} color="var(--secondary)" />}
                                                {tool?.is_verified && <ShieldCheck size={16} color="var(--primary)" />}
                                            </div>
                                            {tool?.is_featured && tool?.display_days_left > 0 && (
                                                <span className={styles.daysLeft}>{tool?.display_days_left}d left</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.pricingType}>{tool?.pricing_type}</span>
                                    </td>
                                    <td>
                                        <span className={styles.viewsCount}>{(tool?.view_count || 0).toLocaleString()}</span>
                                    </td>
                                    <td>
                                        <span className={styles.viewsCount}>{(tool?.click_count || 0).toLocaleString()}</span>
                                    </td>
                                    <td>
                                        <div className={styles.actionGroup}>
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => navigate(`/edit-tool/${tool?.id}`)} 
                                                icon={Edit2}
                                                title={content?.actions?.edit}
                                            />
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                as="a"
                                                href={`/tool/${tool?.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                icon={ExternalLink}
                                                title={content?.actions?.view}
                                            />
                                            <Button 
                                                variant="danger" 
                                                size="sm"
                                                onClick={() => handleDeleteTool(tool?.id, tool?.name)} 
                                                icon={Trash2}
                                                title={content?.actions?.delete}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Safeguard>
    );
});

export default DashboardToolsTable;
