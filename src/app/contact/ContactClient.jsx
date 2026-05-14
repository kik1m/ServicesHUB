'use client';
import React from 'react';
import { Mail } from 'lucide-react';
import { useContactData } from '@/hooks/useContactData';

// Import Global UI Components
import PageHero from '@/components/ui/PageHero';
import Safeguard from '@/components/ui/Safeguard';

// Import Modular Components
import ContactInfoSidebar from '@/components/Contact/ContactInfoSidebar';
import ContactForm from '@/components/Contact/ContactForm';

// Import Constants & Styles
import { CONTACT_UI_CONSTANTS } from '@/constants/contactConstants';
import styles from './page.module.css';

export default function ContactClient() {
    const { 
        loading,
        submitting, 
        subject, 
        setSubject, 
        handleFormSubmit,
        error
    } = useContactData();

    return (
        <div className={styles.contactView}>
            <PageHero 
                title={CONTACT_UI_CONSTANTS.hero.title}
                highlight={CONTACT_UI_CONSTANTS.hero.highlight}
                subtitle={CONTACT_UI_CONSTANTS.hero.subtitle}
                breadcrumbs={CONTACT_UI_CONSTANTS.hero.breadcrumbs}
                icon={<Mail size={24} />}
                isLoading={loading}
            />

            <section className={styles.mainSection}>
                <div className={styles.contactGrid}>
                    <ContactInfoSidebar 
                        isLoading={loading} 
                        content={CONTACT_UI_CONSTANTS?.info}
                        error={error}
                    />
                    <ContactForm 
                        handleSubmit={handleFormSubmit}
                        submitting={submitting}
                        subject={subject}
                        setSubject={setSubject}
                        isLoading={loading}
                        error={error}
                    />
                </div>
            </section>
        </div>
    );
}
