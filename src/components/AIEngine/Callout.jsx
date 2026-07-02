import React from 'react';
import { AlertTriangle, Info, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import styles from './Callout.module.css';

export default function Callout({ type = 'NOTE', isArabic = false, children }) {
    const t = type.toUpperCase();
    
    let Icon = Info;
    let className = styles.note;
    let title = isArabic ? 'ملاحظة' : 'Note';

    if (t === 'WARNING') {
        Icon = AlertTriangle;
        className = styles.warning;
        title = isArabic ? 'تحذير' : 'Warning';
    } else if (t === 'IMPORTANT') {
        Icon = AlertCircle;
        className = styles.important;
        title = isArabic ? 'هام' : 'Important';
    } else if (t === 'TIP') {
        Icon = Lightbulb;
        className = styles.tip;
        title = isArabic ? 'نصيحة' : 'Tip';
    } else if (t === 'CAUTION') {
        Icon = AlertTriangle; // or another specific icon
        className = styles.caution;
        title = isArabic ? 'انتبه' : 'Caution';
    } else if (t === 'SUCCESS') {
        Icon = CheckCircle;
        className = styles.success;
        title = isArabic ? 'نجاح' : 'Success';
    }

    return (
        <div className={`${styles.calloutWrapper} ${className}`}>
            <div className={styles.calloutHeader}>
                <Icon size={16} className={styles.icon} />
                <span className={styles.title}>{title}</span>
            </div>
            <div className={styles.calloutContent}>
                {children}
            </div>
        </div>
    );
}
