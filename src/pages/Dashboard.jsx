import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useSEO from '../hooks/useSEO';
import SkeletonLoader from '../components/SkeletonLoader';

// Import Modular Components
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import DashboardStats from '../components/Dashboard/DashboardStats';
import DashboardViewsChart from '../components/Dashboard/DashboardViewsChart';
import DashboardToolsTable from '../components/Dashboard/DashboardToolsTable';
import DashboardFavorites from '../components/Dashboard/DashboardFavorites';
import DashboardWelcomeCTA from '../components/Dashboard/DashboardWelcomeCTA';

// Import Modular CSS
import '../styles/pages/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user, loading: authLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [userTools, setUserTools] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState(null);

    useSEO({
        title: userTools.length > 0 ? 'Creator Dashboard | HUBly' : 'My Dashboard | HUBly',
        description: 'Manage your submissions, track views, and explore your favorite tools all in one place.',
        url: typeof window !== 'undefined' ? window.location.href : 'https://hubly.com/dashboard'
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (authLoading) return;
            if (!user) {
                navigate('/auth');
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                // Fetch Tools
                const { data: toolsData, error: toolsErr } = await supabase.from('tools')
                    .select('id, name, slug, short_description, image_url, pricing_type, is_approved, is_featured, is_verified, featured_until, created_at, view_count, rating')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (toolsErr) console.warn('Dashboard: Tools fetch failed:', toolsErr.message);
                setUserTools(toolsData || []);

                // Fetch Favorites
                const { data: favsData, error: favsErr } = await supabase.from('favorites')
                    .select('tool_id, tools(id, name, slug, short_description, image_url, pricing_type, is_verified, categories(name))')
                    .eq('user_id', user.id);

                if (favsErr) console.warn('Dashboard: Favorites fetch failed:', favsErr.message);
                setFavorites(favsData || []);

            } catch (err) {
                console.error('Dashboard Critical Error:', err);
                setError("Unable to sync dashboard data completely.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, authLoading, navigate]);

    const handleDeleteTool = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;

        try {
            const { error } = await supabase.from('tools').delete().eq('id', id);
            if (error) throw error;
            setUserTools(prev => prev.filter(t => t.id !== id));
            showToast('Tool deleted successfully.', 'success');
        } catch (err) {
            showToast('Error deleting tool: ' + err.message, 'error');
        }
    };

    if (isLoading) {
        return (
            <div className="dashboard-page container" style={{ padding: '80px 5% 60px' }}>
                <SkeletonLoader type="title" width="300px" style={{ marginBottom: '2rem' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <SkeletonLoader height="120px" borderRadius="24px" />
                    <SkeletonLoader height="120px" borderRadius="24px" />
                    <SkeletonLoader height="120px" borderRadius="24px" />
                </div>
                <SkeletonLoader height="400px" borderRadius="24px" />
            </div>
        );
    }

    const isCreator = userTools.length > 0;

    return (
        <div className="dashboard-page container" style={{ padding: '80px 5% 60px' }}>
            
            <DashboardHeader 
                isCreator={isCreator} 
                user={user} 
                showToast={showToast} 
            />

            {error && (
                <div className="glass-card" style={{ padding: '1rem', marginBottom: '2rem', border: '1px solid #ff475733', color: '#ff4757', display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.9rem' }}>
                    <AlertCircle size={18} /> {error}
                </div>
            )}

            <DashboardStats 
                isCreator={isCreator} 
                userTools={userTools} 
                favorites={favorites} 
                user={user} 
            />

            {isCreator ? (
                <>
                    <DashboardViewsChart userTools={userTools} />
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: '900' }}>Your Active Listings</h2>
                    </div>
                    <DashboardToolsTable 
                        userTools={userTools} 
                        navigate={navigate} 
                        handleDeleteTool={handleDeleteTool} 
                    />
                </>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '3rem' }}>
                    <DashboardFavorites favorites={favorites} />
                    <DashboardWelcomeCTA />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
