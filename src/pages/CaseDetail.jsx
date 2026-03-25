import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Calendar, MapPin, IndianRupee, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import PaymentProcessor from '../components/PaymentProcessor';
import DocumentManager from '../components/DocumentManager';
import Sidebar from '../components/Sidebar';
import './CaseDetail.css';

const CaseDetail = () => {
  const { id } = useParams();
  const { user, hasRole } = useAuth();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchCase();
  }, [id]);

  const fetchCase = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/cases/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setCaseData(data.data);
      }
    } catch (error) {
      console.error('Error fetching case:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Sidebar user={user} />
        <div className="main-content">
          <div className="loading">Loading case...</div>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="page-container">
        <Sidebar user={user} />
        <div className="main-content">
          <div className="empty-state">
            <p>Case not found</p>
          </div>
        </div>
      </div>
    );
  }

  const { case: caseInfo, hearings, payments } = caseData;

  return (
    <div className="page-container">
      <Sidebar user={user} />
      <div className="main-content">
        <Link to="/cases" className="back-link">
          <ArrowLeft size={20} />
          Back to Cases
        </Link>

        <div className="case-detail-header">
          <div>
            <h1>{caseInfo.title}</h1>
            <p className="case-number">{caseInfo.caseNumber}</p>
          </div>
          <div className="case-badges">
            <span className={`status-badge ${caseInfo.status}`}>{caseInfo.status}</span>
            <span className={`priority-badge ${caseInfo.priority}`}>{caseInfo.priority}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="case-tabs">
          {['details', 'payments', 'documents'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'details' && (
            <div className="case-detail-grid">
              <div className="case-info-card">
                <h3>Case Information</h3>
                <div className="info-row">
                  <span className="label">Client:</span>
                  <Link to={`/clients/${caseInfo.client?._id}`} className="value link">
                    {caseInfo.client?.name}
                  </Link>
                </div>
                <div className="info-row">
                  <span className="label">Court:</span>
                  <span className="value">{caseInfo.courtName}</span>
                </div>
                <div className="info-row">
                  <span className="label">Case Type:</span>
                  <span className="value capitalize">{caseInfo.caseType}</span>
                </div>
                <div className="info-row">
                  <span className="label">Filing Date:</span>
                  <span className="value">{new Date(caseInfo.filingDate).toLocaleDateString()}</span>
                </div>
                {caseInfo.opponentName && (
                  <div className="info-row">
                    <span className="label">Opponent:</span>
                    <span className="value">{caseInfo.opponentName}</span>
                  </div>
                )}
              </div>

              <div className="case-info-card">
                <h3>Fee Details</h3>
                <div className="info-row">
                  <span className="label">Total Fee:</span>
                  <span className="value">₹{caseInfo.fee.total.toLocaleString()}</span>
                </div>
                <div className="info-row">
                  <span className="label">Paid:</span>
                  <span className="value paid">₹{caseInfo.fee.paid.toLocaleString()}</span>
                </div>
                <div className="info-row">
                  <span className="label">Pending:</span>
                  <span className="value pending">₹{caseInfo.fee.pending.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Section for Clients */}
              {hasRole('client') && caseInfo.fee.pending > 0 && (
                <div className="case-info-card full-width">
                  <h3>Make Payment</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Complete your payment for this case. Remaining amount: ₹{caseInfo.fee.pending.toLocaleString()}
                  </p>
                  <PaymentProcessor
                    caseId={caseInfo._id}
                    amount={caseInfo.fee.pending}
                    onPaymentSuccess={() => {
                      alert('Payment successful!');
                      fetchCase();
                    }}
                    onPaymentError={(error) => alert(`Payment failed: ${error}`)}
                  />
                </div>
              )}

              <div className="case-info-card full-width">
                <h3>Timeline</h3>
                {caseInfo.timeline.length > 0 ? (
                  <div className="timeline">
                    {caseInfo.timeline.map((item, idx) => (
                      <div key={idx} className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <p className="timeline-title">{item.title}</p>
                          <p className="timeline-desc">{item.description}</p>
                          <p className="timeline-date">
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No timeline entries yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="case-info-card full-width">
              <h3>Payment History</h3>
              {payments && payments.length > 0 ? (
                <div className="payments-table-container">
                  <table className="payments-table">
                    <thead>
                      <tr>
                        <th>Invoice #</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Transaction ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment._id}>
                          <td>{payment.invoiceNumber}</td>
                          <td className="amount">₹{payment.amount.toLocaleString()}</td>
                          <td className="capitalize">{payment.paymentType.replace('_', ' ')}</td>
                          <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                          <td>
                            <span className={`payment-status ${payment.status}`}>
                              {payment.status}
                            </span>
                          </td>
                          <td>{payment.transactionId || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-data">No payments recorded</p>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              {/* Document Management */}
              <DocumentManager
                caseId={caseInfo._id}
                userRole={user.role}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;
