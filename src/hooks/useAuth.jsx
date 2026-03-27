import { useState, useEffect, useContext, createContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('useEffect running, token:', token ? 'exists' : 'none');
    if (token) {
      console.log('Token found, fetching user...');
      fetchUser();
    } else {
      console.log('No token found, setting loading to false');
      setLoading(false);
    }
  }, []); // Empty dependency array - only run once

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching user with token:', token ? 'exists' : 'none');
      
      if (!token) {
        console.log('No token found, setting user to null');
        setUser(null);
        setLoading(false);
        return;
      }
      console.log(`Making request to: ${import.meta.env.VITE_BASE_URL}/api/auth/me`);
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('User data received:', data);
        setUser(data.data);
      } else if (response.status === 401) {
        // Token expired or invalid
        console.log('Token expired or invalid, removing...');
        localStorage.removeItem('token');
        setUser(null);
      } else {
        console.log('Auth response not ok:', response.status, response.statusText);
        // Don't remove token on other errors, just log them
      }
    } catch (error) {
      console.error('Network error fetching user:', error);
      // Don't remove token on network errors
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login with email:', email);
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('Login response:', data);
      console.log('Response status:', response.status);

      if (response.ok) {
        console.log('Login successful, storing token:', data.token);
        localStorage.setItem('token', data.token);
        setUser(data.data);
        return { success: true };
      } else {
        console.error('Login failed:', data.message);
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Network error during login:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const canAccess = (resource) => {
    if (!user) return false;
    
    switch (resource) {
      case 'create-client':
      case 'create-case':
        return hasAnyRole(['admin', 'lawyer']);
      case 'delete-client':
      case 'delete-case':
        return hasRole('admin');
      case 'upload-document':
        return hasAnyRole(['admin', 'lawyer']);
      case 'view-dashboard':
        return hasAnyRole(['admin', 'lawyer']);
      case 'view-own-cases':
        return hasAnyRole(['admin', 'lawyer', 'client']);
      default:
        return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    hasAnyRole,
    canAccess,
    fetchUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
