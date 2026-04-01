import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { sendNotification } from '../utils/notifications';
import { useAuth } from '../context/AuthContext';
import SkeletonLoader from '../components/SkeletonLoader';
import { Link, useSearchParams } from 'react-router-dom';

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
            
            document.title = "Payment Successful | ServicesHUB";
            
            if (user) {
                const message = type === 'account_premium' 
                    ? 'Premium account activated! 💎' 
                    : `Promotion activated for ${toolName || 'your tool'}! 🚀`;
                
                const notifBody = type === 'account_premium'
                    ? 'Congratulations! Your lifetime premium membership is now active.'
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
            <div className="success-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SkeletonLoader height="400px" width="500px" borderRadius="24px" />
            </div>
        );
    }

    return (
        <div className="success-page" style={{ 
            minHeight: '80vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '100px 20px'
        }}>
            <div className="glass-card" style={{ 
                maxWidth: '500px', 
                textAlign: 'center', 
                padding: '3rem',
                border: '1px solid rgba(0, 210, 255, 0.3)'
            }}>
                <div style={{ 
                    margin: '0 auto 2rem',
                    color: 'var(--secondary)',
                    animation: 'pulse 2s infinite'
                }}>
                    <CheckCircle2 size={100} />
                </div>
                
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>
                    {type === 'account_premium' ? <>Welcome to <span className="gradient-text">Premium!</span></> : <>Promotion <span className="gradient-text">Activated!</span></>}
                </h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.2rem', lineHeight: '1.6' }}>
                    {type === 'account_premium' 
                        ? "Authentication successful! Your account has been upgraded to Lifetime Premium. You now have unlimited submissions and priority support."
                        : `Success! Your tool ${toolName ? `"${toolName}"` : ""} has been promoted. It will now appear in the featured sections across the platform.`
                    }
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/tools" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        Discover More Tools
                    </Link>
                    <Link to="/" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Success;
