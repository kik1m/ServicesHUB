import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import styles from './ToolsSubmitCTA.module.css';

const ToolsSubmitCTA = () => {
    return (
        <div className={`glass-card ${styles.submitCtaCard}`}>
            <Zap size={32} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
            <h3>Missing a great tool?</h3>
            <p className={styles.ctaDescription}>
                Help the community discover the best AI solutions. If you know a tool that should be here, let us know!
            </p>
            <Link to="/submit" className="btn-outline">Submit Your Tool Now</Link>
        </div>
    );
};

export default ToolsSubmitCTA;
