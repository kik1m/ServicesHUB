import React from 'react';
import { Mail } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import { useContactData } from '../hooks/useContactData';

// Import Global UI Components
import PageHero from '../components/ui/PageHero';
import Safeguard from '../components/ui/Safeguard';

// Import Modular Components
import ContactInfoSidebar from '../components/Contact/ContactInfoSidebar';
import ContactForm from '../components/Contact/ContactForm';

// Import Constants & Styles
import { CONTACT_UI_CONSTANTS } from '../constants/contactConstants';
import styles from './Contact.module.css';

/**
 * Contact Page - Elite 10/10 Standard
 * Rule #16: Pure Orchestration Pattern
 * Rule #31: Component Resilience via Safeguard
 */
const Contact = () => {
    const { 
        loading,
        submitting, 
        subject, 
        setSubject, 
        handleFormSubmit,
        error
    } = useContactData();

    // 1. SEO Hardening (v2.0)
    useSEO({ pageKey: 'contact', entityId: 'contact', entityType: 'page' });

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
};

export default Contact;
