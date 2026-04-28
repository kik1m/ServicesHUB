
import React, { memo, useState } from 'react';
import { ADMIN_UI_CONSTANTS } from '../../constants/adminConstants';
import { Search, Edit3, Trash2, ExternalLink, ChevronLeft, ChevronRight, Package, ShieldCheck } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Input from '../ui/Input';
import Button from '../ui/Button';
import SmartImage from '../ui/SmartImage';
import Safeguard from '../ui/Safeguard';
import styles from './AdminToolManager.module.css';

/**
 * AdminToolManager - Elite Multi-Tool Orchestrator
 * Rule #18: Memoized
 */
const AdminToolManager = memo(({ 
    allTools = [], 
    totalTools = 0, 
    currentPage = 1, 
    setPage,
    handleAdminSearch,
    adminSearchQuery = '',
    adminSearchResults = [],
    isSearching,
    handleOpenEdit,
    handleDelete,
    isLoading,
    error,
    onRetry
}) => {
    const labels = ADMIN_UI_CONSTANTS.management || {
        title: "Platform Directory Manager",
        subtitle: "Full lifecycle control for all indexed tools and creative assets.",
        searchPlaceholder: "Search global directory...",
        empty: "No tools found in the system.",
        stats: {
            indexed: "INDEXED TOOLS",
            showing: "SHOWING PAGE"
        },
        actions: {
            edit: "Edit Details",
            delete: "Delete Forever"
        }
    };

    const SKELETON_COUNT = 6;
    const PAGE_SIZE = 10;
    const totalPages = Math.ceil(totalTools / PAGE_SIZE);

    const displayedTools = adminSearchQuery.trim() ? adminSearchResults : allTools;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.managerWrapper}>
                {isLoading && allTools?.length === 0 ? (
                    <>
                        <div className={styles.skeletonHeader}>
                            <Skeleton className={styles.skeletonTitle} />
                            <Skeleton className={styles.skeletonSearch} />
                        </div>
                        <div className={styles.grid}>
                            {[...Array(SKELETON_COUNT)].map((_, i) => (
                                <div key={i} className={styles.toolCardSkeleton}>
                                    <Skeleton className={styles.skeletonImage} />
                                    <Skeleton className={styles.skeletonLine} />
                                    <Skeleton className={styles.skeletonLineShort} />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Header Section */}
                        <header className={styles.header}>
                            <div className={styles.headerContent}>
                                <div className={styles.titleArea}>
                                    <h2 className={styles.title}>{labels.title}</h2>
                                    <p className={styles.subtitle}>{labels.subtitle}</p>
                                </div>
                                <div className={styles.statsArea}>
                                    <div className={styles.statItem}>
                                        <span className={styles.statValue}>{totalTools}</span>
                                        <span className={styles.statLabel}>{labels.stats?.indexed}</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statValue}>{currentPage} / {totalPages || 1}</span>
                                        <span className={styles.statLabel}>{labels.stats?.showing}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.searchBar}>
                                <Input 
                                    placeholder={labels.searchPlaceholder}
                                    value={adminSearchQuery}
                                    onChange={handleAdminSearch}
                                    icon={Search}
                                    className={styles.searchInput}
                                />
                                {isSearching && <div className={styles.searchLoader} />}
                            </div>
                        </header>

                        {/* Tools Grid */}
                        <div className={styles.grid}>
                            {displayedTools?.map(tool => (
                                <article key={tool.id} className={styles.toolCard}>
                                    <div className={styles.cardVisual}>
                                        <div className={styles.imageBox}>
                                            <SmartImage src={tool.image_url} alt={tool.name} />
                                            <div className={styles.verifiedBadge}>
                                                <ShieldCheck size={12} />
                                            </div>
                                        </div>
                                        <div className={styles.cardActions}>
                                            <button type="button" onClick={() => handleOpenEdit(tool)} className={styles.editBtn} title={labels.actions?.edit}>
                                                <Edit3 size={18} />
                                            </button>
                                            <button type="button" onClick={() => handleDelete(tool)} className={styles.deleteBtn} title={labels.actions?.delete}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.cardInfo}>
                                        <div className={styles.infoHead}>
                                            <h3 className={styles.toolName}>{tool?.name}</h3>
                                            <a href={tool?.url} target="_blank" rel="noreferrer" className={styles.linkIcon}>
                                                <ExternalLink size={14} />
                                            </a>
                                        </div>
                                        <div className={styles.metaRow}>
                                            <span className={styles.catTag}>{tool?.categories?.name || 'Uncategorized'}</span>
                                            <span className={styles.priceTag}>{tool?.pricing_type}</span>
                                        </div>
                                        <p className={styles.dateInfo}>Added on {tool?.formatted_date}</p>
                                    </div>
                                </article>
                            ))}

                            {displayedTools?.length === 0 && !isLoading && (
                                <div className={styles.emptyState}>
                                    <Package size={48} />
                                    <p>{labels.empty}</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {!adminSearchQuery.trim() && totalPages > 1 && (
                            <footer className={styles.pagination}>
                                <Button
                                    variant="secondary"
                                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1 || isLoading}
                                    icon={ChevronLeft}
                                >
                                    Previous
                                </Button>
                                <div className={styles.pageIndicator}>
                                    Page <span>{currentPage}</span> of {totalPages}
                                </div>
                                <Button
                                    variant="secondary"
                                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages || isLoading}
                                    icon={ChevronRight}
                                    iconPosition="right"
                                >
                                    Next
                                </Button>
                            </footer>
                        )}
                    </>
                )}
            </div>
        </Safeguard>
    );
});

export default AdminToolManager;
