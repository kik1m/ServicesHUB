import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import Button from '../ui/Button';
import { CATEGORY_STRINGS } from '../../constants/categoryConstants';
import styles from './CategoriesSuggestCTA.module.css';

import Safeguard from '../ui/Safeguard';

/**
 * CategoriesSuggestCTA - Elite Standard
 * Premium call-to-action for community feedback
 */
const CategoriesSuggestCTA = () => {
    const strings = CATEGORY_STRINGS?.LIST?.SUGGEST;

    return (
        <Safeguard title={strings?.TITLE}>
            <div className={styles.suggestWrapper}>
            <div className={styles.suggestCard}>
                <div className={styles.glowEffect}></div>
                <div className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <Zap size={28} fill="currentColor" />
                    </div>
                    <div className={styles.textStack}>
                        <h3 className={styles.title}>{strings?.TITLE}</h3>
                        <p className={styles.description}>{strings?.DESCRIPTION}</p>
                    </div>
                    <Button 
                        as={Link} 
                        to="/contact" 
                        variant="secondary"
                        size="lg"
                        className={styles.actionBtn}
                    >
                        {strings?.ACTION_TEXT}
                    </Button>
                </div>
            </div>
        </div>
        </Safeguard>
    );
};

export default CategoriesSuggestCTA;
