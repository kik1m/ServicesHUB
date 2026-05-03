import React, { useState } from 'react';
import { Send, Plus, Trash2, Search, Gift, Sparkles, Layout } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import styles from './AdminNewsletterManager.module.css';

/**
 * AdminNewsletterManager - Elite Campaign Orchestrator
 * Build, Preview, and Broadcast high-conversion newsletters.
 */
const AdminNewsletterManager = ({ 
    campaignData, 
    setCampaignData, 
    allTools = [], 
    handleBroadcast,
    isSubmitting 
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [liveTools, setLiveTools] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Live Server Search for absolute flexibility
    React.useEffect(() => {
        const fetchTools = async () => {
            setIsSearching(true);
            try {
                const { supabase } = await import('../../lib/supabaseClient');
                let query = supabase.from('tools').select('id, name, image_url, short_description, slug').eq('is_approved', true).order('created_at', { ascending: false }).limit(20);
                
                if (searchQuery.trim()) {
                    query = query.ilike('name', `%${searchQuery}%`);
                }
                
                const { data } = await query;
                if (data) setLiveTools(data);
            } catch (err) {
                console.error("Failed to fetch tools for newsletter:", err);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(fetchTools, 300); // Debounce
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const toggleTool = (tool) => {
        const exists = campaignData.selectedTools.find(t => t.id === tool.id);
        if (exists) {
            setCampaignData(prev => ({
                ...prev,
                selectedTools: prev.selectedTools.filter(t => t.id !== tool.id)
            }));
        } else {
            setCampaignData(prev => ({
                ...prev,
                selectedTools: [...prev.selectedTools, tool]
            }));
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerInfo}>
                    <h2 className={styles.title}>Elite Campaign Manager</h2>
                    <p className={styles.subtitle}>Curate the best of HUBly and broadcast to your audience.</p>
                </div>
                <Button 
                    variant="primary" 
                    icon={Send}
                    iconSize={18}
                    onClick={handleBroadcast}
                    isLoading={isSubmitting}
                    disabled={campaignData.selectedTools.length === 0 || !campaignData.subject}
                >
                    Broadcast to All
                </Button>
            </div>

            <div className={styles.grid}>
                {/* 1. Configuration Panel */}
                <div className={styles.configPanel}>
                    <section className={styles.section}>
                        <h4 className={styles.sectionTitle}><Sparkles size={16} /> Campaign Identity</h4>
                        <div className={styles.inputGroup}>
                            <label>Email Subject Line</label>
                            <Input 
                                placeholder="e.g., HUBly Weekly #42: Top AI Tools for Creators"
                                value={campaignData.subject}
                                onChange={(e) => setCampaignData(prev => ({ ...prev, subject: e.target.value }))}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Intro Message (Editor's Note)</label>
                            <textarea 
                                className={styles.textarea}
                                placeholder="Write a catchy intro for your subscribers..."
                                value={campaignData.intro}
                                onChange={(e) => setCampaignData(prev => ({ ...prev, intro: e.target.value }))}
                            />
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h4 className={styles.sectionTitle}><Layout size={16} /> Curate Tools ({campaignData.selectedTools.length})</h4>
                        <div className={styles.searchWrapper}>
                            <Search className={styles.searchIcon} size={18} />
                            <input 
                                type="text"
                                className={styles.searchInput}
                                placeholder="Search tools to add..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <div className={styles.toolSelector}>
                            {isSearching ? (
                                <div style={{ padding: '10px', color: '#888', fontSize: '12px', textAlign: 'center' }}>Searching HUBly database...</div>
                            ) : liveTools.map(tool => {
                                const isSelected = campaignData.selectedTools.find(t => t.id === tool.id);
                                return (
                                    <div 
                                        key={tool.id} 
                                        className={`${styles.toolOption} ${isSelected ? styles.selected : ''}`}
                                        onClick={() => toggleTool(tool)}
                                    >
                                        <img src={tool.image_url} alt={tool.name} className={styles.toolIcon} />
                                        <span className={styles.toolName}>{tool.name}</span>
                                        {isSelected ? <Trash2 size={16} /> : <Plus size={16} />}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h4 className={styles.sectionTitle}><Gift size={16} /> Special Offer (Optional)</h4>
                        <div className={styles.inputGroup}>
                            <Input 
                                placeholder="Offer Title (e.g., 50% Off Hubly Pro)"
                                value={campaignData.specialOffer.title}
                                onChange={(e) => setCampaignData(prev => ({ 
                                    ...prev, 
                                    specialOffer: { ...prev.specialOffer, title: e.target.value } 
                                }))}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <textarea 
                                className={styles.textarea}
                                placeholder="Offer description..."
                                value={campaignData.specialOffer.description}
                                onChange={(e) => setCampaignData(prev => ({ 
                                    ...prev, 
                                    specialOffer: { ...prev.specialOffer, description: e.target.value } 
                                }))}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input 
                                placeholder="Offer Link"
                                value={campaignData.specialOffer.link}
                                onChange={(e) => setCampaignData(prev => ({ 
                                    ...prev, 
                                    specialOffer: { ...prev.specialOffer, link: e.target.value } 
                                }))}
                            />
                        </div>
                    </section>
                </div>

                {/* 2. Live Preview */}
                <div className={styles.previewPanel}>
                    <h4 className={styles.sectionTitle}>Elite Live Preview</h4>
                    <div className={styles.emailPreview}>
                        <div className={styles.emailHeader}>
                            <div className={styles.brand}><span style={{ color: 'white' }}>HUB</span><span className={styles.accent}>ly</span></div>
                        </div>
                        <div className={styles.emailContent}>
                            <div className={styles.previewBadge}>WEEKLY SPOTLIGHT</div>
                            <h2 className={styles.previewSubject}>{campaignData.subject || 'Campaign Subject'}</h2>
                            <p className={styles.previewIntro}>{campaignData.intro || 'Your intro message will appear here...'}</p>
                            
                            <div className={styles.previewTools}>
                                {campaignData.selectedTools.length === 0 ? (
                                    <div className={styles.emptyPreview}>No tools selected yet.</div>
                                ) : (
                                    campaignData.selectedTools.map(tool => (
                                        <div key={tool.id} className={styles.previewToolCard}>
                                            <img src={tool.image_url} alt="" className={styles.previewToolImg} />
                                            <div className={styles.previewToolInfo}>
                                                <h5>{tool.name}</h5>
                                                <p>{tool.short_description}</p>
                                                <span className={styles.previewLink}>VIEW TOOL DETAILS →</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {campaignData.specialOffer.title && (
                                <div className={styles.previewOffer}>
                                    <span className={styles.offerBadge}>EXCLUSIVE OFFER</span>
                                    <h4>{campaignData.specialOffer.title}</h4>
                                    <p>{campaignData.specialOffer.description}</p>
                                    <div className={styles.offerBtn}>REDEEM OFFER</div>
                                </div>
                            )}
                            
                            <p style={{ marginTop: '40px', fontSize: '12px', color: '#888', textAlign: 'center' }}>
                                Join 10,000+ creators. Get the latest AI tools and exclusive deals to your inbox.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNewsletterManager;
