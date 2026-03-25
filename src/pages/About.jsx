import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import './Home.css';

const About = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
            <li><Link to="/about" className="active">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
        <div className="user-section">
          {user && <span className="welcome-text">Welcome, {user.username}!</span>}
          <button onClick={handleLogout} className="logout-button desktop-logout">Logout</button>
        </div>
      </header>

      <main className="main-content">
        <section className="info-section about-section">
          <div className="about-header">
            <div className="profile-avatar">⚖️</div>
            <div className="profile-info">
              <h2>Advocate Shivam Yadav</h2>
              <span className="profile-title">Professional Lawyer</span>
            </div>
          </div>
          
          <div className="about-content">
            <p className="about-intro">
              Advocate Shivam Yadav is a professional lawyer with several 15 years of experience in the legal field. 
              He has completed his qualifications in law and specializes in areas such as criminal law, civil law, 
              family law, and property law.
            </p>
            
            <div className="specialization-section">
              <h3>Areas of Specialization</h3>
              <div className="specialization-grid">
                <div className="specialization-card">
                  <div className="spec-icon">⚖️</div>
                  <h4>Criminal Law</h4>
                  <p>Defense and prosecution in criminal cases</p>
                </div>
                <div className="specialization-card">
                  <div className="spec-icon">📋</div>
                  <h4>Civil Law</h4>
                  <p>Civil disputes and litigation matters</p>
                </div>
                <div className="specialization-card">
                  <div className="spec-icon">👨‍👩‍👧</div>
                  <h4>Family Law</h4>
                  <p>Family disputes and matrimonial cases</p>
                </div>
                <div className="specialization-card">
                  <div className="spec-icon">🏠</div>
                  <h4>Property Law</h4>
                  <p>Property disputes and documentation</p>
                </div>
              </div>
            </div>
            
            <div className="services-section">
              <h3>Legal Services</h3>
              <div className="services-list">
                <div className="service-item">
                  <span className="service-bullet">✓</span>
                  <p>Legal advice and consultation</p>
                </div>
                <div className="service-item">
                  <span className="service-bullet">✓</span>
                  <p>Case handling and management</p>
                </div>
                <div className="service-item">
                  <span className="service-bullet">✓</span>
                  <p>Documentation support</p>
                </div>
                <div className="service-item">
                  <span className="service-bullet">✓</span>
                  <p>Court representation in District Courts and High Courts</p>
                </div>
              </div>
            </div>
            
            <div className="practice-section">
              <h3>Practice Areas</h3>
              <p>
                He practices in <strong>District Courts</strong> and <strong>High Courts</strong>, 
                providing comprehensive legal services to clients. He is dedicated to helping people 
                with honest legal guidance and effective solutions to their legal problems.
              </p>
            </div>
            
            <div className="career-section">
              <h3>Career Highlights</h3>
              <p>
                Throughout his career, he has handled many important cases and earned recognition 
                for his work and commitment. His goal is to provide the best legal services and 
                support to his clients with <strong>professionalism</strong> and <strong>integrity</strong>.
              </p>
            </div>
            
            <div className="goal-section">
              <h3>Professional Goal</h3>
              <p>
                To provide the best legal services and support to clients with professionalism 
                and integrity, ensuring justice and fair representation for all.
              </p>
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

export default About;
