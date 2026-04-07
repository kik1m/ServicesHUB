import React from 'react';
import { Send, Loader2 } from 'lucide-react';

const SubmitFooter = ({ loading, uploading }) => {
    return (
        <div className="submit-footer-actions fade-in">
            <button
                type="submit"
                disabled={loading || uploading}
                className="btn-primary btn-submit-main"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                {loading ? 'Submitting...' : 'Submit for Review'}
            </button>
        </div>
    );
};

export default SubmitFooter;
