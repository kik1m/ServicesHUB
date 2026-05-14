'use client';
import React, { useState } from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '../context/ToastContext';
import { emailTriggers } from '../utils/emailService';

// Import UI Atoms
import Button from './ui/Button';
import Input from './ui/Input';

// Import Modular Styles
import Image from 'next/image';
import styles from './Footer.module.css';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { showToast } = useToast();

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setSubmitting(true);
        try {
            // 1. Database Insertion (Persistence)
            const { error: dbError } = await supabase
                .from('newsletter_subscribers')
                .insert([{ email }]);

            if (dbError) {
                // Rule #42.3: Detailed RLS Debugging for the User
                if (dbError.code === '42501' || dbError.status === 403) {
                    throw new Error('Permission Denied (403): Please ensure Public Insert is enabled for "newsletter_subscribers" in Supabase RLS.');
                }
                if (dbError.code === '23505') {
                    throw new Error('You are already part of our elite circle!');
                }
                throw dbError;
            }

            showToast('Welcome to the elite circle!', 'success');
            setEmail('');

            // 2. Email Delivery (Non-blocking elite trigger)
            emailTriggers.sendWelcome(email, email.split('@')[0])
                .catch(err => console.warn('Welcome Email failed:', err));

        } catch (err) {
            console.error('[Newsletter Error]:', err);
            showToast(err.message || 'Subscription failed. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <div className={styles.footerGrid}>
                    {/* Brand Section */}
                    <div className={styles.footerBrand}>
                        <div className={styles.brandLogo}>
                            <Image 
                                src="/logo.png" 
                                alt="HUBly" 
                                width={32} 
                                height={32} 
                                className={styles.logoImg} 
                            />
                            <div className={styles.logoText}>
                                <span className={styles.logoWhite}>HUB</span>
                                <span className={styles.logoGradient}>ly</span>
                            </div>
                        </div>
                        <p>
                            The most trusted directory for finding and submitting the world&apos;s most innovative AI and SaaS tools. Join thousands of creators today.
                        </p>
                        <div className={styles.footerSocials}>
                            <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
                            <a href="#" aria-label="GitHub"><Github size={18} /></a>
                            <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className={styles.footerColumn}>
                        <h4>Explore</h4>
                        <ul className={styles.footerLinks}>
                            <li><Link href="/tools" onClick={() => window.scrollTo(0, 0)}>All Tools</Link></li>
                            <li><Link href="/blog" onClick={() => window.scrollTo(0, 0)}>Articles</Link></li>
                            <li><Link href="/categories" onClick={() => window.scrollTo(0, 0)}>Categories</Link></li>
                            <li><Link href="/promote" onClick={() => window.scrollTo(0, 0)}>Sponsorships</Link></li>
                        </ul>
                    </div>

                    <div className={styles.footerColumn}>
                        <h4>Platform</h4>
                        <ul className={styles.footerLinks}>
                            <li><Link href="/submit">Submit Tool</Link></li>
                            <li><Link href="/about">About Us & FAQ</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                            <li><Link href="/privacy">Privacy Policy</Link></li>
                            <li><Link href="/terms">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div className={styles.footerColumn}>
                        <h4>Never miss an update</h4>
                        <p className={styles.newsletterDesc}>
                            Join 10,000+ creators. Get the latest AI tools and exclusive deals to your inbox.
                        </p>
                        <form onSubmit={handleSubscribe} className={styles.subscribeForm}>
                            <div className={styles.inputWrapper}>
                                <Input 
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={styles.inputNoMargin}
                                />
                            </div>
                            <Button 
                                type="submit" 
                                isLoading={submitting}
                                variant="primary"
                                className={styles.subscribeBtn}
                            >
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={styles.footerBottom}>
                    <p>© 2026 HUBly. Built with excellence for the AI community.</p>
                    <div className={styles.statusGroup}>
                        <span>Service Status: <span className={styles.statusOnline}>Online</span></span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;


