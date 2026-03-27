import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Phone, Mail, User, Filter } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './Clients.css';

const Clients = ({ user, onLogout }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: { street: '', city: '', state: '', pincode: '' },
    caseType: 'civil',
    notes: ''
  });

  const API_URL = `${import.meta.env.VITE_BASE_URL}/api`;

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/clients`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setClients(data.data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setClients([data.data, ...clients]);
        setShowModal(false);
        setFormData({
          name: '',
          phone: '',
          email: '',
          address: { street: '', city: '', state: '', pincode: '' },
          caseType: 'civil',
          notes: ''
        });
      }
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="page-container">
        <Sidebar user={user} onLogout={onLogout} />
        <div className="main-content">
          <div className="loading">Loading clients...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="main-content">
        <div className="page-header">
          <h1>Clients</h1>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} />
            Add Client
          </button>
        </div>

        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search clients by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="clients-grid">
          {filteredClients.map((client) => (
            <Link to={`/clients/${client._id}`} key={client._id} className="client-card">
              <div className="client-avatar">
                <User size={32} />
              </div>
              <div className="client-info">
                <h3>{client.name}</h3>
                <p className="client-id">{client.clientId}</p>
                <div className="client-contact">
                  <span><Phone size={14} /> {client.phone}</span>
                  {client.email && <span><Mail size={14} /> {client.email}</span>}
                </div>
                <div className="client-meta">
                  <span className={`case-type ${client.caseType}`}>{client.caseType}</span>
                  <span className="client-cases">{client.totalCases} Cases</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="empty-state">
            <User size={48} />
            <p>No clients found</p>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Add New Client</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Case Type</label>
                  <select
                    value={formData.caseType}
                    onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                  >
                    <option value="criminal">Criminal</option>
                    <option value="civil">Civil</option>
                    <option value="family">Family</option>
                    <option value="property">Property</option>
                    <option value="corporate">Corporate</option>
                    <option value="tax">Tax</option>
                    <option value="labor">Labor</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">Add Client</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;
