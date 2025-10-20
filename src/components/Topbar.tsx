import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Bell, Search } from 'lucide-react';
import { SERVER_CONFIG } from '../api/config';

interface TopbarProps {
  onLogout: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Call logout API
      await fetch(SERVER_CONFIG.BASE_URL+'/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      
      // Notify parent component
      onLogout();
      
      // Redirect to login
      navigate('/login');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-900 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user.role || 'Admin'}</p>
            </div>
            
            <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-indigo-600" />
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;