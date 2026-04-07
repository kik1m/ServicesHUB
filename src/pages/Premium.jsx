import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Breadcrumbs from '../components/Breadcrumbs';

// Import Modular Components
import PremiumHero from '../components/Premium/PremiumHero';
import PremiumPricingCard from '../components/Premium/PremiumPricingCard';
import PremiumFAQ from '../components/Premium/PremiumFAQ';

// Import Modular CSS
import '../styles/pages/Premium.css';

const Premium = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        if (!user) {
            navigate('/auth');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post('/api/create-checkout-session', {
                userId: user.id,
                itemType: 'account_premium',
                planName: 'Lifetime Premium',
                priceAmount: 120
            });

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error('Upgrade error:', err);
            showToast('Failed to initiate checkout. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="premium-view-wrapper container" style={{ padding: '80px 5% 80px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                
                <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Premium' }]} />

                <PremiumHero />

                <PremiumPricingCard 
                    user={user}
                    loading={loading}
                    onUpgrade={handleUpgrade}
                />

                <PremiumFAQ />

            </div>
        </div>
    );
};

export default Premium;
