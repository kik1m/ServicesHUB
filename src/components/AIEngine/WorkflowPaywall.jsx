'use client';
import React from 'react';
import { Sparkles, Terminal, Activity, CheckSquare, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import styles from './WorkflowPaywall.module.css';

export default function WorkflowPaywall() {
    return (
        <div className={styles.container}>
            {/* Paywall Container */}
            <div className={styles.paywallCard}>
                {/* Glowing backgrounds */}
                <div className={styles.radialGlow} />

                {/* Lock Icon Header */}
                <div className={styles.iconWrapper}>
                    <Lock size={28} className={styles.lockIcon} />
                </div>

                <h2 className={styles.title}>
                    Unlock Premium Workflow Mode
                </h2>

                <p className={styles.description}>
                    Transform your static AI conversations into fully interactive developer roadmaps, live server simulators, and dynamic analytics dashboards built in real-time.
                </p>

                {/* Features Grid */}
                <div className={styles.featuresGrid}>
                    {/* Feature 1 */}
                    <div className={styles.featureCard}>
                        <CheckSquare size={18} className={styles.featureIcon} />
                        <div>
                            <h4 className={styles.featureTitle}>Interactive Roadmap</h4>
                            <p className={styles.featureDesc}>Complete steps, check off tasks, and visually track project progress inline.</p>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className={styles.featureCard}>
                        <Terminal size={18} className={styles.featureIcon} />
                        <div>
                            <h4 className={styles.featureTitle}>Live Simulators</h4>
                            <p className={styles.featureDesc}>Simulate code commands, database schema migrations, and server outputs.</p>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className={styles.featureCard}>
                        <Activity size={18} className={styles.featureIcon} />
                        <div>
                            <h4 className={styles.featureTitle}>Dynamic Dashboards</h4>
                            <p className={styles.featureDesc}>Query mock charts, filter traffic analytics, and adjust budgets instantly.</p>
                        </div>
                    </div>

                    {/* Feature 4 */}
                    <div className={styles.featureCard}>
                        <Sparkles size={18} className={styles.featureIcon} />
                        <div>
                            <h4 className={styles.featureTitle}>AI Bidirectional Sync</h4>
                            <p className={styles.featureDesc}>The AI dynamically responds to and tracks step completions automatically.</p>
                        </div>
                    </div>
                </div>

                {/* Call To Action Buttons */}
                <div className={styles.actionsContainer}>
                    <Button
                        variant="primary"
                        as="a"
                        href="/premium"
                        className={styles.upgradeBtn}
                    >
                        Upgrade to Premium Now <ArrowRight size={16} />
                    </Button>
                    
                    <a href="/ai-engine" className={styles.backLink}>
                        Go Back to Regular Chat
                    </a>
                </div>
            </div>

            {/* Shield Indicator */}
            <div className={styles.secureFooter}>
                <ShieldCheck size={14} /> Secure Payment Powered by Lemon Squeezy
            </div>
        </div>
    );
}

