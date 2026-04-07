import React from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import CustomSelect from '../CustomSelect';

const AdminBlogManager = ({ activeTab, blogPosts, newPost, setNewPost, handleCreateBlogPost, handleDeleteBlog, blogCategories, submitting, uploading }) => {
    if (activeTab !== 'blogs') return null;

    return (
        <div className="admin-split-layout">
            <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem' }}>Create New Article</h3>
                <form onSubmit={handleCreateBlogPost} className="admin-form-group">
                    <input 
                        type="text" 
                        placeholder="Title" 
                        required 
                        value={newPost.title} 
                        onChange={e => setNewPost({ ...newPost, title: e.target.value })} 
                        className="admin-input-field" 
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
                        className="admin-input-field"
                    ></textarea>
                    
                    <textarea 
                        placeholder="Article Content (HTML/Text)..." 
                        rows="6" 
                        value={newPost.content} 
                        onChange={e => setNewPost({ ...newPost, content: e.target.value })} 
                        className="admin-input-field"
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
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem' }}>Manage Articles ({blogPosts.length})</h3>
                <div className="admin-scroll-area">
                    {blogPosts.map(post => (
                        <div key={post.id} className="admin-item-row" style={{ marginBottom: '10px' }}>
                            <div className="admin-item-info">
                                <h5 style={{ fontWeight: '700' }}>{post.title}</h5>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.category} • {new Date(post.created_at).toLocaleDateString()}</p>
                            </div>
                            <button 
                                onClick={() => handleDeleteBlog(post.id)} 
                                style={{ color: '#ff5050', background: 'none', border: 'none', cursor: 'pointer' }}
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
