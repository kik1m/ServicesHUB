import React from 'react';
import { Save, Loader2 } from 'lucide-react';

const ToolFormActions = ({ saving, uploading, onCancel, submitText = "Save & Submit for Review" }) => {
    return (
        <div className="form-action-bar">
            <button 
                type="submit" 
                disabled={saving || uploading} 
                className="premium-submit-btn"
            >
                {saving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                {saving ? 'Processing...' : submitText}
            </button>
            <button 
                type="button" 
                onClick={onCancel} 
                className="premium-cancel-btn"
            >
                Cancel
            </button>
        </div>
    );
};

export default ToolFormActions;
