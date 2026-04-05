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

function App() {
  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      <div className="app-container">
        <ScrollToTop />
        <Navbar />
        <main className="content">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/u/:id" element={<PublicProfile />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/tool/:id" element={<ToolDetail />} />
              <Route path="/category/:id" element={<CategoryDetail />} />
              <Route path="/submit" element={<SubmitTool />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/promote" element={<Promote />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/edit-tool/:id" element={<EditTool />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/search" element={<Search />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/success" element={<Success />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
