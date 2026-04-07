import React from 'react';
import { Ghost } from 'lucide-react';

const NotFoundHero = () => {
    return (
        <div className="not-found-hero-group">
            <div className="not-found-icon-box">
                <Ghost size={40} color="white" />
            </div>
            
            <h1 className="not-found-404-text">404</h1>
            <h2 className="not-found-title">Lost in Space?</h2>
            <p className="not-found-subtitle">
                The page you are looking for has drifted into another galaxy. Let&apos;s get you back to the tools that matter.
            </p>
        </div>
    );
};

export default NotFoundHero;
