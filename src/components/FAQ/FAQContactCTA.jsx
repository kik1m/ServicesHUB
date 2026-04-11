import React from 'react';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './FAQContactCTA.module.css';

const FAQContactCTA = () => {
    return (
        <div className={`${styles.helpCTA} glass-card`}>
            <h2 className="section-title">Still have <span className="gradient-text">questions?</span></h2>
            <p className="section-desc" style={{ marginBottom: '2rem' }}>
                If you couldn't find the answer you were looking for, our support team is ready to assist you.
            </p>
            <Link to="/contact" className="btn-primary">
                Contact Support <Mail size={18} />
            </Link>
        </div>
    );
};

export default FAQContactCTA;
