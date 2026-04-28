import React, { memo } from 'react';
import { ADMIN_UI_CONSTANTS } from '../../constants/adminConstants';
import { Trash2, PenTool, BookOpen } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Safeguard from '../ui/Safeguard';
import styles from './AdminBlogManager.module.css';

/**
 * AdminBlogManager - Elite Modular Blog Editor
 * Rule #18: Memoized
 */
const AdminBlogManager = memo(({ 
    activeTab, 
    blogPosts = [], 
    newPost = {}, 
    setNewPost, 
    handleCreateBlogPost, 
    handleDeleteBlog, 
    blogCategories = [], 
    submitting, 
    isLoading,
    error,
    onRetry
}) => {
    // 1. Guard for active tab (Matched with Orchestrator ID)
    if (activeTab !== 'blog') return null;

    const labels = ADMIN_UI_CONSTANTS.blog;

    // 2. Loading State - Rule #11
    if (isLoading) {
        return (
            <div className={styles.splitLayout}>
                <div className={styles.formCol}>
                    <Skeleton className={styles.skeletonFormTitle} />
                    <Skeleton className={styles.skeletonInput} />
                    <Skeleton className={styles.skeletonInput} />
                    <Skeleton className={styles.skeletonTextareaSmall} />
                    <Skeleton className={styles.skeletonTextareaLarge} />
                    <Skeleton className={styles.skeletonSubmitBtn} />
                </div>
                <div className={styles.listCol}>
                    <Skeleton className={styles.skeletonListTitle} />
                    <div className={styles.scrollArea}>
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className={styles.itemRowSkeleton}>
                                <div className={styles.skeletonText}>
                                    <Skeleton className={styles.skeletonRowTitle} />
                                    <Skeleton className={styles.skeletonRowMeta} />
                                </div>
                                <Skeleton className={styles.skeletonDeleteIcon} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.splitLayout}>
                {/* Editor Column */}
                <div className={styles.formCol}>
                    <div className={styles.sectionHeader}>
                        <PenTool size={20} className={styles.headerIcon} />
                        <h3 className={styles.title}>{labels.editor?.title}</h3>
                    </div>
                    
                    <form onSubmit={handleCreateBlogPost} className={styles.editorForm}>
                        <Input 
                            placeholder={labels.editor?.placeholders?.title} 
                            required 
                            value={newPost?.title || ''} 
                            onChange={e => setNewPost({ ...newPost, title: e.target.value })} 
                        />

                        <Select
                            options={blogCategories}
                            value={newPost?.category}
                            onChange={(val) => setNewPost({ ...newPost, category: val })}
                            placeholder={labels.editor?.placeholders?.category}
                        />

                        <Input 
                            placeholder={labels.editor?.placeholders?.excerpt} 
                            multiline={true}
                            rows={3}
                            value={newPost?.excerpt || ''} 
                            onChange={e => setNewPost({ ...newPost, excerpt: e.target.value })} 
                        />
                        
                        <Input 
                            placeholder={labels.editor?.placeholders?.content} 
                            multiline={true}
                            rows={8}
                            value={newPost?.content || ''} 
                            onChange={e => setNewPost({ ...newPost, content: e.target.value })} 
                        />
                        
                        <Button 
                            type="submit" 
                            isLoading={submitting} 
                            className={styles.submitBtn}
                            icon={PenTool}
                        >
                            {labels.editor?.submit}
                        </Button>
                    </form>
                </div>
                
                {/* Management Column */}
                <div className={styles.listCol}>
                    <div className={styles.sectionHeader}>
                        <BookOpen size={20} className={styles.headerIcon} />
                        <h3 className={styles.title}>{labels.manager?.title} ({blogPosts?.length || 0})</h3>
                    </div>

                    <div className={styles.scrollArea}>
                        {blogPosts?.map(post => (
                            <div key={post.id} className={styles.itemRow}>
                                <div className={styles.info}>
                                    <h5>{post?.title}</h5>
                                    <p>{post?.category} • {post?.created_at ? new Date(post.created_at).toLocaleDateString() : 'Recent'}</p>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => handleDeleteBlog(post.id)} 
                                    className={styles.deleteBtn}
                                    title={labels.manager?.deleteTitle}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        
                        {blogPosts?.length === 0 && (
                            <div className={styles.emptyState}>
                                <p>{labels.manager?.empty}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Safeguard>
    );
});

export default AdminBlogManager;
