import React from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import CustomSelect from '../CustomSelect';
import styles from './AdminBlogManager.module.css';

const AdminBlogManager = ({ activeTab, blogPosts, newPost, setNewPost, handleCreateBlogPost, handleDeleteBlog, blogCategories, submitting, uploading }) => {
    if (activeTab !== 'blogs') return null;

    return (
        <div className={styles.splitLayout}>
            <div>
                <h3 className={styles.title}>Create New Article</h3>
                <form onSubmit={handleCreateBlogPost} className={styles.formGroup}>
                    <input 
                        type="text" 
                        placeholder="Title" 
                        required 
                        value={newPost.title} 
                        onChange={e => setNewPost({ ...newPost, title: e.target.value })} 
                        className={styles.inputField} 
                    />

                    <CustomSelect
                        options={blogCategories}
                        value={newPost.category}
                        onChange={(val) => setNewPost({ ...newPost, category: val })}
                        placeholder="Select Blog Category"
                        style={{ marginBottom: '0' }}
                    />

                    <textarea 
                        placeholder="Short Excerpt..." 
                        rows="3" 
                        value={newPost.excerpt} 
                        onChange={e => setNewPost({ ...newPost, excerpt: e.target.value })} 
                        className={styles.inputField}
                    ></textarea>
                    
                    <textarea 
                        placeholder="Article Content (HTML/Text)..." 
                        rows="6" 
                        value={newPost.content} 
                        onChange={e => setNewPost({ ...newPost, content: e.target.value })} 
                        className={styles.inputField}
                    ></textarea>
                    
                    <button 
                        type="submit" 
                        disabled={submitting || uploading} 
                        className="btn-primary" 
                        style={{ width: '100%' }}
                    >
                        {(submitting || uploading) ? <Loader2 className="animate-spin" size={20} /> : 'Publish Article'}
                    </button>
                </form>
            </div>
            
            <div>
                <h3 className={styles.title}>Manage Articles ({blogPosts.length})</h3>
                <div className={styles.scrollArea}>
                    {blogPosts.map(post => (
                        <div key={post.id} className={styles.itemRow}>
                            <div className={styles.info}>
                                <h5>{post.title}</h5>
                                <p>{post.category} • {new Date(post.created_at).toLocaleDateString()}</p>
                            </div>
                            <button 
                                onClick={() => handleDeleteBlog(post.id)} 
                                className={styles.deleteBtn}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {blogPosts.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No articles found.</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminBlogManager;
