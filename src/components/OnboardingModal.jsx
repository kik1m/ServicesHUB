import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Zap, Rocket } from 'lucide-react';

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
        <div className="onboarding-overlay">
            <div className="onboarding-card glass-card fade-in">
                <button className="close-btn" onClick={() => setIsOpen(false)}>
                    <X size={20} />
                </button>

                {step === 1 ? (
                    <div className="step-content">
                        <div className="onboarding-badge">WELCOME TO HUBLY</div>
                        <h2>What&apos;s your <span className="gradient-text">Mission</span>?</h2>
                        <p>We&apos;ve tailored the platform to suit your specific needs. Tell us who you are.</p>

                        <div className="role-selection">
                            <button
                                className={`role-card ${role === 'seeker' ? 'active' : ''}`}
                                onClick={() => { setRole('seeker'); setStep(2); }}
                            >
                                <div className="role-icon-bg"><Zap size={32} /></div>
                                <h3>Tool Seeker</h3>
                                <p>I&apos;m here to find AI tools to boost my work.</p>
                            </button>
                            <button
                                className={`role-card ${role === 'publisher' ? 'active' : ''}`}
                                onClick={() => { setRole('publisher'); setStep(2); }}
                            >
                                <div className="role-icon-bg"><Rocket size={32} /></div>
                                <h3>Tool Publisher</h3>
                                <p>I&apos;m here to list and promote my SaaS.</p>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="step-content">
                        <div className="onboarding-badge">{role === 'seeker' ? 'FOR TOOL SEEKERS' : 'FOR TOOL PUBLISHERS'}</div>
                        <h2>3 Easy Steps to <span className="gradient-text">Success</span></h2>

                        <div className="steps-list">
                            {role === 'seeker' ? (
                                <>
                                    <div className="guide-item">
                                        <div className="step-num">1</div>
                                        <div>
                                            <strong>Browse Categories</strong>
                                            <p>Explore tools grouped by use-case for productivity, design, and more.</p>
                                        </div>
                                    </div>
                                    <div className="guide-item">
                                        <div className="step-num">2</div>
                                        <div>
                                            <strong>Compare Specs</strong>
                                            <p>Check pricing, features, and ratings before you commit.</p>
                                        </div>
                                    </div>
                                    <div className="guide-item">
                                        <div className="step-num">3</div>
                                        <div>
                                            <strong>Join the Club</strong>
                                            <p>Save tools to your profile and get notified of new updates.</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="guide-item">
                                        <div className="step-num">1</div>
                                        <div>
                                            <strong>Submit Your Tool</strong>
                                            <p>Fill out our simple form to list your SaaS in front of thousands.</p>
                                        </div>
                                    </div>
                                    <div className="guide-item">
                                        <div className="step-num">2</div>
                                        <div>
                                            <strong>Go Featured</strong>
                                            <p>Activate a promotion plan to appear on our homepage banner.</p>
                                        </div>
                                    </div>
                                    <div className="guide-item">
                                        <div className="step-num">3</div>
                                        <div>
                                            <strong>Analyze Traffic</strong>
                                            <p>Use our dashboard to see how many founders are clicking your tool.</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
                            <button className="btn-secondary" onClick={() => setStep(1)} style={{ width: '120px' }}>Back</button>
                            <button className="btn-primary" onClick={handleComplete} style={{ flex: 1 }}>Get Started <ArrowRight size={20} /></button>
                        </div>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .onboarding-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(10px);
                    z-index: 2000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .onboarding-card {
                    max-width: 800px;
                    width: 100%;
                    padding: 4rem !important;
                    position: relative;
                }
                .close-btn {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                }
                .onboarding-badge {
                    display: inline-block;
                    background: rgba(0, 136, 204, 0.1);
                    color: var(--primary);
                    padding: 5px 15px;
                    border-radius: 100px;
                    font-size: 0.7rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                    letter-spacing: 1px;
                }
                .step-content h2 {
                    font-size: 2.5rem;
                    font-weight: 900;
                    margin-bottom: 1rem;
                    color: white;
                }
                .step-content p {
                    color: var(--text-muted);
                    font-size: 1.1rem;
                    margin-bottom: 3rem;
                }
                .role-selection {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }
                .role-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border);
                    padding: 2.5rem;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: 0.3s;
                    text-align: left;
                }
                .role-card:hover {
                    border-color: var(--primary);
                    background: rgba(0, 136, 204, 0.05);
                    transform: translateY(-5px);
                }
                .role-icon-bg {
                    background: var(--gradient);
                    width: 60px;
                    height: 60px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    margin-bottom: 1.5rem;
                }
                .role-card h3 {
                    font-size: 1.3rem;
                    font-weight: 800;
                    margin-bottom: 0.5rem;
                    color: white;
                }
                .role-card p {
                    margin-bottom: 0;
                    font-size: 0.95rem;
                }
                .steps-list {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    text-align: left;
                }
                .guide-item {
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                }
                .step-num {
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 215, 0, 0.1);
                    border: 1px solid #FFD700;
                    color: #FFD700;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    flex-shrink: 0;
                }
                .guide-item strong {
                    display: block;
                    color: white;
                    font-size: 1.1rem;
                    margin-bottom: 4px;
                }
                .guide-item p {
                    margin-bottom: 0;
                    font-size: 0.9rem;
                }
                @media (max-width: 768px) {
                    .role-selection { grid-template-columns: 1fr; }
                    .onboarding-card { padding: 2rem !important; }
                    .step-content h2 { font-size: 1.8rem; }
                }
            ` }} />
        </div>
    );
};

export default OnboardingModal;


