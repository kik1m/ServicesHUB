import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs';
import styles from './ToolFormHeader.module.css';

const ToolFormHeader = ({ title, subtitle, onBack, breadcrumbs, isEdit = false }) => {
    return (
        <div className={styles.headerWrapper}>
            <div className={styles.breadcrumbsContainer}>
                <Breadcrumbs items={breadcrumbs} />
            </div>

            <header className={styles.header}>
                <div className={styles.titleRow}>
                    <button onClick={onBack} className={styles.backBtn}>
                        <ArrowLeft size={22} color="white" />
                    </button>
                    <h1>
                        {title.split(' ').map((word, i, arr) => (
                            <React.Fragment key={i}>
                                {word.toLowerCase() === 'tool' ? (
                                    <span className="gradient-text">{word}</span>
                                ) : (
                                    word
                                )}{i < arr.length - 1 ? ' ' : ''}
                            </React.Fragment>
                        ))}
                    </h1>
                </div>
                {subtitle && (
                    <p className={styles.subtitle}>
                        {isEdit && "Modifying "}
                        <span className={styles.targetName}>{subtitle}</span>
                    </p>
                )}
            </header>
        </div>
    );
};

export default ToolFormHeader;
