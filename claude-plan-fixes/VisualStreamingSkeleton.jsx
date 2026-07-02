'use client';
import React, { useState, useEffect } from 'react';

const MESSAGES = [
    'Architecting your component...',
    'Applying design system...',
    'Building visual layout...',
    'Polishing details...',
];

export default function VisualStreamingSkeleton() {
    const [msgIdx, setMsgIdx] = useState(0);
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const msgTimer = setInterval(() => {
            setMsgIdx(i => (i + 1) % MESSAGES.length);
        }, 2200);
        const secTimer = setInterval(() => setElapsed(s => s + 1), 1000);
        return () => { clearInterval(msgTimer); clearInterval(secTimer); };
    }, []);

    return (
        <div style={{
            margin: '16px 0',
            padding: '20px 24px',
            borderRadius: '16px',
            border: '1px solid rgba(0,210,255,0.12)',
            background: 'rgba(0,210,255,0.02)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Animated top border */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: 'linear-gradient(90deg,transparent,#00d2ff,transparent)',
                animation: 'vss-scan 2s linear infinite',
            }} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <div style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: '#00d2ff',
                    boxShadow: '0 0 12px rgba(0,210,255,0.7)',
                    animation: 'vss-pulse 1.2s ease-in-out infinite',
                }} />
                <span style={{ fontSize: '12px', color: '#00d2ff', fontWeight: 700, letterSpacing: '0.5px' }}>
                    {MESSAGES[msgIdx]}
                </span>
                <span style={{
                    marginLeft: 'auto', fontSize: '11px', color: '#475569',
                    background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '100px',
                }}>
                    {elapsed}s
                </span>
            </div>

            {/* Skeleton lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Simulated header bar */}
                <div style={{
                    height: '20px', width: '40%', borderRadius: '6px',
                    background: 'linear-gradient(90deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.09) 50%,rgba(255,255,255,0.04) 100%)',
                    backgroundSize: '600px 100%',
                    animation: 'vss-shimmer 1.6s linear infinite',
                }} />

                {/* Grid of cards skeleton */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px' }}>
                    {[1,2,3,4].map(i => (
                        <div key={i} style={{
                            height: '80px', borderRadius: '12px',
                            background: 'linear-gradient(90deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.07) 50%,rgba(255,255,255,0.03) 100%)',
                            backgroundSize: '600px 100%',
                            animation: 'vss-shimmer 1.6s linear infinite',
                            animationDelay: `${i * 0.12}s`,
                        }} />
                    ))}
                </div>

                {/* Bottom lines */}
                {[85, 70, 90].map((w, i) => (
                    <div key={i} style={{
                        height: '12px', width: `${w}%`, borderRadius: '6px',
                        background: 'linear-gradient(90deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.07) 50%,rgba(255,255,255,0.03) 100%)',
                        backgroundSize: '600px 100%',
                        animation: 'vss-shimmer 1.6s linear infinite',
                        animationDelay: `${(i + 4) * 0.12}s`,
                    }} />
                ))}
            </div>

            <style>{`
                @keyframes vss-pulse  { 0%,100%{opacity:0.5;transform:scale(0.85)} 50%{opacity:1;transform:scale(1.15)} }
                @keyframes vss-shimmer{ 0%{background-position:-600px 0} 100%{background-position:600px 0} }
                @keyframes vss-scan   { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
            `}</style>
        </div>
    );
}
