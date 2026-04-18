import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2, AlertCircle, Trash2, MessageSquare } from 'lucide-react';
import './AIChatAssistant.css';

const AIChatAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('english');
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  console.log('🤖 AIChatAssistant component mounted');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    
    console.log('📤 Send clicked');
    if (!input.trim() || loading) return;

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No authentication token found');
      setError('Please login to use the AI assistant.');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setError('');

    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage, 
      timestamp: new Date().toISOString() 
    }]);
    setLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';
      const endpoint = `${API_BASE_URL}/api/ai/ask`;
      
      console.log('🌐 API URL:', endpoint);

      const response = await axios.post(endpoint, {
        message: userMessage,
        language: language,
        sessionId: sessionId
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Response:', response.data);

      if (response.data && response.data.success) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: response.data.data.response,
          timestamp: new Date().toISOString()
        }]);
        
        if (response.data.data.sessionId) {
          setSessionId(response.data.data.sessionId);
        }
      } else {
        throw new Error(response.data?.message || 'No response from AI');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      
      let errorMessage = 'Failed to get response. Please try again.';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          errorMessage = 'Please login again.';
        } else if (status === 404) {
          errorMessage = 'AI service not found.';
        } else if (status === 500) {
          errorMessage = data?.message || 'Server error.';
        } else if (data?.message) {
          errorMessage = data.message;
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Is backend running?';
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      if (window.showNotification) {
        window.showNotification(errorMessage, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setSessionId(null);
    setError('');
  };

  const suggestions = language === 'hindi' 
    ? ['आरटीआई कैसे दायर करें?', 'तलाक के नियम', 'प्रापर्टी विवाद']
    : ['How to file RTI?', 'Divorce laws', 'Property dispute'];

  return (
    <div className="ai-chat-container">
      {/* Debug Banner */}
      <div style={{ background: '#90EE90', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
        ✅ Chat Loaded | Messages: {messages.length}
      </div>

      <div className="chat-header">
        <div className="header-content">
          <div className="header-icon"><Bot size={28} /></div>
          <div>
            <h2>AI Legal Assistant</h2>
            <p className="header-subtitle">Your Indian Legal Guide 🇮🇳</p>
          </div>
        </div>
        <div className="header-controls">
          <div className="language-toggle">
            <button className={`lang-btn ${language === 'english' ? 'active' : ''}`} onClick={() => setLanguage('english')}>English</button>
            <button className={`lang-btn ${language === 'hindi' ? 'active' : ''}`} onClick={() => setLanguage('hindi')}>हिंदी</button>
          </div>
          <button className="clear-btn" onClick={handleClearChat}><Trash2 size={18} /> New Chat</button>
        </div>
      </div>

      <div className="disclaimer-banner">
        <AlertCircle size={16} />
        <p>⚠️ This is NOT professional legal advice. Consult a qualified advocate.</p>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-screen">
            <div className="welcome-icon"><MessageSquare size={48} /></div>
            <h3>Welcome to AI Legal Assistant!</h3>
            <p>Ask any question about Indian law</p>
            <div className="suggestions">
              <p className="suggestions-label">Quick suggestions:</p>
              <div className="suggestion-buttons">
                {suggestions.map((s, i) => (
                  <button key={i} className="suggestion-btn" onClick={() => setInput(s)}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <div className="message-avatar">{msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}</div>
              <div className="message-content">
                <div className="message-text">{msg.content}</div>
                <div className="message-time">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="message assistant">
            <div className="message-avatar"><Bot size={20} /></div>
            <div className="message-content">
              <div className="loading-indicator"><Loader2 size={20} className="spin" /><span>AI is thinking...</span></div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={language === 'hindi' ? 'अपना कानूनी प्रश्न पूछें...' : 'Ask your legal question...'}
          disabled={loading}
          className="input-field"
        />
        <button type="submit" className="send-button" disabled={loading || !input.trim()}>
          {loading ? <Loader2 size={20} className="spin" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
};

export default AIChatAssistant;
