import React from 'react';
import { AlertTriangle, Loader, Info } from 'lucide-react';
import dynamic from 'next/dynamic';

const MarkdownRenderer = dynamic(() => import('../MarkdownRenderer'), { ssr: false });
import './theme.css'; // Global CSS variables
import styles from './SharedComponents.module.css';

// Keep T for backward compatibility with older components if they still exist
export const T = {
  bg:        'rgba(15,23,42,0.75)',
  bgHover:   'rgba(15,23,42,0.95)',
  border:    'rgba(255,255,255,0.07)',
  borderFocus:'rgba(0,210,255,0.35)',
  text:      '#e2e8f0',
  textMuted: '#94a3b8',
  textDim:   '#64748b',
  accent:    '#00d2ff',
  accentBg:  'rgba(0,210,255,0.08)',
  green:     '#10b981',
  greenBg:   'rgba(16,185,129,0.08)',
  yellow:    '#f59e0b',
  yellowBg:  'rgba(245,158,11,0.08)',
  red:       '#ef4444',
  redBg:     'rgba(239,68,68,0.08)',
  purple:    '#a855f7',
  purpleBg:  'rgba(168,85,247,0.08)',
  radius:    '12px',
  radiusSm:  '8px',
};

// Strip common Markdown formatting characters from plain text used inside components
export const stripMd = (str = '') =>
  String(str)
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // **bold**
    .replace(/\*([^*]+)\*/g, '$1')       // *italic*
    .replace(/__([^_]+)__/g, '$1')       // __bold__
    .replace(/_([^_]+)_/g, '$1')         // _italic_
    .replace(/~~([^~]+)~~/g, '$1')       // ~~strikethrough~~
    .replace(/`([^`]+)`/g, '$1')         // `code`
    .trim();

export const Wrapper = ({ children, style, className = '' }) => (
  <div className={`${styles.wrapper} ${className}`} style={style}>
    {children}
  </div>
);

export const Header = ({ icon, title, badge, badgeColor }) => (
  <div className={styles.header}>
    {icon && <span className={styles.icon}>{icon}</span>}
    <div className={styles.title}>{title}</div>
    {badge && (
      <div className={styles.badge} style={{ color: badgeColor || 'var(--hub-text-muted)' }}>
        {badge}
      </div>
    )}
  </div>
);

export const Body = ({ children, style, className = '' }) => (
  <div className={`${styles.body} ${className}`} style={style}>
    {children}
  </div>
);

export const parseMarkdownTable = (rawLines) => {
  let headers = [];
  let rows = [];
  let isRow = false;

  // Attempt JSON parsing first
  try {
    const rawStr = Array.isArray(rawLines) ? rawLines.join('\n') : rawLines;
    let cleanStr = rawStr.trim();
    if (cleanStr.startsWith('```')) {
        cleanStr = cleanStr.replace(/^```[a-z]*\s*\n/i, '').replace(/\n\s*```$/i, '').trim();
    }
    if (cleanStr.startsWith('{')) {
        const data = JSON.parse(cleanStr);
        if (data.columns && data.rows) {
            headers = data.columns;
            rows = data.rows.map(r => [r.feature, ...(r.values || [])]);
            return { headers, rows };
        }
    }
  } catch(e) {}

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed.includes('|')) continue;
    if (trimmed.includes('---')) { isRow = true; continue; }
    
    const cells = trimmed.split('|').map(c => stripMd(c.trim())).filter(Boolean);
    if (!isRow) headers = cells;
    else rows.push(cells);
  }
  return { headers, rows };
};

export const parsePipeLines = (rawLines) => {
  // Attempt JSON parsing first
  try {
    const rawStr = Array.isArray(rawLines) ? rawLines.join('\n') : rawLines;
    let cleanStr = rawStr.trim();
    if (cleanStr.startsWith('```')) {
        cleanStr = cleanStr.replace(/^```[a-z]*\s*\n/i, '').replace(/\n\s*```$/i, '').trim();
    }
    if (cleanStr.startsWith('{')) {
        const data = JSON.parse(cleanStr);
        let arr = data.stats || data.items || data.plans || data.metrics || data.tasks || data.phases;
        if (!arr) {
          // Find the first array property
          const arrayKey = Object.keys(data).find(k => Array.isArray(data[k]));
          if (arrayKey) arr = data[arrayKey];
        }
        
        if (arr && Array.isArray(arr)) {
            return arr.map(a => ({
                label: a.label || a.name || a.title || a.metric || a.phase || a.task || '',
                value: a.value || a.price || a.amount || a.before || String(a.progress || '') || '',
                meta: a.trend || a.percentage || a.after || a.status || '',
                extra: a.improvement || a.extra || ''
            }));
        }
    }
  } catch(e) {}

  return rawLines
    .map(l => l.trim())
    .filter(l => l.includes('|') && !l.includes('---'))
    .map(l => {
      const parts = l.split('|').map(p => p.trim()).filter(Boolean);
      return {
        label: parts[0] || '',
        value: parts[1] || '',
        meta: parts[2] || '',
        extra: parts[3] || ''
      };
    }).filter(i => i.label);
};

export const parseJson = (rawLines) => {
  try {
    const rawStr = Array.isArray(rawLines) ? rawLines.join('\n') : rawLines;
    let cleanStr = rawStr.trim();
    if (cleanStr.startsWith('```')) {
        cleanStr = cleanStr.replace(/^```[a-z]*\s*\n/i, '').replace(/\n\s*```$/i, '').trim();
    }
    if (cleanStr.startsWith('{') || cleanStr.startsWith('[')) {
        return JSON.parse(cleanStr);
    }
  } catch(e) {
    // Silently fail during streaming
  }
  return null;
};

export const RawFallback = ({ title, raw, type, isComplete }) => {
  const rawText = Array.isArray(raw) ? raw.join('\n') : raw;
  
  if (isComplete === false) {
    return (
      <Wrapper>
        <Header icon={<Loader className="animate-spin" size={16} />} title={title || 'Building...'} badge="Building" badgeColor="#00d2ff" />
        <Body>
          <div className={styles.loadingBody}>
            <MarkdownRenderer content={rawText} isStreaming={true} />
          </div>
        </Body>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Header icon={<Info size={16} />} title={title || 'Data Component'} badge={type || 'Details'} badgeColor="var(--hub-accent)" />
      <Body className={styles.largePaddingBody}>
        <MarkdownRenderer content={rawText} isStreaming={false} />
      </Body>
    </Wrapper>
  );
};
