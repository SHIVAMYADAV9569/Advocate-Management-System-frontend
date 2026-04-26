import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  X, 
  Bot, 
  User,
  Loader2,
  Volume2,
  Trash2
} from 'lucide-react';
import axios from 'axios';
import './AIAssistant.css';

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'hi-IN'; // Supports Hinglish

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    } else {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN'; // Supports Hinglish
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const sendMessage = async () => {
    if ((!inputMessage.trim() && !selectedImage) || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      image: imagePreview
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let response;

      // If there's an image, send it for analysis
      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('question', inputMessage || 'Please analyze this image and provide relevant legal insights.');

        const apiResponse = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai-assistant/analyze-image`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        response = apiResponse.data;
      } else {
        // Regular text chat
        const apiResponse = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai-assistant/chat`,
          {
            message: inputMessage,
            conversationHistory: conversationHistory
          }
        );

        response = apiResponse.data;
      }

      if (response.success) {
        const aiMessage = {
          role: 'assistant',
          content: response.response,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
        
        // Update conversation history
        const newHistory = [
          ...conversationHistory,
          { role: 'user', content: inputMessage },
          { role: 'assistant', content: response.response }
        ];
        setConversationHistory(newHistory.slice(-10)); // Keep last 10 messages
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      removeImage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationHistory([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="ai-assistant-container">
      {/* Header */}
      <div className="ai-header">
        <div className="ai-header-content">
          <Bot size={28} className="ai-icon" />
          <div>
            <h1>AI Legal Assistant</h1>
            <p className="ai-subtitle">Ask legal questions in English or Hinglish • Text • Voice • Image Analysis</p>
          </div>
        </div>
        <button className="clear-chat-btn" onClick={clearChat} title="Clear Chat">
          <Trash2 size={20} />
          Clear Chat
        </button>
      </div>

      {/* Messages Container */}
      <div className="ai-messages-container">
        {messages.length === 0 ? (
          <div className="welcome-screen">
            <Bot size={64} className="welcome-icon" />
            <h2>Welcome to AI Legal Assistant!</h2>
            <p>I can help you with legal questions, document analysis, and legal guidance.</p>
            <div className="suggestions">
              <h3>Try asking:</h3>
              <button onClick={() => setInputMessage('What is the procedure for filing an FIR?')} className="suggestion-btn">
                What is the procedure for filing an FIR?
              </button>
              <button onClick={() => setInputMessage('Mujhe bail ke baare mein jaankaari chahiye')} className="suggestion-btn">
                Mujhe bail ke baare mein jaankaari chahiye
              </button>
              <button onClick={() => setInputMessage('What documents are needed for property registration?')} className="suggestion-btn">
                What documents are needed for property registration?
              </button>
              <button onClick={() => setInputMessage('Consumer complaint kaise file karein?')} className="suggestion-btn">
                Consumer complaint kaise file karein?
              </button>
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}>
                <div className="message-avatar">
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className="message-content">
                  {msg.image && (
                    <img src={msg.image} alt="Uploaded" className="message-image" />
                  )}
                  <div className="message-text">{msg.content}</div>
                  <div className="message-footer">
                    <span className="message-time">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.role === 'assistant' && (
                      <button 
                        className="speak-btn" 
                        onClick={() => speakResponse(msg.content)}
                        title="Listen to response"
                      >
                        <Volume2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message ai-message">
                <div className="message-avatar">
                  <Bot size={20} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <Loader2 size={20} className="spinner" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="ai-input-container">
        {imagePreview && (
          <div className="image-preview-container">
            <img src={imagePreview} alt="Preview" className="image-preview" />
            <button className="remove-image-btn" onClick={removeImage}>
              <X size={20} />
            </button>
          </div>
        )}
        
        <div className="ai-input-wrapper">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            style={{ display: 'none' }}
          />
          
          <button 
            className="input-btn image-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Upload Image"
          >
            <ImageIcon size={20} />
          </button>

          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a legal question... (English or Hinglish)"
            className="ai-input"
            rows={1}
            disabled={isLoading}
          />

          <button 
            className={`input-btn mic-btn ${isListening ? 'listening' : ''}`}
            onClick={isListening ? stopListening : startListening}
            title={isListening ? 'Stop Listening' : 'Start Voice Input'}
            disabled={isLoading}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <button 
            className="input-btn send-btn"
            onClick={sendMessage}
            disabled={isLoading || (!inputMessage.trim() && !selectedImage)}
            title="Send Message"
          >
            {isLoading ? <Loader2 size={20} className="spinner" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
