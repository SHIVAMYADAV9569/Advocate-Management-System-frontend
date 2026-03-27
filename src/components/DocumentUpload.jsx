import React, { useState } from 'react';
import axios from 'axios';

const DocumentUpload = ({ caseId, clientId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [documentInfo, setDocumentInfo] = useState({
    name: '',
    type: 'other',
    category: 'general',
    description: '',
    isConfidential: false
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        window.showNotification?.('File size must be less than 10MB', 'error');
        return;
      }
      setFile(selectedFile);
      // Auto-fill name if not provided
      if (!documentInfo.name) {
        setDocumentInfo(prev => ({
          ...prev,
          name: selectedFile.name
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      window.showNotification?.('Please select a file to upload', 'warning');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caseId', caseId || '');
    formData.append('clientId', clientId || '');
    formData.append('name', documentInfo.name);
    formData.append('type', documentInfo.type);
    formData.append('category', documentInfo.category);
    formData.append('description', documentInfo.description);
    formData.append('isConfidential', documentInfo.isConfidential);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.VITE_BASE_URL}/api/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        onUploadSuccess && onUploadSuccess(response.data.data); // Pass the uploaded document data
        // Reset form
        setFile(null);
        setDocumentInfo({
          name: '',
          type: 'other',
          category: 'general',
          description: '',
          isConfidential: false
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      window.showNotification?.(error.response?.data?.message || 'Failed to upload document', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="document-upload bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Upload Document</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select File *
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF (Max 10MB)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Name
          </label>
          <input
            type="text"
            value={documentInfo.name}
            onChange={(e) => setDocumentInfo(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter document name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <select
              value={documentInfo.type}
              onChange={(e) => setDocumentInfo(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="petition">Petition</option>
              <option value="affidavit">Affidavit</option>
              <option value="contract">Contract</option>
              <option value="agreement">Agreement</option>
              <option value="evidence">Evidence</option>
              <option value="judgment">Judgment</option>
              <option value="notice">Notice</option>
              <option value="power_of_attorney">Power of Attorney</option>
              <option value="id_proof">ID Proof</option>
              <option value="address_proof">Address Proof</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={documentInfo.category}
              onChange={(e) => setDocumentInfo(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="client">Client</option>
              <option value="case">Case</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={documentInfo.description}
            onChange={(e) => setDocumentInfo(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Enter document description"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isConfidential"
            checked={documentInfo.isConfidential}
            onChange={(e) => setDocumentInfo(prev => ({ ...prev, isConfidential: e.target.checked }))}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isConfidential" className="ml-2 block text-sm text-gray-900">
            Mark as confidential
          </label>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>
    </div>
  );
};

export default DocumentUpload;
