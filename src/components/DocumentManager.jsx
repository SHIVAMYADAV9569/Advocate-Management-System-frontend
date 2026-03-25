import React, { useState } from 'react';
import DocumentUpload from './DocumentUpload';
import DocumentList from './DocumentList';
import './DocumentManager.css';

const DocumentManager = ({ caseId, clientId, userRole }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [shouldHighlight, setShouldHighlight] = useState(false);

  const handleUploadSuccess = (uploadedDocument) => {
    // Trigger refresh of document list
    setRefreshTrigger(prev => prev + 1);
    setShouldHighlight(true);
    
    // Show success notification with document name
    window.showNotification?.(
      `Document "${uploadedDocument.name}" uploaded successfully and is now visible below!`, 
      'success', 
      6000 // Show for longer since it's important information
    );
    
    // Remove highlight after animation
    setTimeout(() => setShouldHighlight(false), 2000);
  };

  return (
    <div className="document-manager">
      <div className="document-upload-section">
        <DocumentUpload 
          caseId={caseId} 
          clientId={clientId} 
          onUploadSuccess={handleUploadSuccess}
        />
      </div>
      
      <div className="document-list-section">
        <DocumentList 
          key={refreshTrigger} // Force re-render when refreshTrigger changes
          caseId={caseId} 
          clientId={clientId} 
          userRole={userRole}
          highlightNew={shouldHighlight}
        />
      </div>
    </div>
  );
};

export default DocumentManager;
