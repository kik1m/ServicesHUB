'use client';
import React from 'react';
import { Plus, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import PageHero from '../ui/PageHero';
import Safeguard from '../ui/Safeguard';
import styles from './DashboardHeader.module.css';

/**
 * DashboardHeader - Elite Next.js Port
 * Updated share URL to use /u/[id]
 */
const DashboardHeader = ({ isCreator, user, isLoading, error, content }) => {
    const { showToast } = useToast();

    const handleShare = () => {
        if (!user?.id) return;
        // Elite Note: Public Profile in Next.js is at /u/[id]
        const url = `${window.location.origin}/u/${user.id}`;
        navigator.clipboard.writeText(url);
        showToast(content?.actions?.copied || "Profile link copied!", 'success');
    };

    const breadcrumbs = [
        { label: 'Home', path: '/' },
        { label: 'Dashboard' }
    ];

    return (
        <Safeguard error={error}>
            <PageHero
                title={isCreator ? content?.creatorTitle : content?.userTitle}
                highlight={content?.mainTitle}
                subtitle={isCreator ? content?.creatorSubtitle : content?.userSubtitle}
                breadcrumbs={breadcrumbs}
                isLoading={isLoading}
                className={styles.dashboardHero}
            >
                <div className={styles.headerActions}>
                    <Button 
                        variant="secondary"
                        onClick={handleShare} 
                        icon={Share2}
                        className={styles.btnAction}
                    >
                        {content?.actions?.share}
                    </Button>
                    <Button 
                        as={Link}
                        href="/submit" 
                        icon={Plus}
                        className={styles.btnAction}
                    >
                        {content?.actions?.submit}
                    </Button>
                </div>
            </PageHero>
        </Safeguard>
    );
};

export default DashboardHeader;
