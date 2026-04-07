import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { sendNotification } from '../utils/notifications';
import { useAuth } from '../context/AuthContext';
import SkeletonLoader from '../components/SkeletonLoader';
import { useSearchParams } from 'react-router-dom';

// Import Modular Components
import SuccessHero from '../components/Success/SuccessHero';
import SuccessMessage from '../components/Success/SuccessMessage';
import SuccessActions from '../components/Success/SuccessActions';

// Import Modular CSS
import '../styles/Pages/Success.css';

const Success = () => {
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const toolName = searchParams.get('toolName');

    useEffect(() => {
        const handleSuccess = async () => {
            if (authLoading) return;

            document.title = "Payment Successful | HUBly";

            if (user) {
                const message = type === 'account_premium'
                    ? 'Premium account activated'
                    : `Promotion activated for ${toolName || 'your tool'}`;

                const notifBody = type === 'account_premium'
                    ? 'Congratulations. Your lifetime premium membership is now active.'
                    : `Your tool "${toolName || 'the tool'}" is now featured on the homepage.`;

                await sendNotification(user.id, message, notifBody, 'subscription');
                showToast(message, 'success');
            }
            setLoading(false);
        };
        handleSuccess();
    }, [user, authLoading, showToast, toolName, type]);

    if (loading) {
        return (
            <div className="success-page success-view-wrapper">
                <SkeletonLoader height="400px" width="500px" borderRadius="24px" />
            </div>
        );
    }

    return (
        <div className="success-page success-view-wrapper">
            <div className="glass-card success-glass-card">
                
                <SuccessHero type={type} />
                
                <SuccessMessage 
                    type={type} 
                    toolName={toolName} 
                />

                <SuccessActions />
                
            </div>
        </div>
    );
};

export default Success;
