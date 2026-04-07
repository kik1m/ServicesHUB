import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQList = ({ faqs, searchQuery, selectedCategory, activeIndex, toggleAccordion }) => {
    return (
        <>
            {faqs.filter(f => selectedCategory === 'All' || f.category === selectedCategory).map((group, groupIdx) => (
                <div key={groupIdx} className="faq-group">
                    <div className="group-header">
                        {group.icon}
                        <h3>{group.category}</h3>
                    </div>

                    <div className="faq-list">
                        {group.questions.map((item, qIdx) => {
                            const globalIdx = `${groupIdx}-${qIdx}`;
                            const isOpen = activeIndex === globalIdx;

                            if (searchQuery && !item.q.toLowerCase().includes(searchQuery.toLowerCase()) && !item.a.toLowerCase().includes(searchQuery.toLowerCase())) {
                                return null;
                            }

                            return (
                                <div key={qIdx} className={`faq-item glass-card ${isOpen ? 'open' : ''}`}>
                                    <div
                                        className="faq-question"
                                        onClick={() => toggleAccordion(globalIdx)}
                                    >
                                        <span>{item.q}</span>
                                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>

                                    {isOpen && (
                                        <div className="faq-answer">
                                            {item.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </>
    );
};

export default FAQList;
