import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Briefcase, Calendar, User, Filter } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './Cases.css';

const Cases = ({ user, onLogout }) => {
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    caseType: 'civil',
    courtName: '',
    filingDate: '',
    opponentName: '',
    description: '',
    priority: 'medium',
    fee: { total: 0 }
  });

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchCases();
    fetchClients();
  }, []);

  const fetchCases = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/cases`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setCases(data.data);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const handleUpdate = async (caseToUpdate) => {
    setSelectedCase(caseToUpdate);
    setFormData({
      title: caseToUpdate.title,
      client: caseToUpdate.client?._id,
      caseType: caseToUpdate.caseType,
      courtName: caseToUpdate.courtName,
      filingDate: caseToUpdate.filingDate?.split('T')[0],
      opponentName: caseToUpdate.opponentName || '',
      description: caseToUpdate.description || '',
      priority: caseToUpdate.priority,
      fee: caseToUpdate.fee || { total: 0 }
    });
    setShowUpdateModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          filingDate: formData.filingDate
        })
      });
      const data = await response.json();
      if (data.success) {
        setCases([data.data, ...cases]);
        setShowModal(false);
        setFormData({
          title: '',
          client: '',
          caseType: 'civil',
          courtName: '',
          filingDate: '',
          opponentName: '',
          description: '',
          priority: 'medium',
          fee: { total: 0 }
        });
      }
    } catch (error) {
      console.error('Error creating case:', error);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/cases/${selectedCase._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          filingDate: formData.filingDate
        })
      });
      const data = await response.json();
      if (data.success) {
        setCases(cases.map(c => c._id === selectedCase._id ? data.data : c));
        setShowUpdateModal(false);
        setSelectedCase(null);
        setFormData({
          title: '',
          client: '',
          caseType: 'civil',
          courtName: '',
          filingDate: '',
          opponentName: '',
          description: '',
          priority: 'medium',
          fee: { total: 0 }
        });
      }
    } catch (error) {
      console.error('Error updating case:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      filed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      ongoing: 'bg-purple-100 text-purple-800',
      hearing: 'bg-orange-100 text-orange-800',
      won: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800',
      settled: 'bg-teal-100 text-teal-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      urgent: 'bg-red-100 text-red-600'
    };
    return colors[priority] || 'bg-gray-100';
  };

  const filteredCases = cases.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.courtName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="page-container">
        <Sidebar user={user} onLogout={onLogout} />
        <div className="main-content">
          <div className="loading">Loading cases...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="main-content">
        <div className="page-header">
          <h1>Cases</h1>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} />
            Add Case
          </button>
        </div>

        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search cases by title, number, or court..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="cases-grid">
          {filteredCases.map((c) => (
            <Link to={`/cases/${c._id}`} key={c._id} className="case-card">
              <div className="case-header">
                <div className="case-icon">
                  <Briefcase size={24} />
                </div>
                <div className="case-badges">
                  <span className={`badge ${getStatusColor(c.status)}`}>{c.status}</span>
                  <span className={`badge ${getPriorityColor(c.priority)}`}>{c.priority}</span>
                </div>
                <button 
                  className="update-btn" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUpdate(c);
                  }}
                  title="Update Case"
                >
                  <Filter size={16} />
                </button>
              </div>
              <div className="case-content">
                <h3>{c.title}</h3>
                <p className="case-number">{c.caseNumber}</p>
                <div className="case-details">
                  <span><User size={14} /> {c.client?.name || 'Unknown'}</span>
                  <span><Calendar size={14} /> Filed: {new Date(c.filingDate).toLocaleDateString()}</span>
                </div>
                <div className="case-footer">
                  <span className="court-name">{c.courtName}</span>
                  <span className="case-type">{c.caseType}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="empty-state">
            <Briefcase size={48} />
            <p>No cases found</p>
          </div>
        )}

        {showUpdateModal && (
          <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
            <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
              <h2>Update Case</h2>
              <form onSubmit={handleUpdateSubmit}>
                <div className="form-group">
                  <label>Case Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Client *</label>
                    <select
                      required
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    >
                      <option value="">Select Client</option>
                      {clients.map(client => (
                        <option key={client._id} value={client._id}>{client.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Case Type *</label>
                    <select
                      required
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
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Court Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.courtName}
                      onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Filing Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.filingDate}
                      onChange={(e) => setFormData({ ...formData, filingDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Opponent Name</label>
                  <input
                    type="text"
                    value={formData.opponentName}
                    onChange={(e) => setFormData({ ...formData, opponentName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Priority *</label>
                  <select
                    required
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Update Case</button>
                  <button type="button" className="btn-secondary" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
              <h2>Add New Case</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Case Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Client *</label>
                    <select
                      required
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    >
                      <option value="">Select Client</option>
                      {clients.map(client => (
                        <option key={client._id} value={client._id}>{client.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Case Type *</label>
                    <select
                      required
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
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Court Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.courtName}
                      onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Filing Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.filingDate}
                      onChange={(e) => setFormData({ ...formData, filingDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Opponent Name</label>
                    <input
                      type="text"
                      value={formData.opponentName}
                      onChange={(e) => setFormData({ ...formData, opponentName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">Add Case</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cases;
