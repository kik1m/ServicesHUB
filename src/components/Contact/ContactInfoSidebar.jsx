import React from 'react';
import { Mail, MessageCircle, MapPin, Twitter, Github, Linkedin } from 'lucide-react';
import styles from './ContactInfoSidebar.module.css';

const ContactInfoSidebar = () => {
    const infoItems = [
        { 
            icon: <Mail size={20} />, 
            title: 'Email Us', 
            value: 'support@hubly.com',
            color: 'rgba(0, 136, 204, 0.1)'
        },
        { 
            icon: <MessageCircle size={20} />, 
            title: 'Live Chat', 
            value: 'Available Mon-Fri, 9am-6pm',
            color: 'rgba(0, 136, 204, 0.1)'
        },
        { 
            icon: <MapPin size={20} />, 
            title: 'Location', 
            value: 'Global Remote Team',
            color: 'rgba(0, 136, 204, 0.1)'
        }
    ];

    return (
        <div className={styles.sidebar}>
            <div className={`${styles.infoCard} glass-card`}>
                <h3 className={styles.infoTitle}>
                    Contact Information
                </h3>

                {infoItems.map((item, i) => (
                    <div key={i} className={styles.infoItem}>
                        <div 
                            className={styles.iconWrapper} 
                            style={{ background: item.color }}
                        >
                            {item.icon}
                        </div>
                        <div className={styles.infoContent}>
                            <h4 style={{ margin: 0 }}>{item.title}</h4>
                            <p style={{ margin: 0 }}>{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`${styles.socialBox} glass-card`}>
                <h4 className={styles.socialBoxTitle}>Follow our journey</h4>
                <div className={styles.socialLinks}>
                    <button className={styles.socialIcon}><Twitter size={18} /></button>
                    <button className={styles.socialIcon}><Github size={18} /></button>
                    <button className={styles.socialIcon}><Linkedin size={18} /></button>
                </div>
            </div>
        </div>
    );
};

export default ContactInfoSidebar;
