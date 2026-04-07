import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs';

const ToolFormHeader = ({ title, subtitle, onBack, breadcrumbs }) => {
    return (
        <div className="submit-wrapper">
            <div className="submit-breadcrumbs-wrapper">
                <Breadcrumbs items={breadcrumbs} />
            </div>

            <header className="submit-header">
                <div className="submit-header-title-row">
                    <button onClick={onBack} className="icon-btn-slim">
                        <ArrowLeft size={22} color="white" />
                    </button>
                    <h1>
                        {title.split(' ').map((word, i, arr) => (
                            <React.Fragment key={i}>
                                {word.toLowerCase() === 'tool' ? (
                                    <span className="gradient-text">{word}</span>
                                ) : (
                                    word
                                )}
                                {i < arr.length - 1 ? ' ' : ''}
                            </React.Fragment>
                        ))}
                    </h1>
                </div>
                {subtitle && (
                    <p>
                        Modifying <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{subtitle}</span>
                    </p>
                )}
            </header>
        </div>
    );
};

export default ToolFormHeader;
