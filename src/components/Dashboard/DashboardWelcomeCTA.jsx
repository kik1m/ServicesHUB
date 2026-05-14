'use client';
import React from 'react';
import { Rocket, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import Button from '../ui/Button';
import styles from './DashboardWelcomeCTA.module.css';

/**
 * DashboardWelcomeCTA - Elite Onboarding Card
 */
const DashboardWelcomeCTA = ({ content }) => {
    return (
        <div className={`${styles.welcomeCard} fade-in`}>
            <div className={styles.iconWrapper}>
                <Rocket size={36} />
            </div>
            <h2 className={styles.title}>
                <span className={styles.titleMain}>{content?.title}</span>
                <span className={styles.gradientText}>{content?.highlight}</span>
                <span className={styles.titleQuestion}>{content?.question}</span>
            </h2>
            <p className={styles.description}>
                {content?.desc}
            </p>
            <Button 
                as={Link} 
                href="/submit" 
                icon={PlusCircle} 
                iconSize={20}
                className={styles.btnSubmit}
                variant="primary"
            >
                {content?.action}
            </Button>
        </div>
    );
};

export default DashboardWelcomeCTA;
