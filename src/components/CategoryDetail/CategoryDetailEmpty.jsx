import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import EmptyState from '../ui/EmptyState';
import Safeguard from '../ui/Safeguard';
import { CATEGORY_STRINGS } from '../../constants/categoryConstants';
import styles from './CategoryDetailEmpty.module.css';

/**
 * CategoryDetailEmpty Component
 * Rule #31: Explicit Empty State Handling
 * Rule #4: Using Unified UI Atoms
 * Rule #30: Constants Enforcement
 */
const CategoryDetailEmpty = (props) => {
    const { categoryName = 'Category', error, onRetry } = props;
    const navigate = useNavigate();

    // Rule #15: Named Handlers
    const handleAction = () => navigate('/submit');

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <section className={styles.emptySection}>
                <EmptyState 
                    title={CATEGORY_STRINGS?.EMPTY?.TITLE(categoryName)}
                    message={CATEGORY_STRINGS?.EMPTY?.DESCRIPTION}
                    icon={Zap}
                    actionText={CATEGORY_STRINGS?.EMPTY?.ACTION_TEXT}
                    onAction={handleAction}
                    className={styles.submitCtaCard}
                />
            </section>
        </Safeguard>
    );
};

export default CategoryDetailEmpty;
