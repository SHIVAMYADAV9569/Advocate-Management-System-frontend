import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

const RoleBasedNavigation = () => {
  const { user, hasRole, canAccess, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '📊',
      roles: ['admin', 'lawyer']
    },
    {
      path: '/clients',
      label: 'Clients',
      icon: '👥',
      roles: ['admin', 'lawyer']
    },
    {
      path: '/cases',
      label: 'Cases',
      icon: '📁',
      roles: ['admin', 'lawyer', 'client']
    },
    {
      path: '/my-cases',
      label: 'My Cases',
      icon: '⚖️',
      roles: ['client']
    },
    {
      path: '/hearings',
      label: 'Hearings',
      icon: '📅',
      roles: ['admin', 'lawyer']
    },
    {
      path: '/my-hearings',
      label: 'My Hearings',
      icon: '🗓️',
      roles: ['client']
    },
    {
      path: '/payments',
      label: 'Payments',
      icon: '💳',
      roles: ['admin', 'lawyer']
    },
    {
      path: '/my-payments',
      label: 'My Payments',
      icon: '💰',
      roles: ['client']
    },
    {
      path: '/documents',
      label: 'Documents',
      icon: '📄',
      roles: ['admin', 'lawyer', 'client']
    },
    {
      path: '/calendar',
      label: 'Calendar',
      icon: '📆',
      roles: ['admin', 'lawyer']
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: '⚙️',
      roles: ['admin', 'lawyer', 'client']
    },
    {
      path: '/status-management',
      label: 'Status Management',
      icon: '📊',
      roles: ['admin', 'lawyer']
    }
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role)
  );

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Advocate System</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive(item.path)
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Role:</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                hasRole('admin') ? 'bg-purple-100 text-purple-800' :
                hasRole('lawyer') ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Welcome,</span>
              <span className="text-sm font-medium text-gray-900">{user.name}</span>
            </div>
            
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive(item.path)
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default RoleBasedNavigation;
