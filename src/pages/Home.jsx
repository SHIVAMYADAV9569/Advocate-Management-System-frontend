import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Shield, Clock, Users, FileText, CheckCircle, MessageSquare, Phone, Mail, MapPin } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I track my case status?",
      answer: "Simply enter your case tracking number on our Track Case page. You'll get real-time updates on hearings, documents, and case progress."
    },
    {
      question: "What information do I need to register?",
      answer: "You'll need your basic personal information, contact details, and case-related documents. The registration process takes just 5 minutes."
    },
    {
      question: "Is my case information secure?",
      answer: "Yes, we use bank-level encryption to protect all your data. Only authorized parties can access case information."
    },
    {
      question: "How quickly can I expect updates?",
      answer: "Case updates are provided in real-time. You'll receive notifications for new hearings, document uploads, and status changes."
    },
    {
      question: "Can I communicate directly with my advocate?",
      answer: "Yes, our system includes secure messaging features for direct communication with your legal representative."
    }
  ];

  return (
    <div className="showcase-home">
      {/* Transparent Header */}
      <header className={`showcase-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
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
          <button 
            onClick={() => navigate('/dashboard')} 
            className="dashboard-btn"
          >
            Go to Dashboard
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Professional Legal Services Made Simple
            </h1>
            <p className="hero-subtitle">
              Track your cases, communicate with your advocate, and manage legal proceedings 
              all in one secure platform. Experience transparent and efficient legal case management.
            </p>
            <div className="hero-actions">
              <button 
                onClick={() => navigate('/register')} 
                className="cta-primary"
              >
                Get Started
              </button>
              <button 
                onClick={() => navigate('/track-my-case')} 
                className="cta-secondary"
              >
                Track Case
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image">
              <img 
                src="shivam yadav.jpeg" 
                alt="Legal Services" 
                className="hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Our System?</h2>
            <p>Comprehensive legal case management with modern technology</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FileText size={48} />
              </div>
              <h3>Case Tracking</h3>
              <p>
                Real-time tracking of your legal cases with instant updates on hearings, 
                documents, and case status. Never miss important developments.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={48} />
              </div>
              <h3>Secure Platform</h3>
              <p>
                Bank-level security protects your sensitive legal information. 
                End-to-end encryption ensures complete confidentiality.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <MessageSquare size={48} />
              </div>
              <h3>Direct Communication</h3>
              <p>
                Secure messaging system for direct communication with your advocate. 
                Share documents and get quick responses.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Clock size={48} />
              </div>
              <h3>24/7 Access</h3>
              <p>
                Access your case information anytime, anywhere. 
                Mobile-friendly design works on all devices.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Users size={48} />
              </div>
              <h3>Client Portal</h3>
              <p>
                Dedicated portal for clients to manage multiple cases, 
                view documents, and track all legal proceedings.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <CheckCircle size={48} />
              </div>
              <h3>Transparent Process</h3>
              <p>
                Complete transparency in legal proceedings. Track every step 
                and stay informed about your case progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Solved Section */}
      <section className="problems-section">
        <div className="container">
          <div className="section-header">
            <h2>Common Problems We Solve</h2>
            <p>Addressing the challenges clients face in legal case management</p>
          </div>
          
          <div className="problems-grid">
            <div className="problem-card">
              <div className="problem-icon">🔍</div>
              <h3>Lack of Case Visibility</h3>
              <p>
                Clients often struggle to know their case status. Our system provides 
                real-time updates and complete case transparency.
              </p>
            </div>

            <div className="problem-card">
              <div className="problem-icon">📞</div>
              <h3>Poor Communication</h3>
              <p>
                Difficulty reaching advocates and getting updates. Our messaging system 
                ensures clear and timely communication.
              </p>
            </div>

            <div className="problem-card">
              <div className="problem-icon">📁</div>
              <h3>Document Management</h3>
              <p>
                Lost or misplaced legal documents. Secure cloud storage keeps 
                all your files organized and accessible.
              </p>
            </div>

            <div className="problem-card">
              <div className="problem-icon">⏰</div>
              <h3>Missed Deadlines</h3>
              <p>
                Missing important hearing dates and deadlines. Automated notifications 
                ensure you never miss critical dates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about our legal case management system</p>
          </div>
          
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button 
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{faq.question}</span>
                  <ChevronDown 
                    className={`faq-icon ${activeFaq === index ? 'active' : ''}`}
                    size={20}
                  />
                </button>
                <div className={`faq-answer ${activeFaq === index ? 'active' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perfect Footer */}
      <footer className="perfect-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <div className="advocate-symbol">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Advocate System</h3>
                <p>Professional legal case management made simple and secure.</p>
              </div>
            </div>

            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><a href="/register">Get Started</a></li>
                <li><a href="/track-my-case">Track Case</a></li>
                <li><a href="/login">Login</a></li>
                <li><a href="/about">About Us</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Services</h4>
              <ul className="footer-links">
                <li>Case Tracking</li>
                <li>Document Management</li>
                <li>Client Portal</li>
                <li>Legal Consultation</li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Contact Info</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <Phone size={16} />
                  <span>+91 9569711271</span>
                </div>
                <div className="contact-item">
                  <Mail size={16} />
                  <span>shivam@advocatesystem.com</span>
                </div>
                <div className="contact-item">
                  <MapPin size={16} />
                  <span>Delhi, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 Advocate System. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
