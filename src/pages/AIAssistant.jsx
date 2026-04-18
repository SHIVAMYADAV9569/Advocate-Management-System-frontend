import React from 'react';
import AIChatAssistant from '../components/AIChatAssistant';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';
import './AIAssistant.css';

const AIAssistant = () => {
  const { user } = useAuth();

  console.log('📄 AIAssistant page rendering');
  console.log('👤 User:', user);

  if (!user) {
    console.log('⚠️ No user found');
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Please login to access AI Assistant</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      <Sidebar user={user} />
      <div className="main-content" style={{ marginLeft: '260px', padding: '2rem' }}>
        <div style={{ background: 'yellow', padding: '15px', marginBottom: '20px', borderRadius: '10px', fontWeight: 'bold', textAlign: 'center' }}>
          ✅ AI Assistant Page Loaded Successfully!
        </div>

        <div className="page-header" style={{ marginBottom: '2rem' }}>
          <h1>🤖 AI Legal Assistant</h1>
          <p>Get instant answers to your legal questions powered by Artificial Intelligence</p>
        </div>
        
        <AIChatAssistant />
      </div>
    </div>
  );
};

export default AIAssistant;
