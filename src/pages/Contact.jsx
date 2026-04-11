import React from 'react';
import SkeletonLoader from '../components/SkeletonLoader';
import useSEO from '../hooks/useSEO';
import { useContactData } from '../hooks/useContactData';

// Import Modular Components
import ContactHero from '../components/Contact/ContactHero';
import ContactInfoSidebar from '../components/Contact/ContactInfoSidebar';
import ContactForm from '../components/Contact/ContactForm';

// Import Modular CSS
import styles from './Contact.module.css';

const Contact = () => {
    const { 
        loading,
        submitting, 
        subject, 
        setSubject, 
        handleFormSubmit
    } = useContactData();

    useSEO({
        title: "Contact Us | ServicesHUB Support",
        description: "Get in touch with the ServicesHUB team for support, feedback, or partnership inquiries.",
    });

    if (loading) {
        return (
            <div className={`page-wrapper ${styles.contactPage}`}>
                <header className="page-header hero-section-compact">
                    <div className="hero-content">
                        <SkeletonLoader type="text" width="100px" style={{ margin: '0 auto 1rem' }} />
                        <SkeletonLoader type="title" width="50%" style={{ margin: '0 auto' }} />
                    </div>
                </header>
                <section className={styles.mainSection}>
                    <div className={styles.contactGrid}>
                        <SkeletonLoader height="400px" borderRadius="24px" />
                        <SkeletonLoader height="600px" borderRadius="24px" />
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            
            <ContactHero />

            <section className={styles.mainSection}>
                <div className={styles.contactGrid}>
                    <ContactInfoSidebar />
                    <ContactForm 
                        handleSubmit={handleFormSubmit}
                        submitting={submitting}
                        subject={subject}
                        setSubject={setSubject}
                    />
                </div>
            </section>

        </div>
    );
};

export default Contact;
