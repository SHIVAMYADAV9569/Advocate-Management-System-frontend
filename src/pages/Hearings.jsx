import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, User, Briefcase, Plus, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './Hearings.css';

const Hearings = ({ user, onLogout }) => {
  const [hearings, setHearings] = useState([]);
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    case: '',
    client: '',
    hearingDate: '',
    hearingTime: '',
    courtName: '',
    purpose: '',
    description: ''
  });

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchHearings();
    fetchCases();
    fetchClients();
  }, [activeTab]);

  const fetchHearings = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = activeTab === 'today' 
        ? `${API_URL}/hearings/today`
        : `${API_URL}/hearings/upcoming`;
      
      const response = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setHearings(data.data);
      }
    } catch (error) {
      console.error('Error fetching hearings:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/hearings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setHearings([data.data, ...hearings]);
        setShowModal(false);
        setFormData({
          case: '',
          client: '',
          hearingDate: '',
          hearingTime: '',
          courtName: '',
          purpose: '',
          description: ''
        });
      }
    } catch (error) {
      console.error('Error creating hearing:', error);
    }
  };

  const handleCaseChange = (e) => {
    const selectedCase = cases.find(c => c._id === e.target.value);
    setFormData({
      ...formData,
      case: e.target.value,
      client: selectedCase?.client?._id || '',
      courtName: selectedCase?.courtName || ''
    });
  };

  if (loading) {
    return (
      <div className="page-container">
        <Sidebar user={user} onLogout={onLogout} />
        <div className="main-content">
          <div className="loading">Loading hearings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="main-content">
        <div className="page-header">
          <h1>Hearings</h1>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} />
            Schedule Hearing
          </button>
        </div>

        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'today' ? 'active' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            Today's Hearings
          </button>
          <button 
            className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming (7 Days)
          </button>
        </div>

        <div className="hearings-list">
          {hearings.map((hearing) => (
            <div key={hearing._id} className="hearing-card">
              <div className="hearing-date">
                <span className="day">{new Date(hearing.hearingDate).getDate()}</span>
                <span className="month">{new Date(hearing.hearingDate).toLocaleString('default', { month: 'short' })}</span>
              </div>
              <div className="hearing-content">
                <h3>{hearing.purpose}</h3>
                <div className="hearing-details">
                  <span><Briefcase size={14} /> {hearing.case?.caseNumber}</span>
                  <span><User size={14} /> {hearing.client?.name}</span>
                  <span><Clock size={14} /> {hearing.hearingTime}</span>
                  <span><MapPin size={14} /> {hearing.courtName}</span>
                </div>
              </div>
              <div className="hearing-status">
                <span className={`status-badge ${hearing.status}`}>{hearing.status}</span>
              </div>
            </div>
          ))}
        </div>

        {hearings.length === 0 && (
          <div className="empty-state">
            <Calendar size={48} />
            <p>No {activeTab} hearings</p>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Schedule Hearing</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Case *</label>
                  <select 
                    required
                    value={formData.case}
                    onChange={handleCaseChange}
                  >
                    <option value="">Select Case</option>
                    {cases.map(c => (
                      <option key={c._id} value={c._id}>
                        {c.caseNumber} - {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Hearing Date *</label>
                    <input 
                      type="date" 
                      required
                      value={formData.hearingDate}
                      onChange={(e) => setFormData({...formData, hearingDate: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Hearing Time *</label>
                    <input 
                      type="time" 
                      required
                      value={formData.hearingTime}
                      onChange={(e) => setFormData({...formData, hearingTime: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Court Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.courtName}
                    onChange={(e) => setFormData({...formData, courtName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Purpose *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., First Hearing, Evidence, Arguments"
                    value={formData.purpose}
                    onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">Schedule Hearing</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hearings;
