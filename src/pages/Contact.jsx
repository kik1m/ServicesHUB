import React, { useState, useEffect } from 'react';
import SkeletonLoader from '../components/SkeletonLoader';
import { useToast } from '../context/ToastContext';

// Import Modular Components
import ContactHero from '../components/Contact/ContactHero';
import ContactInfoSidebar from '../components/Contact/ContactInfoSidebar';
import ContactForm from '../components/Contact/ContactForm';

// Import Modular CSS
import '../styles/Pages/Contact.css';

const Contact = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [subject, setSubject] = useState('General Inquiry');
    const { showToast } = useToast();

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            showToast('Message sent! We will get back to you soon.', 'success');
            setSubmitting(false);
            e.target.reset();
        }, 1500);
    };

    if (loading) {
        return (
            <div className="page-wrapper contact-page">
                <header className="page-header hero-section-compact">
                    <div className="hero-content">
                        <SkeletonLoader type="text" width="100px" style={{ margin: '0 auto 1rem' }} />
                        <SkeletonLoader type="title" width="50%" style={{ margin: '0 auto' }} />
                    </div>
                </header>
                <section className="main-section" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="contact-grid">
                        <SkeletonLoader height="400px" borderRadius="24px" />
                        <SkeletonLoader height="600px" borderRadius="24px" />
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="page-wrapper contact-page">
            
            <ContactHero />

            <section className="main-section" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="contact-grid">
                    <ContactInfoSidebar />
                    <ContactForm 
                        handleSubmit={handleSubmit}
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
