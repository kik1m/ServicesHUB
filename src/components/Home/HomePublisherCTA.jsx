import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import Safeguard from '../ui/Safeguard';
import styles from './HomePublisherCTA.module.css';

const HomePublisherCTA = ({ content, error }) => {
    return (
        <Safeguard error={error}>
            <section className={styles.publisherCtaSection}>
                <div className={styles.publisherCtaContent}>
                    <img src="/logo.png" alt="HUBly" className={styles.publisherCtaLogo} />
                    
                    <div className={styles.publisherCtaBadge}>FOR TOOL OWNERS</div>
                    
                    <h2 className={styles.title}>
                        {content.title} <span className={styles.gradientText}>{content.highlight}</span>
                    </h2>
                    
                    <p className={styles.publisherCtaDesc}>
                        {content.desc}
                    </p>
                    
                    <div className={styles.ctaActionsRow}>
                        <Button as={Link} to="/auth" variant="primary" icon={Zap}>
                            {content.button}
                        </Button>
                        <Button 
                            as={Link} 
                            to="/promote" 
                            variant="outline" 
                            className={styles.outlineBtnOverride}
                            icon={ArrowRight} 
                            iconPosition="right"
                        >
                            Explore Advertising
                        </Button>
                    </div>
                </div>
            </section>
        </Safeguard>
    );
};

export default HomePublisherCTA;




