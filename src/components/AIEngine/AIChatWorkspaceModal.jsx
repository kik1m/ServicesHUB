import React from 'react';
import { Settings, X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { AI_ENGINE_CONSTANTS } from '../../constants/aiEngineConstants';
import styles from './AIEngineModals.module.css';

export default function AIChatWorkspaceModal({ workspaceProps, user }) {
    const { 
        isWorkspaceModalOpen, setIsWorkspaceModalOpen,
        workspaceStep, setWorkspaceStep,
        workspaceContext, setWorkspaceContext
    } = workspaceProps;

    if (!isWorkspaceModalOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeBtn} onClick={() => setIsWorkspaceModalOpen(false)}>
                    <X size={24} />
                </button>
                <div className={styles.modalHeader}>
                    <Settings size={32} />
                    <h3>{AI_ENGINE_CONSTANTS.workspaceModal.title}</h3>
                </div>
                <p style={{ fontSize: '0.95rem', color: '#94a3b8', marginBottom: '20px', lineHeight: '1.7' }}>
                    {AI_ENGINE_CONSTANTS.workspaceModal.description}
                </p>
                
                <div className={styles.workspaceStepsIndicator}>
                    <div className={`${styles.stepDot} ${workspaceStep >= 1 ? styles.activeDot : ''}`} />
                    <div className={`${styles.stepDot} ${workspaceStep >= 2 ? styles.activeDot : ''}`} />
                    <div className={`${styles.stepDot} ${workspaceStep >= 3 ? styles.activeDot : ''}`} />
                </div>
                
                {workspaceStep === 1 && (
                    <div className={styles.formGroup}>
                        <Input 
                            label="What's your core idea or project name?"
                            placeholder="e.g. A CRM for real estate agents..."
                            value={workspaceContext.idea}
                            onChange={(e) => setWorkspaceContext({...workspaceContext, idea: e.target.value})}
                        />
                        <div className={styles.modalActions}>
                            <Button onClick={() => setWorkspaceStep(2)} disabled={!workspaceContext.idea}>Next</Button>
                        </div>
                    </div>
                )}

                {workspaceStep === 2 && (
                    <div className={styles.formGroup}>
                        <Input 
                            multiline={true}
                            rows={3}
                            label="What is the ultimate goal?"
                            placeholder="e.g. Reach $10k MRR by Q4..."
                            value={workspaceContext.goal}
                            onChange={(e) => setWorkspaceContext({...workspaceContext, goal: e.target.value})}
                        />
                        <div className={styles.modalActions} style={{ justifyContent: 'space-between' }}>
                            <Button variant="ghost" onClick={() => setWorkspaceStep(1)}>Back</Button>
                            <Button onClick={() => setWorkspaceStep(3)} disabled={!workspaceContext.goal}>Next</Button>
                        </div>
                    </div>
                )}

                {workspaceStep === 3 && (
                    <div className={styles.formGroup}>
                        <Input 
                            multiline={true}
                            rows={3}
                            label="Any specific rules or tone for the AI?"
                            placeholder="e.g. Always be concise. Recommend low-cost tools."
                            value={workspaceContext.rules}
                            onChange={(e) => setWorkspaceContext({...workspaceContext, rules: e.target.value})}
                        />
                        <div className={styles.modalActions} style={{ justifyContent: 'space-between' }}>
                            <Button variant="ghost" onClick={() => setWorkspaceStep(2)}>Back</Button>
                            <Button variant="primary" onClick={() => setIsWorkspaceModalOpen(false)}>Save Workspace</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
