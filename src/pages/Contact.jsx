import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';
import './Home.css';

const Contact = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const menuItems = [
    { path: '/home', label: 'Home', icon: '🏠' },
    { path: '/about', label: 'About', icon: '👤' },
    { path: '/contact', label: 'Contact', icon: '📞' },
  ];

  return (
    <div className="home-container">
      {/* Sidebar Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
      
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-icon">⚖️</span>
            <span className="sidebar-title">Menu</span>
          </div>
          <button className="sidebar-close" onClick={closeSidebar}>✕</button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={location.pathname === item.path ? 'active' : ''}
                  onClick={closeSidebar}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-logout">
            <span className="menu-icon">🚪</span>
            <span className="menu-label">Logout</span>
          </button>
        </div>
      </aside>

      <header className="header">
        <button className="hamburger-menu" onClick={toggleSidebar} aria-label="Open menu">
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <div className="logo-section">
          <div className="advocate-symbol" title="Advocate Symbol - Scales of Justice">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="logo-text">Advocate System</span>
        </div>
        <nav className="nav-center desktop-nav">
          <ul className="nav-links">
            <li><Link to="/home">Homepage</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact" className="active">Contact</Link></li>
          </ul>
        </nav>
        <div className="user-section">
          {user && <span className="welcome-text">Welcome, {user.username}!</span>}
          <button onClick={handleLogout} className="logout-button desktop-logout">Logout</button>
        </div>
      </header>

      <main className="main-content">
        <section className="info-section contact-section">
          <div className="contact-header">
            <div className="contact-symbol">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>Contact Us</h2>
          </div>
          
          <div className="contact-content">
            <div className="contact-card">
              <div className="contact-item">
                <span className="contact-icon">👤</span>
                <div>
                  <label>Name</label>
                  <p>Shivam Yadav</p>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <div>
                  <label>Email</label>
                  <p>shivam@gmail.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <div className="contact-phone">
                  <label>Mobile Number</label>
                  <p>9569711271</p>
                </div>
                <a href="tel:9569711271" className="call-button">
                  <span className="call-icon">📞</span>
                  Call Me
                </a>
              </div>
              
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <label>Address</label>
                  <p>Salempur, Deoria, Uttar Pradesh</p>
                  <p className="pin-code">PIN Code: 274509</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2026 Advocate System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Contact;
