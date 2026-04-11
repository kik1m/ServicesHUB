import React from 'react';
import { Save, Loader2 } from 'lucide-react';
import styles from './ToolFormActions.module.css';

const ToolFormActions = ({ saving, uploading, onCancel, submitText = "Save & Submit for Review" }) => {
    return (
        <div className={styles.formActionBar}>
            <button 
                type="submit" 
                disabled={saving || uploading} 
                className={styles.premiumSubmitBtn}
            >
                {saving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                {saving ? 'Processing...' : submitText}
            </button>
            <button 
                type="button" 
                onClick={onCancel} 
                className={styles.premiumCancelBtn}
            >
                Cancel
            </button>
        </div>
    );
};

export default ToolFormActions;
