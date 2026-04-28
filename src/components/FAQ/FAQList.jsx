import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import { FAQ_UI_CONSTANTS } from '../../constants/faqConstants';
import styles from './FAQList.module.css';

const FAQList = ({ faqs = [], activeIndex, toggleAccordion, isLoading, error, onRetry }) => {
    return (
        <Safeguard error={error} onRetry={onRetry}>
            {isLoading ? (
                <div className="faq-list">
                    {FAQ_UI_CONSTANTS.SKELETON_COUNTS.groups.map(groupIdx => (
                        <div key={groupIdx} className={styles.faqGroup}>
                            <div className={styles.groupHeader}>
                                <Skeleton className={styles.skeletonGroupHeader} />
                            </div>
                            {FAQ_UI_CONSTANTS.SKELETON_COUNTS.questions.map(i => (
                                <div key={i} className={`${styles.faqItem} glass-card`}>
                                    <div className={styles.faqQuestion}>
                                        <Skeleton className={styles.skeletonQuestion} />
                                        <Skeleton className={styles.skeletonIconCircle} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="faq-list">
                    {faqs?.map((group, groupIdx) => (
                        <div
                            key={groupIdx}
                            id={group?.category?.replace(/\s+/g, '-')}
                            className={styles.faqGroup}
                        >
                            <div className={styles.groupHeader}>
                                {group?.icon && <group.icon size={20} />}
                                <h3>{group?.category}</h3>
                            </div>

                            {group?.questions?.map((faq, i) => {
                                const globalIndex = `${groupIdx}-${i}`;
                                const isOpen = activeIndex === globalIndex;

                                return (
                                    <div
                                        key={i}
                                        className={`${styles.faqItem} glass-card ${isOpen ? styles.open : ''}`}
                                    >
                                        <div
                                            className={styles.faqQuestion}
                                            onClick={() => toggleAccordion(globalIndex)}
                                        >
                                            <span>{faq?.q}</span>
                                            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                        {isOpen && (
                                            <div className={styles.faqAnswer}>
                                                {faq?.a}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}
        </Safeguard>
    );
};


export default FAQList;




