'use client';
import React, { useState } from 'react';
import { Github, Twitter, Linkedin, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '../context/ToastContext';
import { emailTriggers } from '../utils/emailService';

// Import UI Atoms
import Button from './ui/Button';
import Input from './ui/Input';

// Import Modular Styles
import Image from 'next/image';
import styles from './Footer.module.css';
import { FOOTER_GROUPS } from '../constants/navbarConstants';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { showToast } = useToast();
    const pathname = usePathname();

    if (pathname && pathname.startsWith('/ai-engine')) return null;

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

                    {/* Dynamic Links Sections from Constants */}
                    {FOOTER_GROUPS.map((group, idx) => (
                        <div key={idx} className={styles.footerColumn}>
                            <h3>{group.title}</h3>
                            <ul className={styles.footerLinks}>
                                {group.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <Link href={link.path} onClick={() => window.scrollTo(0, 0)}>
                                            {link.label}
                                            {link.isPremium && (
                                                <Sparkles size={12} style={{ display: 'inline', marginLeft: '4px', color: 'var(--accent)' }} />
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div className={styles.footerColumn}>
                        <h3>Never miss an update</h3>
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
                </div>
            </div>
        </footer>
    );
};

export default Footer;


