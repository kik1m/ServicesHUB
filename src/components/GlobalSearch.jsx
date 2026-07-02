'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Loader2, X, ArrowRight } from 'lucide-react';
import { getIcon } from '../utils/iconMap.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { toolsService } from '../services/toolsService';
import { profilesService } from '../services/profilesService';
import { supabase } from '../lib/supabaseClient';
import SmartImage from './ui/SmartImage';
import styles from './GlobalSearch.module.css';

const GlobalSearch = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ tools: [], users: [], categories: [], loading: false });
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all'); // mobile tabs: 'all' | 'tools' | 'categories' | 'makers'
    const router = useRouter();
    const queryClient = useQueryClient();
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    // 🚀 Elite Search: Debounced & Triple Parallel Fetch
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 1) {
                setResults(prev => ({ ...prev, loading: true }));

                try {
                    const [toolsRes, usersRes, catsRes] = await Promise.all([
                        supabase
                            .from('tools')
                            .select('id, name, slug, image_url, pricing_type')
                            .ilike('name', `%${query}%`)
                            .eq('is_approved', true)
                            .limit(5),
                        profilesService.searchProfiles(query),
                        supabase
                            .from('categories')
                            .select('id, name, slug, icon_name, tools(count)')
                            .ilike('name', `%${query}%`)
                            .limit(4),
                    ]);

                    setResults({
                        tools: toolsRes.data || [],
                        users: usersRes || [],
                        categories: catsRes.data || [],
                        loading: false,
                    });
                    setActiveTab('all');
                } catch (err) {
                    console.error('Search error:', err);
                    setResults(prev => ({ ...prev, loading: false }));
                }
            } else {
                setResults({ tools: [], users: [], categories: [], loading: false });
            }
        }, 150);

        return () => clearTimeout(timer);
    }, [query]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const closeSearch = () => {
        setIsOpen(false);
        setQuery('');
        if (onClose) onClose();
    };

    const hasResults = results.tools.length > 0 || results.users.length > 0 || results.categories.length > 0;

    // Filter results for mobile tabs
    const tabTools = activeTab === 'all' || activeTab === 'tools' ? results.tools : [];
    const tabCategories = activeTab === 'all' || activeTab === 'categories' ? results.categories : [];
    const tabUsers = activeTab === 'all' || activeTab === 'makers' ? results.users : [];

    return (
        <div className={styles.container} ref={searchRef}>
            {/* Search Input */}
            <div className={`${styles.searchWrapper} ${isOpen ? styles.active : ''}`}>
                <Search size={18} className={styles.icon} />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search tools, categories or makers..."
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
                    onFocus={() => setIsOpen(true)}
                    className={styles.input}
                />
                {query && (
                    <button onClick={() => setQuery('')} className={styles.clearBtn}>
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {isOpen && (query.length >= 1 || results.loading) && (
                <div className={styles.dropdown}>
                    {results.loading ? (
                        <div className={styles.loader}>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Searching HUBly...</span>
                        </div>
                    ) : !hasResults ? (
                        <div className={styles.noResults}>
                            No results found for &ldquo;{query}&rdquo;
                        </div>
                    ) : (
                        <>
                            {/* Mobile Tabs */}
                            <div className={styles.mobileTabs}>
                                {[
                                    { key: 'all', label: 'All' },
                                    { key: 'tools', label: `Tools (${results.tools.length})` },
                                    { key: 'categories', label: `Categories (${results.categories.length})` },
                                    { key: 'makers', label: `Makers (${results.users.length})` },
                                ].map(tab => (
                                    <button
                                        key={tab.key}
                                        className={`${styles.mobileTab} ${activeTab === tab.key ? styles.mobileTabActive : ''}`}
                                        onClick={() => setActiveTab(tab.key)}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* 3-Column Grid */}
                            <div className={styles.columnsGrid}>
                                {/* Column 1: Tools */}
                                {(activeTab === 'all' || activeTab === 'tools') && tabTools.length > 0 && (
                                    <div className={styles.column}>
                                        <h4 className={styles.columnTitle}>
                                            <span className={styles.columnTitleDot} style={{ background: 'var(--accent-primary)' }} />
                                            AI &amp; SaaS Tools
                                        </h4>
                                        {tabTools.map(tool => (
                                            <Link
                                                key={tool.id}
                                                href={`/tool/${tool.slug}`}
                                                className={styles.resultItem}
                                                onClick={closeSearch}
                                                onMouseEnter={() => {
                                                    queryClient.prefetchQuery({
                                                        queryKey: ['tool', tool.slug],
                                                        queryFn: async () => {
                                                            const { data, error } = await toolsService.getToolBySlug(tool.slug);
                                                            if (error) throw error;
                                                            return data;
                                                        },
                                                        staleTime: 1000 * 60 * 10,
                                                    });
                                                }}
                                            >
                                                <div className={styles.itemImage}>
                                                    <SmartImage src={tool.image_url} alt={tool.name} />
                                                </div>
                                                <div className={styles.itemInfo}>
                                                    <span className={styles.itemName}>{tool.name}</span>
                                                    <span className={styles.itemSub}>{tool.pricing_type}</span>
                                                </div>
                                                <ArrowRight size={13} className={styles.itemArrow} />
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Column 2: Categories */}
                                {(activeTab === 'all' || activeTab === 'categories') && tabCategories.length > 0 && (
                                    <div className={styles.column}>
                                        <h4 className={styles.columnTitle}>
                                            <span className={styles.columnTitleDot} style={{ background: '#a855f7' }} />
                                            Categories
                                        </h4>
                                        {tabCategories.map(cat => (
                                            <Link
                                                key={cat.id}
                                                href={`/category/${cat.slug}`}
                                                className={styles.resultItem}
                                                onClick={closeSearch}
                                            >
                                                <div className={`${styles.itemImage} ${styles.isCat}`}>
                                                    {getIcon(cat.icon_name || 'LayoutGrid', 16)}
                                                </div>
                                                <div className={styles.itemInfo}>
                                                    <span className={styles.itemName}>{cat.name}</span>
                                                    <span className={styles.itemSub}>
                                                        {cat.tools?.[0]?.count > 0
                                                            ? `${cat.tools[0].count} tools`
                                                            : 'Category'}
                                                    </span>
                                                </div>
                                                <ArrowRight size={13} className={styles.itemArrow} />
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Column 3: Makers */}
                                {(activeTab === 'all' || activeTab === 'makers') && tabUsers.length > 0 && (
                                    <div className={styles.column}>
                                        <h4 className={styles.columnTitle}>
                                            <span className={styles.columnTitleDot} style={{ background: '#f59e0b' }} />
                                            Makers &amp; Community
                                        </h4>
                                        {tabUsers.map(user => (
                                            <Link
                                                key={user.id}
                                                href={`/u/${user.id}`}
                                                className={styles.resultItem}
                                                onClick={closeSearch}
                                            >
                                                <div className={`${styles.itemImage} ${styles.isUser}`}>
                                                    <SmartImage src={user.avatar_url} alt={user.full_name} />
                                                </div>
                                                <div className={styles.itemInfo}>
                                                    <span className={styles.itemName}>{user.full_name || 'Anonymous'}</span>
                                                    <span className={styles.itemSub}>{user.role || 'Member'}</span>
                                                </div>
                                                <ArrowRight size={13} className={styles.itemArrow} />
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer: See All */}
                            <Link
                                href={`/tools?search=${encodeURIComponent(query)}`}
                                className={styles.seeAll}
                                onClick={closeSearch}
                            >
                                See all results for &ldquo;{query}&rdquo;
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
