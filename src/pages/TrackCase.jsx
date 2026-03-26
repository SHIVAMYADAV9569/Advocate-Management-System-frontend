import { useState } from 'react';
import { Search, FileText, Calendar, User, Scale, CheckCircle, Clock, AlertCircle, Download, Eye, DollarSign, MapPin } from 'lucide-react';
import './TrackCase.css';

const TrackCase = () => {
  const [trackingCode, setTrackingCode] = useState('');
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [downloadingDoc, setDownloadingDoc] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!trackingCode.trim()) {
      setError('Please enter a tracking code');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const response = await fetch(`http://localhost:5000/api/tracking/track/${trackingCode}`);
      const data = await response.json();

      if (data.success) {
        setCaseData(data.data);
      } else {
        setError(data.message || 'Case not found');
        setCaseData(null);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setCaseData(null);
    } finally {
      setLoading(false);
    }
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
      case 'won': return <CheckCircle size={20} className="text-green-600" />;
      case 'lost': return <AlertCircle size={20} className="text-red-600" />;
      case 'hearing': return <Calendar size={20} className="text-orange-600" />;
      case 'pending': return <Clock size={20} className="text-yellow-600" />;
      default: return <FileText size={20} className="text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownload = async (documentUrl, documentName) => {
    try {
      // Handle case where documentUrl might be undefined
      if (!documentUrl) {
        window.showNotification?.('Document URL not available', 'error');
        console.error('Document URL is undefined');
        return;
      }
      
      setDownloadingDoc(documentName);
      
      // Construct full URL for local files
      const fullUrl = documentUrl.startsWith('http') 
        ? documentUrl 
        : `http://localhost:5000${documentUrl}`;
      
      console.log('Downloading document:', fullUrl);
      
      // Open document in new tab
      window.open(fullUrl, '_blank');
    } catch (error) {
      console.error('Error downloading document:', error);
      window.showNotification?.('Failed to download document', 'error');
    } finally {
      setDownloadingDoc(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="track-case-container">
      <div className="track-case-header">
        <div className="header-content">
          <Scale size={48} className="logo-icon" />
          <div>
            <h1>Case Tracking System</h1>
            <p>Track your case status with your unique tracking code</p>
          </div>
        </div>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Enter tracking code (e.g., TRK00000001) or case number (e.g., CASE000001)"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
              className="search-input"
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? 'Searching...' : 'Track Case'}
            </button>
          </div>
        </form>
      </div>

      {error && searched && (
        <div className="error-message">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {caseData && (
        <div className="case-details">
          <div className="case-header">
            <div className="case-title-section">
              <h2>{caseData.title}</h2>
              <div className="tracking-codes">
              <div className="tracking-code">
                <span className="label">Tracking Code:</span>
                <span className="code">{caseData.trackingCode}</span>
              </div>
              <div className="case-number">
                <span className="label">Case Number:</span>
                <span className="code">{caseData.caseNumber}</span>
              </div>
            </div>
            </div>
            <div className={`status-badge ${getStatusColor(caseData.status)}`}>
              {getStatusIcon(caseData.status)}
              <span>{caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}</span>
            </div>
          </div>

          <div className="case-grid">
            <div className="info-card">
              <h3>Case Information</h3>
              <div className="info-item">
                <span className="label">Case Type:</span>
                <span className="value">{caseData.caseType.charAt(0).toUpperCase() + caseData.caseType.slice(1)}</span>
              </div>
              <div className="info-item">
                <span className="label">Court:</span>
                <span className="value">{caseData.courtName}</span>
              </div>
              <div className="info-item">
                <span className="label">Court Type:</span>
                <span className="value">{caseData.courtType.charAt(0).toUpperCase() + caseData.courtType.slice(1)}</span>
              </div>
              <div className="info-item">
                <span className="label">Priority:</span>
                <span className={`value priority-${caseData.priority}`}>
                  {caseData.priority.charAt(0).toUpperCase() + caseData.priority.slice(1)}
                </span>
              </div>
            </div>

            <div className="info-card">
              <h3>Important Dates</h3>
              <div className="info-item">
                <span className="label">Filing Date:</span>
                <span className="value">{formatDate(caseData.filingDate)}</span>
              </div>
              <div className="info-item">
                <span className="label">Next Hearing:</span>
                <span className="value">{formatDate(caseData.nextHearingDate)}</span>
              </div>
              <div className="info-item">
                <span className="label">Judgment Date:</span>
                <span className="value">{formatDate(caseData.judgmentDate)}</span>
              </div>
              <div className="info-item">
                <span className="label">Last Updated:</span>
                <span className="value">{formatDate(caseData.updatedAt)}</span>
              </div>
            </div>

            <div className="info-card">
              <h3>Client Information</h3>
              <div className="info-item">
                <User size={16} className="item-icon" />
                <span className="value">{caseData.client?.name || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="label">Phone:</span>
                <span className="value">{caseData.client?.phone || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="label">Email:</span>
                <span className="value">{caseData.client?.email || 'N/A'}</span>
              </div>
            </div>

            <div className="info-card">
              <h3>Advocate Information</h3>
              <div className="info-item">
                <User size={16} className="item-icon" />
                <span className="value">{caseData.advocate?.name || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="label">Bar Number:</span>
                <span className="value">{caseData.advocate?.barNumber || 'N/A'}</span>
              </div>
            </div>

            {/* Documents Section */}
            {caseData.documents && caseData.documents.length > 0 ? (
              <div className="info-card documents-card">
                <h3>Uploaded Documents</h3>
                <div className="documents-list">
                  {caseData.documents.map((doc, index) => (
                    <div key={doc._id || doc.publicId || `${doc.name}-${index}`} className="document-item">
                      <div className="document-info">
                        <div className="document-header">
                          <FileText size={16} className="document-icon" />
                          <span className="document-name">{doc.name}</span>
                          {doc.isConfidential && (
                            <span className="confidential-badge">Confidential</span>
                          )}
                          <button
                            onClick={() => handleDownload(doc.url, doc.name)}
                            className="download-button"
                            title={`Download ${doc.name}`}
                            disabled={downloadingDoc === doc.name}
                          >
                            {downloadingDoc === doc.name ? (
                              <span className="download-loading">Downloading...</span>
                            ) : (
                              <Download size={14} />
                            )}
                          </button>
                        </div>
                        <div className="document-details">
                          <div className="document-meta">
                            <span className="document-format">{doc.format?.toUpperCase()}</span>
                            <span className="document-size">{formatFileSize(doc.size)}</span>
                          </div>
                          <div className="document-uploader">
                            <span className="uploader-label">Uploaded by:</span>
                            <span className="uploader-name">{doc.advocate?.name || 'System'}</span>
                            {doc.advocate?.barNumber && (
                              <span className="uploader-bar">({doc.advocate.barNumber})</span>
                            )}
                          </div>
                          <div className="document-date">
                            <Clock size={12} />
                            {formatDate(doc.uploadedAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="info-card documents-card">
                <h3>Uploaded Documents</h3>
                <p className="no-documents">No documents have been uploaded for this case yet.</p>
              </div>
            )}

            {/* Hearings Section */}
            {caseData.hearings && caseData.hearings.length > 0 ? (
              <div className="info-card hearings-card">
                <h3>Hearings Schedule</h3>
                <div className="hearings-list">
                  {caseData.hearings.map((hearing) => (
                    <div key={hearing._id} className="hearing-item">
                      <div className="hearing-header">
                        <Calendar size={16} className="hearing-icon" />
                        <div className="hearing-title">{hearing.type}</div>
                        <span className={`hearing-status ${hearing.status}`}>
                          {hearing.status.charAt(0).toUpperCase() + hearing.status.slice(1)}
                        </span>
                      </div>
                      <div className="hearing-details">
                        <div className="hearing-datetime">
                          <Clock size={12} />
                          {formatDate(hearing.date)} at {hearing.time || 'TBA'}
                        </div>
                        {hearing.location && (
                          <div className="hearing-location">
                            <MapPin size={12} />
                            {hearing.location}
                          </div>
                        )}
                        {hearing.description && (
                          <div className="hearing-description">
                            {hearing.description}
                          </div>
                        )}
                        <div className="hearing-uploader">
                          <span className="uploader-label">Managed by:</span>
                          <span className="uploader-name">{hearing.advocate?.name || 'System'}</span>
                          {hearing.advocate?.barNumber && (
                            <span className="uploader-bar">({hearing.advocate.barNumber})</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="info-card hearings-card">
                <h3>Hearings Schedule</h3>
                <p className="no-hearings">No hearings scheduled for this case yet.</p>
              </div>
            )}

            {/* Payments Section */}
            {caseData.payments && caseData.payments.length > 0 ? (
              <div className="info-card payments-card">
                <h3>Payment Records</h3>
                <div className="payments-list">
                  {caseData.payments.map((payment) => (
                    <div key={payment._id} className="payment-item">
                      <div className="payment-header">
                        <DollarSign size={16} className="payment-icon" />
                        <div className="payment-title">{payment.type}</div>
                        <span className={`payment-status ${payment.status}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </div>
                      <div className="payment-details">
                        <div className="payment-amount">
                          <span className="amount-value">₹{payment.amount.toLocaleString()}</span>
                          {payment.dueDate && (
                            <span className="due-date">Due: {formatDate(payment.dueDate)}</span>
                          )}
                        </div>
                        {payment.description && (
                          <div className="payment-description">
                            {payment.description}
                          </div>
                        )}
                        <div className="payment-uploader">
                          <span className="uploader-label">Managed by:</span>
                          <span className="uploader-name">{payment.advocate?.name || 'System'}</span>
                          {payment.advocate?.barNumber && (
                            <span className="uploader-bar">({payment.advocate.barNumber})</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="info-card payments-card">
                <h3>Payment Records</h3>
                <p className="no-payments">No payment records for this case yet.</p>
              </div>
            )}
          </div>

          <div className="disclaimer">
            <AlertCircle size={16} />
            <p>
              This is a public view of the case information. For detailed inquiries or updates, 
              please contact your advocate directly. Personal information is partially masked for privacy.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackCase;
