import React from 'react';
import { Gem } from 'lucide-react';

const PremiumHero = () => {
    return (
        <header className="premium-custom-header">
            <div className="premium-diamond-badge">
                <Gem size={12} style={{ marginRight: '6px' }} />
                DIAMOND ACCESS
            </div>
            <h1>
                Unlock the <span className="gold-gradient-text">Full Potential</span>
            </h1>
            <p>
                Join the most exclusive tier of HUBly. One-time investment for a lifetime of growth.
            </p>
        </header>
    );
};

export default PremiumHero;
