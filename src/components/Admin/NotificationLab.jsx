import React, { useState } from 'react';
import { Beaker, CheckCircle, XCircle, Users, Bell, Play } from 'lucide-react';
import Button from '../ui/Button';
import { sendNotification } from '../../utils/notifications';
import { useAuth } from '../../context/AuthContext';
import styles from './NotificationLab.module.css';

/**
 * NotificationLab - Secret Development Tool
 * Use this to verify Elite Notification Design & Logic
 */
const NotificationLab = () => {
    const { user } = useAuth();
    const [sending, setSending] = useState(false);

    const triggerTest = async (type) => {
        if (!user) return;
        setSending(true);

        const configs = {
            approval: {
                title: 'Success: Your Tool is Now Live!',
                msg: 'Congratulations! Your AI tool "Elite Scout" has passed review and is now active.',
                type: 'approval'
            },
            rejection: {
                title: 'Critical Update: Submission Review',
                msg: 'We regret to inform you that "Elite Scout" has been declined following our review.',
                type: 'rejection'
            },
            social: {
                title: 'New Community Connection!',
                msg: 'Elon Musk is now following you. Explore their profile and connect!',
                type: 'social'
            },
            review: {
                title: 'New Tool Review Received!',
                msg: 'Alex J. rated your tool "Elite Scout" with 5 stars. "Amazing performance!"',
                type: 'social'
            },
            reply: {
                title: 'Official Reply Received!',
                msg: 'The creator of "ChatGPT Plus" has replied to your feedback. Check it out!',
                type: 'social'
            },
            security: {
                title: 'Security Alert: Password Updated',
                msg: 'Your account password was recently changed. If you did not perform this, contact support.',
                type: 'warning'
            },
            submission: {
                title: 'Submission Successfully Logged!',
                msg: 'We\'ve received your request for "Elite Scout". Curators will review it within 24-48 hours.',
                type: 'info'
            }
        };

        const config = configs[type];
        
        try {
            await sendNotification(user.id, config.title, config.msg, config.type, { isTest: true });
        } catch (err) {
            console.error('Lab Error:', err);
        } finally {
            setTimeout(() => setSending(false), 500);
        }
    };

    return (
        <div className={styles.labContainer}>
            <div className={styles.labHeader}>
                <Beaker className={styles.labIcon} size={24} />
                <div className={styles.headerText}>
                    <h3>Elite Notification Lab</h3>
                    <p>Internal testing environment for high-fidelity alerts.</p>
                </div>
            </div>

            <div className={styles.labGrid}>
                <button onClick={() => triggerTest('approval')} className={styles.testBtn} disabled={sending}>
                    <CheckCircle className={styles.iconSuccess} />
                    <span>Test Approval</span>
                </button>

                <button onClick={() => triggerTest('rejection')} className={styles.testBtn} disabled={sending}>
                    <XCircle className={styles.iconError} />
                    <span>Test Rejection</span>
                </button>

                <button onClick={() => triggerTest('social')} className={styles.testBtn} disabled={sending}>
                    <Users className={styles.iconSocial} />
                    <span>Test Follow</span>
                </button>

                <button onClick={() => triggerTest('review')} className={styles.testBtn} disabled={sending}>
                    <Bell className={styles.iconSocial} />
                    <span>Test Review</span>
                </button>

                <button onClick={() => triggerTest('reply')} className={styles.testBtn} disabled={sending}>
                    <Bell className={styles.iconSocial} />
                    <span>Test Reply</span>
                </button>

                <button onClick={() => triggerTest('security')} className={styles.testBtn} disabled={sending}>
                    <Bell className={styles.iconInfo} />
                    <span>Test Security</span>
                </button>

                <button onClick={() => triggerTest('submission')} className={styles.testBtn} disabled={sending}>
                    <Bell className={styles.iconInfo} />
                    <span>Test Submit</span>
                </button>
            </div>
            
            <p className={styles.footerHint}>Notifications will appear in your panel & page in real-time.</p>
        </div>
    );
};

export default NotificationLab;
