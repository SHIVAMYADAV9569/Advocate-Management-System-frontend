import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Briefcase, FileText } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './ClientDetail.css';

const ClientDetail = ({ user, onLogout }) => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/clients/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setClient(data.data);
      }
    } catch (error) {
      console.error('Error fetching client:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Sidebar user={user} onLogout={onLogout} />
        <div className="main-content">
          <div className="loading">Loading client...</div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="page-container">
        <Sidebar user={user} onLogout={onLogout} />
        <div className="main-content">
          <div className="empty-state">
            <p>Client not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="main-content">
        <Link to="/clients" className="back-link">
          <ArrowLeft size={20} />
          Back to Clients
        </Link>

        <div className="client-detail-header">
          <div className="client-avatar-large">
            {client.client.name.charAt(0).toUpperCase()}
          </div>
          <div className="client-header-info">
            <h1>{client.client.name}</h1>
            <p className="client-id">{client.client.clientId}</p>
            <span className={`case-type-badge ${client.client.caseType}`}>
              {client.client.caseType}
            </span>
          </div>
        </div>

        <div className="client-detail-grid">
          <div className="detail-card">
            <h3>Contact Information</h3>
            <div className="detail-item">
              <Phone size={18} />
              <span>{client.client.phone}</span>
            </div>
            {client.client.email && (
              <div className="detail-item">
                <Mail size={18} />
                <span>{client.client.email}</span>
              </div>
            )}
          </div>

          <div className="detail-card">
            <h3>Cases</h3>
            {client.cases.length > 0 ? (
              client.cases.map(c => (
                <Link to={`/cases/${c._id}`} key={c._id} className="case-link">
                  <Briefcase size={18} />
                  <span>{c.caseNumber} - {c.title}</span>
                </Link>
              ))
            ) : (
              <p className="no-data">No cases yet</p>
            )}
          </div>

          <div className="detail-card">
            <h3>Payment Summary</h3>
            <div className="payment-summary">
              <div>
                <p className="label">Total Paid</p>
                <p className="value">₹{client.client.totalPayments.toLocaleString()}</p>
              </div>
              <div>
                <p className="label">Pending</p>
                <p className="value pending">₹{client.client.pendingAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
