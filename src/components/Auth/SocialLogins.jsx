import React from 'react';
import { Chrome, Github } from 'lucide-react';

const SocialLogins = ({ handleSocialLogin }) => {
    return (
        <div className="social-grid">
            <button onClick={() => handleSocialLogin('google')} className="social-btn-slim">
                <Chrome size={18} /> Google
            </button>
            <button onClick={() => handleSocialLogin('github')} className="social-btn-slim">
                <Github size={18} /> Github
            </button>
        </div>
    );
};

export default SocialLogins;
