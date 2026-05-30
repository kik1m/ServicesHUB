import React from 'react';
import { Settings } from 'lucide-react';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { AI_ENGINE_CONSTANTS } from '../../constants/aiEngineConstants';
import styles from './AIEngineModals.module.css';

export default function AIEngineModals({
    actionModal,
    setActionModal,
    editingTitle,
    setEditingTitle,
    handleRenameSubmit,
    handleDeleteConfirm,
    aiSettings,
    setAiSettings
}) {
    if (!actionModal) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                {actionModal.type === 'rename' && (
                    <form onSubmit={handleRenameSubmit}>
                        <h3 className={styles.modalHeader}>{AI_ENGINE_CONSTANTS.modals.renameSession}</h3>
                        <input 
                            autoFocus
                            type="text"
                            value={editingTitle}
                            onChange={e => setEditingTitle(e.target.value)}
                            className={styles.modalInput}
                        />
                        <div className={styles.modalActions}>
                            <Button variant="ghost" onClick={() => setActionModal(null)}>{AI_ENGINE_CONSTANTS.modals.cancel}</Button>
                            <Button variant="primary" type="submit">{AI_ENGINE_CONSTANTS.modals.save}</Button>
                        </div>
                    </form>
                )}
                {actionModal.type === 'delete' && (
                    <div>
                        <h3 className={`${styles.modalHeader} ${styles.modalHeaderDelete}`}>{AI_ENGINE_CONSTANTS.modals.deleteSessionTitle}</h3>
                        <p className={styles.modalDesc}>{AI_ENGINE_CONSTANTS.modals.deleteSessionDesc}</p>
                        <div className={styles.modalActions}>
                            <Button variant="ghost" onClick={() => setActionModal(null)}>{AI_ENGINE_CONSTANTS.modals.cancel}</Button>
                            <Button variant="danger" onClick={handleDeleteConfirm}>{AI_ENGINE_CONSTANTS.modals.delete}</Button>
                        </div>
                    </div>
                )}
                {actionModal.type === 'settings' && (
                    <div>
                        <h3 className={`${styles.modalHeader} ${styles.modalHeaderSettings}`}>
                            <Settings size={18} /> {AI_ENGINE_CONSTANTS.modals.settingsTitle}
                        </h3>
                        
                        <div className={styles.formGroup}>
                            <Select 
                                label={AI_ENGINE_CONSTANTS.modals.tone}
                                value={aiSettings.tone} 
                                onChange={val => setAiSettings({...aiSettings, tone: val})}
                                options={[
                                    { value: 'default', label: 'Balanced (Default)' },
                                    { value: 'concise', label: 'Concise & Direct' },
                                    { value: 'detailed', label: 'Detailed & Explanatory' },
                                    { value: 'creative', label: 'Creative & Enthusiastic' }
                                ]}
                            />
                        </div>

                        <div className={`${styles.formGroup} ${styles.formGroupLast}`}>
                            <Select 
                                label={AI_ENGINE_CONSTANTS.modals.language}
                                value={aiSettings.language} 
                                onChange={val => setAiSettings({...aiSettings, language: val})}
                                options={[
                                    { value: 'auto', label: 'Auto-Detect' },
                                    { value: 'en', label: 'English Always' },
                                    { value: 'ar', label: 'Arabic Always' }
                                ]}
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <Button variant="primary" onClick={() => setActionModal(null)}>{AI_ENGINE_CONSTANTS.modals.done}</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
