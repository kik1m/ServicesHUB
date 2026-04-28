import React, { useMemo } from 'react';
import { Zap, Shield, Sparkles, HelpCircle } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import Safeguard from '../ui/Safeguard';
import { VALUE_PROPS } from '../../constants/homeConstants';
import styles from './HomeValueProp.module.css';

const iconMap = {
    'prop-fast': Zap,
    'prop-quality': Shield,
    'prop-trends': Sparkles
};

const HomeValueProp = ({ content, error }) => {
    // Rule #35: Derived Data Stability + Rule #32: Defensive Rendering
    const props = useMemo(() => VALUE_PROPS?.filter(Boolean) ?? [], []);

    return (
        <Safeguard error={error}>
            <section className={styles.valuePropSection}>
                <SectionHeader 
                    title={content.header.title} 
                    subtitle={content.header.subtitle} 
                    description={content.header.description}
                />

                <div className={styles.propGridNew}>
                    {props.map((prop) => {
                        // Rule #37: Icon Safety Rule
                        const Icon = iconMap[prop.id] || HelpCircle;
                        return (
                            <div key={prop.id} className={styles.propCardPremium}>
                                <div className={styles.propIconBg}><Icon size={28} /></div>
                                <h4>{prop.title}</h4>
                                <p>{prop.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>
        </Safeguard>
    );
};


export default HomeValueProp;





