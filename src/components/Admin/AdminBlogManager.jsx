import React, { memo } from 'react';
import { ADMIN_UI_CONSTANTS } from '../../constants/adminConstants';
import { Trash2, PenTool, BookOpen, Eye, Plus, Search, Image as ImageIcon, Link as LinkIcon, Type, GitCompare } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Safeguard from '../ui/Safeguard';
import styles from './AdminBlogManager.module.css';
import { logEvent } from '../../services/analyticsService';

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
    actionError,
    onRetry,
    allTools = [],
    handleAdminSearch,
    adminSearchResults = [],
    isSearchingTools
}) => {
    const [isPreview, setIsPreview] = React.useState(false);
    const [toolSearch, setToolSearch] = React.useState('');
    const [showToolPicker, setShowToolPicker] = React.useState(false);

    // 1. Guard for active tab
    if (activeTab !== 'blog') return null;

    const labels = ADMIN_UI_CONSTANTS.blog;

    // 2. Smart Insertion Helpers
    const insertShortcode = (code) => {
        const content = newPost?.content || '';
        setNewPost({ ...newPost, content: content + '\n' + code + '\n' });
        setShowToolPicker(false);
        setToolSearch(''); // Clear search on insert
        logEvent('admin_blog_insert', 'editor', code.split(' ')[0]);
    };

    const displayTools = toolSearch.trim() 
        ? adminSearchResults 
        : allTools.slice(0, 5);

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
            {/* Rule #22: Action Error Display (Non-destructive) */}
            {actionError && !isLoading && <div className={styles.localError}>{actionError}</div>}
            <div className={styles.splitLayout}>
                {/* Editor Column */}
                <div className={styles.formCol}>
                    <div className={styles.sectionHeader}>
                        <PenTool size={20} className={styles.headerIcon} />
                        <h3 className={styles.title}>{labels.editor?.title}</h3>
                    </div>
                    
                    <div className={styles.editorControls}>
                        <div className={styles.tabSwitch}>
                            <button 
                                className={`${styles.tabBtn} ${!isPreview ? styles.active : ''}`}
                                onClick={() => setIsPreview(false)}
                            >
                                <PenTool size={16} /> Editor
                            </button>
                            <button 
                                className={`${styles.tabBtn} ${isPreview ? styles.active : ''}`}
                                onClick={() => setIsPreview(true)}
                            >
                                <Eye size={16} /> Preview
                            </button>
                        </div>

                        {!isPreview && (
                            <div className={styles.toolbar}>
                                <button type="button" onClick={() => insertShortcode('<h2>Subheading</h2>')} title="Add Header"><Type size={16} /></button>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        const url = window.prompt('Enter Image URL:');
                                        if (url) {
                                            const caption = window.prompt('Enter Image Caption (Optional):');
                                            insertShortcode(`[image url="${url}"${caption ? ` caption="${caption}"` : ''}]`);
                                        }
                                    }} 
                                    title="Insert Image"
                                >
                                    <ImageIcon size={18} />
                                </button>
                                <button type="button" onClick={() => setShowToolPicker(!showToolPicker)} title="Insert Tool Card" className={styles.specialBtn}><Plus size={16} /> Tool Card</button>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        const slug1 = window.prompt('Enter first tool slug (e.g. heygen):');
                                        if (slug1) {
                                            const slug2 = window.prompt('Enter second tool slug (e.g. devin-pro):');
                                            if (slug2) {
                                                insertShortcode(`[compare slug1="${slug1}" slug2="${slug2}"]`);
                                            }
                                        }
                                    }} 
                                    title="Insert Comparison Card"
                                    className={styles.compareToolBtn}
                                >
                                    <GitCompare size={16} /> Comparison
                                </button>
                            </div>
                        )}
                    </div>

                    {showToolPicker && !isPreview && (
                        <div className={styles.toolPicker}>
                            <div className={styles.searchBox}>
                                <Search size={16} />
                                <input 
                                    placeholder="Search all tools in database..." 
                                    value={toolSearch}
                                    onChange={(e) => {
                                        setToolSearch(e.target.value);
                                        handleAdminSearch(e);
                                    }}
                                />
                                {isSearchingTools && <div className={styles.loaderSmall} />}
                            </div>
                            <div className={styles.toolResults}>
                                {displayTools.length > 0 ? displayTools.map(tool => (
                                    <div key={tool.id} className={styles.toolResultItem} onClick={() => insertShortcode(`[tool id="${tool.id}"]`)}>
                                        <span>{tool.name}</span>
                                        <Plus size={14} />
                                    </div>
                                )) : (
                                    <p className={styles.noResults}>No tools found. Try another name.</p>
                                )}
                            </div>
                        </div>
                    )}
                    
                    <form onSubmit={handleCreateBlogPost} className={styles.editorForm}>
                        {!isPreview ? (
                            <>
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
                                    rows={2}
                                    value={newPost?.excerpt || ''} 
                                    onChange={e => setNewPost({ ...newPost, excerpt: e.target.value })} 
                                />
                                
                                <Input 
                                    placeholder={labels.editor?.placeholders?.content} 
                                    multiline={true}
                                    rows={15}
                                    value={newPost?.content || ''} 
                                    onChange={e => setNewPost({ ...newPost, content: e.target.value })} 
                                />
                            </>
                        ) : (
                            <div className={styles.previewContainer}>
                                <h1 className={styles.previewTitle}>{newPost?.title || 'Untitled Article'}</h1>
                                <div className={styles.previewMeta}>
                                    {blogCategories.find(c => c.id === newPost.category)?.name || 'No Category'} • Live Preview
                                </div>
                                <div 
                                    className={styles.previewContent} 
                                    dangerouslySetInnerHTML={{ 
                                        __html: (newPost?.content || '')
                                            .replace(/\[tool id="([^"]+)"\]/g, (match, id) => {
                                                const tool = allTools.find(t => t.id === id);
                                                const toolName = tool ? tool.name : `Tool ID: ${id.slice(0,8)}...`;
                                                return `<div style="padding:25px; background:linear-gradient(135deg, rgba(0,210,255,0.1) 0%, rgba(0,210,255,0.05) 100%); border:1px solid var(--primary); border-radius:20px; margin:30px 0; display:flex; justify-content:space-between; align-items:center;">
                                                    <div style="display:flex; flex-direction:column; gap:5px;">
                                                        <span style="font-size:0.8rem; color:var(--primary); font-weight:800; text-transform:uppercase; letter-spacing:1px;">Featured Tool</span>
                                                        <span style="font-size:1.3rem; font-weight:800; color:white;">${toolName}</span>
                                                    </div>
                                                    <div style="background:var(--primary); padding:10px 20px; border-radius:12px; font-weight:bold; color:white; font-size:0.9rem;">View in Article</div>
                                                </div>`;
                                            })
                                            .replace(/\[compare slug1="([^"]+)" slug2="([^"]+)"\]/g, (match, s1, s2) => {
                                                return `<div style="padding:25px; background:linear-gradient(135deg, rgba(255,71,87,0.1) 0%, rgba(255,71,87,0.05) 100%); border:1px solid var(--secondary); border-radius:20px; margin:30px 0; text-align:center;">
                                                    <div style="background:var(--secondary); color:white; display:inline-block; padding:4px 12px; border-radius:100px; font-size:0.7rem; font-weight:900; margin-bottom:10px;">VS COMPARISON</div>
                                                    <div style="font-size:1.2rem; font-weight:900; color:white; text-transform:capitalize;">${s1.replace(/-/g, ' ')} vs ${s2.replace(/-/g, ' ')}</div>
                                                </div>`;
                                            })
                                    }} 
                                />
                            </div>
                        )}
                        
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
