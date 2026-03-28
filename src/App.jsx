import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tools from './pages/Tools';
import Categories from './pages/Categories';
import About from './pages/About';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import ToolDetail from './pages/ToolDetail';
import CategoryDetail from './pages/CategoryDetail';
import SubmitTool from './pages/SubmitTool';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import FAQ from './pages/FAQ';
import Premium from './pages/Premium';
import Promote from './pages/Promote';
import Success from './pages/Success';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import EditTool from './pages/EditTool';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';
import Search from './pages/Search';
import Compare from './pages/Compare';
import ResetPassword from './pages/ResetPassword';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
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
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
