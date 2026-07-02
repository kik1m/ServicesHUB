import React, { useState } from 'react';
import Image from 'next/image';
import styles from './OnboardingModal.module.css';
import { supabase } from '../../lib/supabaseClient';
import Button from '../ui/Button';
import { Code, Briefcase, TrendingUp, PenTool, CheckCircle, Rocket, BookOpen, Layers } from 'lucide-react';

const ROLES = [
    { id: 'Developer', icon: Code, label: 'Developer', desc: 'I write code and build software.' },
    { id: 'Founder', icon: Rocket, label: 'Founder / CEO', desc: 'I am building a startup or product.' },
    { id: 'Marketer', icon: TrendingUp, label: 'Marketer', desc: 'I focus on growth, SEO, and sales.' },
    { id: 'Designer', icon: PenTool, label: 'Designer', desc: 'I design UI/UX and visual content.' },
    { id: 'Product Manager', icon: Layers, label: 'Product Manager', desc: 'I manage product roadmaps and strategy.' },
    { id: 'Student', icon: BookOpen, label: 'Student', desc: 'I am learning and exploring tools.' },
    { id: 'Other', icon: Briefcase, label: 'Other', desc: 'I do a bit of everything.' }
];

const EXPERIENCES = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function OnboardingModal({ user, onComplete }) {
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedExp, setSelectedExp] = useState(null);
    const [goal, setGoal] = useState('');
    const [saving, setSaving] = useState(false);

    const [customRole, setCustomRole] = useState('');

    const handleSave = async () => {
        if (!selectedRole || !selectedExp) return;
        const finalRole = selectedRole === 'Other' && customRole.trim() ? customRole.trim() : selectedRole;
        
        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    job_title: finalRole,
                    experience_level: selectedExp,
                    primary_goal: goal || 'Exploring tools'
                })
                .eq('id', user.id);

            if (error) throw error;
            onComplete({ job_title: finalRole, experience_level: selectedExp, primary_goal: goal });
        } catch (error) {
            console.error("Failed to save onboarding data:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.progress}>
                    <div className={styles.bar} style={{ width: `${(step / 3) * 100}%` }} />
                </div>
                
                {step === 1 && (
                    <div className={styles.stepContainer}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
                            <Image src="/logo.png" alt="HUBly" width={32} height={32} />
                            <h2 style={{ margin: 0 }}>Welcome to HUBly!</h2>
                        </div>
                        <p>To personalize your AI Studio, what describes you best?</p>
                        <div className={styles.grid}>
                            {ROLES.map(r => {
                                const Icon = r.icon;
                                const isSelected = selectedRole === r.id;
                                return (
                                    <div 
                                        key={r.id}
                                        className={`${styles.card} ${isSelected ? styles.cardActive : ''}`}
                                        onClick={() => setSelectedRole(r.id)}
                                    >
                                        <Icon size={24} className={styles.cardIcon} />
                                        <h4>{r.label}</h4>
                                        <span>{r.desc}</span>
                                        {isSelected && <CheckCircle className={styles.checkIcon} size={18} />}
                                    </div>
                                );
                            })}
                        </div>
                        
                        {selectedRole === 'Other' && (
                            <input 
                                type="text"
                                className={styles.customInput}
                                placeholder="Please specify your role..."
                                value={customRole}
                                onChange={(e) => setCustomRole(e.target.value)}
                                autoFocus
                            />
                        )}

                        <Button 
                            variant="primary" 
                            disabled={!selectedRole || (selectedRole === 'Other' && !customRole.trim())}
                            onClick={() => setStep(2)}
                            style={{ width: '100%', marginTop: '1.5rem' }}
                        >
                            Continue
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className={styles.stepContainer}>
                        <h2>What is your tech experience? ⚙️</h2>
                        <p>This helps the AI explain concepts at the right level.</p>
                        <div className={styles.list}>
                            {EXPERIENCES.map(exp => (
                                <div 
                                    key={exp}
                                    className={`${styles.listItem} ${selectedExp === exp ? styles.listActive : ''}`}
                                    onClick={() => setSelectedExp(exp)}
                                >
                                    {exp}
                                </div>
                            ))}
                        </div>
                        <div className={styles.actions}>
                            <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                            <Button variant="primary" disabled={!selectedExp} onClick={() => setStep(3)}>Continue</Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className={styles.stepContainer}>
                        <h2>What's your primary goal? 🎯</h2>
                        <p>What are you hoping to achieve using HUBly?</p>
                        <textarea 
                            className={styles.textarea}
                            placeholder="e.g. I want to build a SaaS app but don't know where to start..."
                            value={goal}
                            onChange={e => setGoal(e.target.value)}
                        />
                        <div className={styles.infoNote}>
                            <p style={{fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', margin: '1rem 0'}}>💡 You can update this data later at any time from your <strong>General Account Settings</strong>.</p>
                        </div>
                        <div className={styles.actions}>
                            <Button variant="ghost" onClick={() => setStep(2)} disabled={saving}>Back</Button>
                            <Button variant="primary" disabled={saving || !goal.trim()} onClick={handleSave}>
                                {saving ? 'Saving...' : 'Finish Setup'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
