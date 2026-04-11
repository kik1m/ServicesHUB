import React from 'react';
import { Send, Loader2 } from 'lucide-react';
import CustomSelect from '../CustomSelect';
import styles from './ContactForm.module.css';

const ContactForm = ({ handleSubmit, submitting, subject, setSubject }) => {
    return (
        <div className={`${styles.formCard} glass-card`}>
            <form onSubmit={handleSubmit}>
                <div className={styles.rowDual}>
                    <div className={styles.formGroup}>
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            name="fullName"
                            placeholder="John Doe" 
                            className={styles.input}
                            required 
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            name="email"
                            placeholder="john@example.com" 
                            className={styles.input}
                            required 
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Subject</label>
                    <CustomSelect
                        options={[
                            { value: 'General Inquiry', label: 'General Inquiry' },
                            { value: 'Tool Submission Question', label: 'Tool Submission Question' },
                            { value: 'Partnership/Advertising', label: 'Partnership/Advertising' },
                            { value: 'Technical Bug Report', label: 'Technical Bug Report' }
                        ]}
                        value={subject}
                        onChange={(val) => setSubject(val)}
                        placeholder="Select subject"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Message</label>
                    <textarea 
                        name="message"
                        rows="6" 
                        placeholder="How can we help you today?" 
                        className={styles.textarea}
                        required 
                    ></textarea>
                </div>

                <button 
                    type="submit"
                    className={`${styles.submitBtn} btn-primary`} 
                    disabled={submitting}
                >
                    {submitting ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <div className={styles.submitBtnContent}>
                            Send Message <Send size={20} />
                        </div>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
