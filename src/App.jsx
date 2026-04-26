import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import RoleBasedNavigation from './components/RoleBasedNavigation';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import Cases from './pages/Cases';
import CaseDetail from './pages/CaseDetail';
import Hearings from './pages/Hearings';
import Payments from './pages/Payments';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import TrackCase from './pages/TrackCase';
import StatusManagement from './pages/StatusManagement';
import AIAssistant from './pages/AIAssistant';
import Notifications from './components/Notifications';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Notifications />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/track-my-case" element={<TrackCase />} />
            
            {/* Protected Routes */}
            <Route path="/*" element={<ProtectedRoutes />}>
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="clients" element={<Clients />} />
              <Route path="clients/:id" element={<ClientDetail />} />
              <Route path="cases" element={<Cases />} />
              <Route path="cases/:id" element={<CaseDetail />} />
              <Route path="hearings" element={<Hearings />} />
              <Route path="payments" element={<Payments />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="settings" element={<Settings />} />
              <Route path="status-management" element={<StatusManagement />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Protected Routes Component
const ProtectedRoutes = () => {
  const { user, loading } = useAuth();
  
  console.log('ProtectedRoutes - user:', user);
  console.log('ProtectedRoutes - loading:', loading);
  
  if (loading) {
    console.log('ProtectedRoutes - showing loading');
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    console.log('ProtectedRoutes - no user, redirecting to login');
    return <Navigate to="/login" />;
  }
  
  console.log('ProtectedRoutes - user exists, rendering protected content');
  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/:id" element={<ClientDetail />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/cases/:id" element={<CaseDetail />} />
        <Route path="/hearings" element={<Hearings />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/status-management" element={<StatusManagement />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
      </Routes>
    </>
  );
};

export default App;
