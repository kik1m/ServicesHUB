import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const SuccessHero = ({ type }) => {
    return (
        <div className="success-hero-group">
            <div className="success-pulse-icon">
                <CheckCircle2 size={100} />
            </div>

            <h1 className="success-title">
                {type === 'account_premium' ? 
                    <>Welcome to <span className="gradient-text">Premium!</span></> : 
                    <>Promotion <span className="gradient-text">Activated!</span></>
                }
            </h1>
        </div>
    );
};

export default SuccessHero;
