'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Users, MapPin, MousePointer2, TrendingUp, AlertCircle } from 'lucide-react';
import styles from './AdminAnalytics.module.css';

/**
 * AdminAnalytics - Elite Platform Insights (Next.js Port)
 */
const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    totalUniqueVisitors: 0,
    topPages: [],
    topCountries: [],
    loading: true,
    error: null
  });

  const fetchAnalytics = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));

      // 1. Get session token for authentication
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // 2. Fetch data from secure server route
      const res = await fetch('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to fetch analytics');
      }

      const allData = await res.json();

      if (!allData || allData.length === 0) {
        setStats({
          totalUniqueVisitors: 0,
          topPages: [],
          topCountries: [],
          loading: false,
          error: null
        });
        return;
      }

      // 2. Process unique visitors
      const uniqueVisitors = new Set(allData.map(v => v.visitor_id)).size;

      // 3. Process top pages
      const pageUniqueMap = allData.reduce((acc, curr) => {
        if (!acc[curr.page_path]) acc[curr.page_path] = new Set();
        acc[curr.page_path].add(curr.visitor_id);
        return acc;
      }, {});

      const sortedPages = Object.entries(pageUniqueMap)
        .map(([path, visitorSet]) => ({ path, count: visitorSet.size }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // 4. Process top countries
      const countryUniqueMap = allData.reduce((acc, curr) => {
        const country = curr.country || 'Unknown';
        if (!acc[country]) acc[country] = new Set();
        acc[country].add(curr.visitor_id);
        return acc;
      }, {});

      const sortedCountries = Object.entries(countryUniqueMap)
        .map(([name, visitorSet]) => ({ name, count: visitorSet.size }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        totalUniqueVisitors: uniqueVisitors,
        topPages: sortedPages,
        topCountries: sortedCountries,
        loading: false,
        error: null
      });

    } catch (err) {
      console.error('Error fetching analytics:', err);
      setStats(prev => ({ ...prev, loading: false, error: err.message }));
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (stats.loading) return <div className={styles.loader}>Loading insights...</div>;
  if (stats.error) return (
    <div className={styles.error}>
      <AlertCircle size={20} />
      <span>Error loading data: {stats.error}</span>
    </div>
  );

  return (
    <div className={`${styles.container} fade-in`}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <TrendingUp className={styles.iconTitle} />
          <h2>Platform Insights (Internal)</h2>
        </div>
        <button onClick={fetchAnalytics} className={styles.refreshBtn}>Refresh</button>
      </header>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Users size={20} />
            <h3>Total Unique Visitors</h3>
          </div>
          <div className={styles.bigNumber}>{stats.totalUniqueVisitors}</div>
          <p className={styles.cardSub}>Unique users reached the platform</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <MousePointer2 size={20} />
            <h3>Top Visited Pages</h3>
          </div>
          <div className={styles.list}>
            {stats.topPages.map((item, i) => (
              <div key={i} className={styles.listItem}>
                <span className={styles.path}>{item.path}</span>
                <span className={styles.count}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <MapPin size={20} />
            <h3>Visitors by Country</h3>
          </div>
          <div className={styles.list}>
            {stats.topCountries.map((item, i) => (
              <div key={i} className={styles.listItem}>
                <span className={styles.country}>{item.name}</span>
                <div className={styles.progressWrap}>
                  <div 
                    className={styles.progressBar} 
                    style={{ width: `${(item.count / (stats.totalUniqueVisitors || 1)) * 100}%` }}
                  />
                  <span className={styles.count}>{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
