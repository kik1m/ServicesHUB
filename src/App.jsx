import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { Loader2 } from 'lucide-react';
import './App.css';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Tools = lazy(() => import('./pages/Tools'));
const Categories = lazy(() => import('./pages/Categories'));
const About = lazy(() => import('./pages/About'));
const Profile = lazy(() => import('./pages/Profile'));
const Auth = lazy(() => import('./pages/Auth'));
const ToolDetail = lazy(() => import('./pages/ToolDetail'));
const CategoryDetail = lazy(() => import('./pages/CategoryDetail'));
const SubmitTool = lazy(() => import('./pages/SubmitTool'));
const Contact = lazy(() => import('./pages/Contact'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Premium = lazy(() => import('./pages/Premium'));
const Promote = lazy(() => import('./pages/Promote'));
const Success = lazy(() => import('./pages/Success'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Notifications = lazy(() => import('./pages/Notifications'));
const EditTool = lazy(() => import('./pages/EditTool'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Search = lazy(() => import('./pages/Search'));
const Compare = lazy(() => import('./pages/Compare'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const PublicProfile = lazy(() => import('./pages/PublicProfile'));

const PageLoader = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Loader2 className="animate-spin" size={40} color="var(--primary)" />
  </div>
);

const AuthSkeleton = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
    <div style={{
      width: '100%',
      maxWidth: '450px',
      padding: '2.5rem',
      background: 'var(--card-bg)',
      borderRadius: '24px',
      border: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginBottom: '1rem' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'var(--skeleton-bg)', animation: 'pulse 1.5s infinite ease-in-out' }} />
        <div style={{ width: '150px', height: '24px', borderRadius: '100px', background: 'var(--skeleton-bg)', animation: 'pulse 1.5s infinite ease-in-out' }} />
      </div>
      <div style={{ height: '76px', borderRadius: '14px', background: 'var(--skeleton-bg)', animation: 'pulse 1.5s infinite ease-in-out' }} />
      <div style={{ height: '76px', borderRadius: '14px', background: 'var(--skeleton-bg)', animation: 'pulse 1.5s infinite ease-in-out' }} />
      <div style={{ height: '54px', borderRadius: '12px', background: 'var(--skeleton-bg)', animation: 'pulse 1.5s infinite ease-in-out', marginTop: '10px' }} />
    </div>
  </div>
);

function App() {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className={`app-container ${isMounted ? 'is-ready' : ''}`}>
        <ScrollToTop />
        <Navbar />
        <main className="content">
          <Suspense fallback={null}>
            <Routes>
              {/* Core Exploration Routes (Silent Load) */}
              <Route path="/" element={
                <Suspense fallback={null}>
                  <Home />
                </Suspense>
              } />
              <Route path="/search" element={
                <Suspense fallback={null}>
                  <Search />
                </Suspense>
              } />
              <Route path="/categories" element={
                <Suspense fallback={null}>
                  <Categories />
                </Suspense>
              } />
              <Route path="/category/:id" element={
                <Suspense fallback={null}>
                  <CategoryDetail />
                </Suspense>
              } />
              <Route path="/tool/:id" element={
                <Suspense fallback={null}>
                  <ToolDetail />
                </Suspense>
              } />

              {/* Profile Routes (Silent Load) */}
              <Route path="/profile" element={
                <Suspense fallback={null}>
                  <Profile />
                </Suspense>
              } />
              <Route path="/profile/:id" element={
                <Suspense fallback={null}>
                  <PublicProfile />
                </Suspense>
              } />
              <Route path="/u/:id" element={
                <Suspense fallback={null}>
                  <PublicProfile />
                </Suspense>
              } />

              {/* Auth Routes (Custom Skeletons) */}
              <Route path="/auth" element={
                <Suspense fallback={<AuthSkeleton />}>
                  <Auth />
                </Suspense>
              } />
              <Route path="/reset-password" element={
                <Suspense fallback={<AuthSkeleton />}>
                  <ResetPassword />
                </Suspense>
              } />

              {/* Functional Routes */}
              <Route path="/dashboard" element={
                <Suspense fallback={null}>
                  <Dashboard />
                </Suspense>
              } />
              <Route path="/settings" element={
                <Suspense fallback={null}>
                  <Settings />
                </Suspense>
              } />
              <Route path="/submit" element={
                <Suspense fallback={null}>
                  <SubmitTool />
                </Suspense>
              } />
              <Route path="/edit-tool/:id" element={
                <Suspense fallback={null}>
                  <EditTool />
                </Suspense>
              } />

              {/* Secondary/Static Routes */}
              <Route path="/tools" element={
                <Suspense fallback={null}>
                  <Tools />
                </Suspense>
              } />
              <Route path="/about" element={
                <Suspense fallback={null}>
                  <About />
                </Suspense>
              } />
              <Route path="/contact" element={
                <Suspense fallback={null}>
                  <Contact />
                </Suspense>
              } />
              <Route path="/blog" element={
                <Suspense fallback={null}>
                  <Blog />
                </Suspense>
              } />
              <Route path="/blog/:id" element={
                <Suspense fallback={null}>
                  <BlogPost />
                </Suspense>
              } />
              <Route path="/faq" element={
                <Suspense fallback={null}>
                  <FAQ />
                </Suspense>
              } />
              <Route path="/terms" element={
                <Suspense fallback={null}>
                  <Terms />
                </Suspense>
              } />
              <Route path="/privacy" element={
                <Suspense fallback={null}>
                  <Privacy />
                </Suspense>
              } />
              <Route path="/premium" element={
                <Suspense fallback={null}>
                  <Premium />
                </Suspense>
              } />
              <Route path="/promote" element={
                <Suspense fallback={null}>
                  <Promote />
                </Suspense>
              } />
              <Route path="/compare" element={
                <Suspense fallback={null}>
                  <Compare />
                </Suspense>
              } />
              <Route path="/notifications" element={
                <Suspense fallback={null}>
                  <Notifications />
                </Suspense>
              } />
              <Route path="/admin" element={
                <Suspense fallback={null}>
                  <AdminDashboard />
                </Suspense>
              } />
              <Route path="/success" element={
                <Suspense fallback={null}>
                  <Success />
                </Suspense>
              } />
              <Route path="*" element={
                <Suspense fallback={null}>
                  <NotFound />
                </Suspense>
              } />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
