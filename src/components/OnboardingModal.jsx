import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Zap, Rocket } from 'lucide-react';
import Button from './ui/Button';
import styles from './OnboardingModal.module.css';

const OnboardingModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [role, setRole] = useState(null); // 'seeker' or 'publisher'

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem('onboarding_completed');
        if (!hasSeenOnboarding) {
            setIsOpen(true);
        }
    }, []);

    const handleComplete = () => {
        localStorage.setItem('onboarding_completed', 'true');
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.card}>
                <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                    <X size={20} />
                </button>

                {step === 1 ? (
                    <div className={styles.stepContent}>
                        <div className={styles.badge}>WELCOME TO HUBLY</div>
                        <h2>What&apos;s your <span className="gradient-text">Mission</span>?</h2>
                        <p>We&apos;ve tailored the platform to suit your specific needs. Tell us who you are.</p>

                        <div className={styles.roleSelection}>
                            <button
                                className={`${styles.roleCard} ${role === 'seeker' ? styles.roleCardActive : ''}`}
                                onClick={() => { setRole('seeker'); setStep(2); }}
                            >
                                <div className={styles.roleIconBg}><Zap size={32} /></div>
                                <h3>Tool Seeker</h3>
                                <p>I&apos;m here to find AI tools to boost my work.</p>
                            </button>
                            <button
                                className={`${styles.roleCard} ${role === 'publisher' ? styles.roleCardActive : ''}`}
                                onClick={() => { setRole('publisher'); setStep(2); }}
                            >
                                <div className={styles.roleIconBg}><Rocket size={32} /></div>
                                <h3>Tool Publisher</h3>
                                <p>I&apos;m here to list and promote my SaaS.</p>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.stepContent}>
                        <div className={styles.badge}>{role === 'seeker' ? 'FOR TOOL SEEKERS' : 'FOR TOOL PUBLISHERS'}</div>
                        <h2>3 Easy Steps to <span className="gradient-text">Success</span></h2>

                        <div className={styles.stepsList}>
                            {role === 'seeker' ? (
                                <>
                                    <div className={styles.guideItem}>
                                        <div className={styles.stepNum}>1</div>
                                        <div>
                                            <strong>Browse Categories</strong>
                                            <p>Explore tools grouped by use-case for productivity, design, and more.</p>
                                        </div>
                                    </div>
                                    <div className={styles.guideItem}>
                                        <div className={styles.stepNum}>2</div>
                                        <div>
                                            <strong>Compare Specs</strong>
                                            <p>Check pricing, features, and ratings before you commit.</p>
                                        </div>
                                    </div>
                                    <div className={styles.guideItem}>
                                        <div className={styles.stepNum}>3</div>
                                        <div>
                                            <strong>Join the Club</strong>
                                            <p>Save tools to your profile and get notified of new updates.</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={styles.guideItem}>
                                        <div className={styles.stepNum}>1</div>
                                        <div>
                                            <strong>Submit Your Tool</strong>
                                            <p>Fill out our simple form to list your SaaS in front of thousands.</p>
                                        </div>
                                    </div>
                                    <div className={styles.guideItem}>
                                        <div className={styles.stepNum}>2</div>
                                        <div>
                                            <strong>Go Featured</strong>
                                            <p>Activate a promotion plan to appear on our homepage banner.</p>
                                        </div>
                                    </div>
                                    <div className={styles.guideItem}>
                                        <div className={styles.stepNum}>3</div>
                                        <div>
                                            <strong>Analyze Traffic</strong>
                                            <p>Use our dashboard to see how many founders are clicking your tool.</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className={styles.actions}>
                            <Button variant="secondary" onClick={() => setStep(1)} className={styles.backBtn}>Back</Button>
                            <Button variant="primary" onClick={handleComplete} className={styles.startBtn} icon={ArrowRight} iconPosition="right">Get Started</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OnboardingModal;


