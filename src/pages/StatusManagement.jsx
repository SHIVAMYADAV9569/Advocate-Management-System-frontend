import { useEffect, useState } from 'react';
import { Search, Filter, Edit2, Save, X, Calendar, Scale, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './StatusManagement.css';

const StatusManagement = ({ user, onLogout }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingCase, setEditingCase] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  const API_URL = `${process.env.VITE_BASE_URL}/api`;

  useEffect(() => {
    fetchCases();
  }, [currentPage, statusFilter, searchTerm]);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`${API_URL}/tracking/status-management?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setCases(data.data.cases);
        setTotalPages(data.data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
      setMessage({ type: 'error', text: 'Failed to fetch cases' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (caseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/tracking/status/${caseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Case status updated successfully' });
        setEditingCase(null);
        setEditForm({});
        fetchCases();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update status' });
      }
    } catch (error) {
      console.error('Error updating case status:', error);
      setMessage({ type: 'error', text: 'Failed to update status' });
    }
  };

  const startEdit = (caseData) => {
    setEditingCase(caseData._id);
    setEditForm({
      status: caseData.status,
      nextHearingDate: caseData.nextHearingDate ? new Date(caseData.nextHearingDate).toISOString().split('T')[0] : '',
      judgmentDate: caseData.judgmentDate ? new Date(caseData.judgmentDate).toISOString().split('T')[0] : '',
      judgmentSummary: caseData.judgmentSummary || ''
    });
  };

  const cancelEdit = () => {
    setEditingCase(null);
    setEditForm({});
  };

  const getStatusColor = (status) => {
    const colors = {
      filed: 'blue',
      pending: 'yellow',
      ongoing: 'purple',
      hearing: 'orange',
      judgment: 'indigo',
      won: 'green',
      lost: 'red',
      settled: 'teal',
      dismissed: 'gray',
      withdrawn: 'gray'
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'won': return <CheckCircle size={16} className="text-green-600" />;
      case 'lost': return <AlertCircle size={16} className="text-red-600" />;
      case 'hearing': return <Calendar size={16} className="text-orange-600" />;
      case 'pending': return <Clock size={16} className="text-yellow-600" />;
      default: return <Scale size={16} className="text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const statusOptions = [
    { value: 'filed', label: 'Filed' },
    { value: 'pending', label: 'Pending' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'hearing', label: 'Hearing' },
    { value: 'judgment', label: 'Judgment' },
    { value: 'won', label: 'Won' },
    { value: 'lost', label: 'Lost' },
    { value: 'settled', label: 'Settled' },
    { value: 'dismissed', label: 'Dismissed' },
    { value: 'withdrawn', label: 'Withdrawn' }
  ];

  return (
    <div className="page-container">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="main-content">
        <div className="page-header">
          <h1>Case Status Management</h1>
          <p>Update and manage case statuses for your clients</p>
        </div>

        {message.text && (
          <div className={`message-banner ${message.type}`}>
            {message.type === 'success' && <CheckCircle size={20} />}
            {message.type === 'error' && <AlertCircle size={20} />}
            <span>{message.text}</span>
            <button onClick={() => setMessage({ type: '', text: '' })}>
              <X size={16} />
            </button>
          </div>
        )}

        <div className="filters-section">
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search by case number, tracking code, title, or court..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <Filter size={20} className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="all">All Status</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading cases...</div>
        ) : (
          <div className="cases-table-container">
            <table className="cases-table">
              <thead>
                <tr>
                  <th>Case Info</th>
                  <th>Client</th>
                  <th>Court</th>
                  <th>Status</th>
                  <th>Next Hearing</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((caseData) => (
                  <tr key={caseData._id}>
                    <td>
                      <div className="case-info">
                        <div className="case-title">{caseData.title}</div>
                        <div className="case-meta">
                          <span className="tracking-code">{caseData.trackingCode}</span>
                          <span className="case-number">{caseData.caseNumber}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="client-info">
                        <div className="client-name">{caseData.client?.name}</div>
                        <div className="client-phone">{caseData.client?.phone}</div>
                      </div>
                    </td>
                    <td>
                      <div className="court-info">
                        <div className="court-name">{caseData.courtName}</div>
                        <div className="court-type">{caseData.courtType}</div>
                      </div>
                    </td>
                    <td>
                      {editingCase === caseData._id ? (
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                          className="status-select"
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className={`status-badge ${getStatusColor(caseData.status)}`}>
                          {getStatusIcon(caseData.status)}
                          <span>{caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}</span>
                        </div>
                      )}
                    </td>
                    <td>
                      {editingCase === caseData._id ? (
                        <input
                          type="date"
                          value={editForm.nextHearingDate}
                          onChange={(e) => setEditForm({ ...editForm, nextHearingDate: e.target.value })}
                          className="date-input"
                        />
                      ) : (
                        <span className="date-value">{formatDate(caseData.nextHearingDate)}</span>
                      )}
                    </td>
                    <td>
                      <span className={`priority-badge priority-${caseData.priority}`}>
                        {caseData.priority.charAt(0).toUpperCase() + caseData.priority.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {editingCase === caseData._id ? (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(caseData._id)}
                              className="btn-save"
                              title="Save"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="btn-cancel"
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEdit(caseData)}
                            className="btn-edit"
                            title="Edit Status"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {cases.length === 0 && (
              <div className="no-cases">
                <Scale size={48} className="no-cases-icon" />
                <h3>No cases found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusManagement;
