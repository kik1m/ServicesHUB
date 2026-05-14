import React, { memo } from 'react';
import { Send, User, Mail, MessageSquare, FileText } from 'lucide-react';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ContactForm.module.css';
import { CONTACT_UI_CONSTANTS } from '../../constants/contactConstants';

/**
 * ContactForm - Elite Component
 * Rule #14: Data-Driven UI via centralized constants
 * Rule #112: Zero inline styles
 */
const ContactForm = ({ handleSubmit, submitting, subject, setSubject, isLoading, error }) => {
    const { form } = CONTACT_UI_CONSTANTS;

    if (isLoading) {
        return (
            <div className={`${styles.formCard} glass-card`}>
                <div className={styles.rowDual}>
                    <Skeleton height="82px" borderRadius="14px" />
                    <Skeleton height="82px" borderRadius="14px" />
                </div>
                <div className={styles.skeletonField}>
                    <Skeleton height="82px" borderRadius="14px" />
                </div>
                <div className={styles.skeletonField}>
                    <Skeleton height="180px" borderRadius="14px" />
                </div>
                <div className={styles.skeletonAction}>
                    <Skeleton width="180px" height="52px" borderRadius="14px" />
                </div>
            </div>
        );
    }

    return (
        <Safeguard error={error}>
            <div className={`${styles.formCard} glass-card`}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.rowDual}>
                        <Input 
                            label={<><User size={14} /> {form?.fields?.name?.label}</>}
                            name="fullName"
                            placeholder={form?.fields?.name?.placeholder} 
                            required 
                            className={styles.inputGroup}
                        />
                        <Input 
                            label={<><Mail size={14} /> {form?.fields?.email?.label}</>}
                            type="email" 
                            name="email"
                            placeholder={form?.fields?.email?.placeholder} 
                            required 
                            className={styles.inputGroup}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            <FileText size={14} /> {form?.fields?.subject?.label}
                        </label>
                        <Select
                            options={form?.fields?.subject?.options}
                            value={subject}
                            onChange={(val) => setSubject(val)}
                            placeholder={form?.fields?.subject?.placeholder}
                        />
                    </div>

                    <Input 
                        label={<><MessageSquare size={14} /> {form?.fields?.message?.label}</>}
                        name="message"
                        multiline={true}
                        rows="6" 
                        placeholder={form?.fields?.message?.placeholder} 
                        required 
                        className={styles.inputGroup}
                    />

                    <Button 
                        type="submit"
                        className={styles.submitBtn} 
                        isLoading={submitting}
                        icon={Send}
                        iconPosition="right"
                    >
                        {form?.submit}
                    </Button>
                </form>
            </div>
        </Safeguard>
    );
};

export default memo(ContactForm);
