import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCircle2, Zap, HelpCircle } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import Safeguard from '../ui/Safeguard';
import { HOW_IT_WORKS_STEPS } from '../../constants/homeConstants';
import styles from './HomeHowItWorks.module.css';

const iconMap = {
    '01': Search,
    '02': CheckCircle2,
    '03': Zap
};

const HomeHowItWorks = ({ content, error }) => {
    // Rule #35: Derived Data Stability + Rule #32: Defensive Rendering
    const steps = useMemo(() => HOW_IT_WORKS_STEPS?.filter(Boolean) ?? [], []);

    return (
        <Safeguard error={error}>
            <section className={styles.howItWorks}>
                <SectionHeader 
                    title={content.header.title} 
                    subtitle={content.header.subtitle} 
                    description={content.header.description}
                    align="center"
                />
                
                <div className={styles.stepsGrid}>
                    {steps.map((step) => {
                        // Rule #37: Icon Safety Rule
                        const Icon = iconMap[step.num] || HelpCircle;
                        return (
                            <Link 
                                to={step.path} 
                                key={step.id || step.num} 
                                className={styles.stepCard}
                            >
                                <div className={styles.stepNum}>{step.num}</div>
                                <div className={styles.stepIcon}><Icon size={32} /></div>
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </Safeguard>
    );
};


export default HomeHowItWorks;





