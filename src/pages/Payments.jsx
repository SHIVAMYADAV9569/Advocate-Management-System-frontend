import { useEffect, useState } from 'react';
import { IndianRupee, Plus, FileText, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './Payments.css';

const Payments = ({ user, onLogout }) => {
  const [payments, setPayments] = useState([]);
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    case: '',
    amount: '',
    paymentType: 'consultation',
    paymentDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    description: '',
    status: 'pending'
  });

  const API_URL = `${process.env.VITE_BASE_URL}/api`;

  useEffect(() => {
    fetchPayments();
    fetchStats();
    fetchCases();
    fetchClients();
  }, [activeTab]);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = activeTab === 'pending' 
        ? `${API_URL}/payments/pending`
        : `${API_URL}/payments`;
      
      const response = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setPayments(data.data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/payments/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
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
      const response = await fetch(`${API_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount)
        })
      });
      const data = await response.json();
      if (data.success) {
        setPayments([data.data, ...payments]);
        setShowModal(false);
        setFormData({
          client: '',
          case: '',
          amount: '',
          paymentType: 'consultation',
          paymentDate: new Date().toISOString().split('T')[0],
          dueDate: '',
          description: '',
          status: 'pending'
        });
        fetchStats();
      }
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  const handleCaseChange = (e) => {
    const selectedCase = cases.find(c => c._id === e.target.value);
    setFormData({
      ...formData,
      case: e.target.value,
      client: selectedCase?.client?._id || ''
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle size={20} className="text-green-500" />;
      case 'pending': return <Clock size={20} className="text-yellow-500" />;
      case 'overdue': return <AlertCircle size={20} className="text-red-500" />;
      default: return <Clock size={20} className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Sidebar user={user} onLogout={onLogout} />
        <div className="main-content">
          <div className="loading">Loading payments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="main-content">
        <div className="page-header">
          <h1>Payments</h1>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} />
            Record Payment
          </button>
        </div>

        {/* Stats Cards */}
        <div className="payment-stats">
          <div className="payment-stat-card">
            <div className="stat-icon green">
              <IndianRupee size={24} />
            </div>
            <div className="stat-info">
              <h3>₹{(stats?.overview?.paidAmount || 0).toLocaleString()}</h3>
              <p>Total Collected</p>
            </div>
          </div>
          <div className="payment-stat-card">
            <div className="stat-icon yellow">
              <IndianRupee size={24} />
            </div>
            <div className="stat-info">
              <h3>₹{(stats?.overview?.pendingAmount || 0).toLocaleString()}</h3>
              <p>Pending Amount</p>
            </div>
          </div>
          <div className="payment-stat-card">
            <div className="stat-icon blue">
              <FileText size={24} />
            </div>
            <div className="stat-info">
              <h3>{stats?.overview?.totalPayments || 0}</h3>
              <p>Total Invoices</p>
            </div>
          </div>
        </div>

        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Payments
          </button>
          <button 
            className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
        </div>

        <div className="payments-table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.invoiceNumber}</td>
                  <td>{payment.client?.name}</td>
                  <td className="amount">₹{payment.amount.toLocaleString()}</td>
                  <td className="capitalize">{payment.paymentType.replace('_', ' ')}</td>
                  <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`payment-status ${payment.status}`}>
                      {getStatusIcon(payment.status)}
                      <span className="capitalize">{payment.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {payments.length === 0 && (
          <div className="empty-state">
            <IndianRupee size={48} />
            <p>No payments found</p>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Record Payment</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
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
                  <div className="form-group">
                    <label>Client *</label>
                    <select 
                      required
                      value={formData.client}
                      onChange={(e) => setFormData({...formData, client: e.target.value})}
                    >
                      <option value="">Select Client</option>
                      {clients.map(client => (
                        <option key={client._id} value={client._id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Amount (₹) *</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Payment Type *</label>
                    <select 
                      required
                      value={formData.paymentType}
                      onChange={(e) => setFormData({...formData, paymentType: e.target.value})}
                    >
                      <option value="consultation">Consultation</option>
                      <option value="case_fee">Case Fee</option>
                      <option value="hearing_fee">Hearing Fee</option>
                      <option value="documentation">Documentation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Payment Date *</label>
                    <input 
                      type="date" 
                      required
                      value={formData.paymentDate}
                      onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Due Date</label>
                    <input 
                      type="date" 
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select 
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
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
                  <button type="submit" className="btn-primary">Record Payment</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
