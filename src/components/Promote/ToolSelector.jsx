import React from 'react';
import { Layout, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import SkeletonLoader from '../SkeletonLoader';
import CustomSelect from '../CustomSelect';

const ToolSelector = ({ toolName, loadingTools, userTools, selectedToolId, setSelectedToolId }) => {
    return (
        <section className="promote-step-card" style={{ marginBottom: '2.5rem' }}>
            <div className="section-header-compact">
                <div className="badge-step">STEP 1</div>
                <h3>Pick Your Tool</h3>
            </div>
            
            <div className="glass-card" style={{ padding: '1.2rem 1.8rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                            {toolName ? "Selected tool for this promotion campaign." : "Choose the approved tool you want to promote."}
                        </p>
                    </div>

                    <div style={{ flex: '1', maxWidth: '350px', minWidth: '260px' }}>
                        {toolName ? (
                            <div style={{ 
                                padding: '10px 18px', background: 'rgba(var(--primary-rgb), 0.08)', 
                                borderRadius: '10px', border: '1px solid rgba(var(--primary-rgb), 0.2)',
                                display: 'flex', alignItems: 'center', gap: '10px', color: 'white', fontWeight: '700',
                                fontSize: '0.9rem'
                            }}>
                                <Zap size={16} className="text-primary" /> {toolName}
                            </div>
                        ) : (
                            loadingTools ? (
                                <SkeletonLoader height="42px" width="100%" borderRadius="10px" />
                            ) : userTools.length > 0 ? (
                                <CustomSelect
                                    options={userTools}
                                    value={selectedToolId}
                                    onChange={(val) => setSelectedToolId(val)}
                                    placeholder="Select a tool..."
                                    icon={Layout}
                                    style={{ marginBottom: '0' }}
                                />
                            ) : (
                                <Link to="/submit" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '700', textDecoration: 'none' }}>
                                    No approved tools yet. Click to submit &rarr;
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ToolSelector;
