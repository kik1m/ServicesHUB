import React from 'react';
import { Mail, MessageCircle, MapPin, Twitter, Github, Linkedin } from 'lucide-react';

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
        <div className="contact-info-sidebar">
            <div className="glass-card" style={{ padding: '3rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', fontWeight: '800', margin: 0 }}>
                    Contact Information
                </h3>

                {infoItems.map((item, i) => (
                    <div key={i} className="info-item">
                        <div 
                            className="cat-icon-wrapper" 
                            style={{ 
                                minWidth: '48px', height: '48px', 
                                background: item.color, 
                                borderRadius: '12px', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                color: 'var(--primary)' 
                            }}
                        >
                            {item.icon}
                        </div>
                        <div className="info-item-content">
                            <h4 style={{ margin: 0 }}>{item.title}</h4>
                            <p style={{ margin: 0 }}>{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem', margin: 0 }}>Follow our journey</h4>
                <div className="social-links" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <button className="icon-btn"><Twitter size={18} /></button>
                    <button className="icon-btn"><Github size={18} /></button>
                    <button className="icon-btn"><Linkedin size={18} /></button>
                </div>
            </div>
        </div>
    );
};

export default ContactInfoSidebar;
