import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { axiosInstance } from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apipath';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './dashboardLayout.css';

export const DashboardLayout = ({ children }) => {
  const { user, clearUserDetails } = useContext(UserContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Get user from localStorage or context
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      // Call logout endpoint
      await axiosInstance.post(API_PATH.AUTH.LOGOUT);
      
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      // Clear user context
      clearUserDetails();
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Redirect to login
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      
      // Still clear local storage and redirect even if API call fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      clearUserDetails();
      toast.error('Logout failed, but cleared local data');
      navigate('/login', { replace: true });
    } finally {
      setIsMenuOpen(false);
    }
  };

  const displayName = userData?.username || user?.username || 'User';
  const displayEmail = userData?.email || user?.email || 'user@example.com';
  const displayFullname = userData?.fullname || user?.fullname || 'User';
  const userInitial = displayName?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">PollHub</h1>
          <p className="text-xs text-gray-500 mt-1">Polling Platform</p>
        </div>

        <nav className="mt-6 flex-1">
          <Link
            to="/dashboard"
            className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-l-4 border-transparent hover:border-blue-600"
          >
            🏠 Home
          </Link>
          <Link
            to="/create-poll"
            className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-l-4 border-transparent hover:border-blue-600"
          >
            ➕ Create Poll
          </Link>
          <Link
            to="/my-polls"
            className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-l-4 border-transparent hover:border-blue-600"
          >
            📋 My Polls
          </Link>
          <Link
            to="/voted-polls"
            className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-l-4 border-transparent hover:border-blue-600"
          >
            ✅ Voted Polls
          </Link>
          <Link
            to="/bookmarks"
            className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-l-4 border-transparent hover:border-blue-600"
          >
            🔖 Bookmarks
          </Link>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            Logged in as <strong>{displayName}</strong>
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
            <p className="text-sm text-gray-500">Welcome to PollHub</p>
          </div>
        </div>

        {/* Main Content + Right Sidebar Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Page Content */}
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>

          {/* Right Sidebar - Permanent Profile Section */}
          <div className="w-80 bg-white shadow-lg flex flex-col border-l border-gray-200">
            {/* Profile Header */}
            <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                  {userInitial}
                </div>
                <h3 className="text-xl font-semibold">{displayName}</h3>
                <p className="text-sm text-blue-100 mt-1">{displayFullname}</p>
              </div>
            </div>

            {/* Profile Information */}
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* Account Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Account Information</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Email Address</p>
                    <p className="text-sm text-gray-800 mt-1 break-words">{displayEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Username</p>
                    <p className="text-sm text-gray-800 mt-1">@{displayName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Full Name</p>
                    <p className="text-sm text-gray-800 mt-1">{displayFullname}</p>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Quick Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-700">Profile Status</span>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-700">Account Type</span>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">User</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors">
                    👤 Edit Profile
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors">
                    🔐 Change Password
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors">
                    ⚙️ Settings
                  </button>
                </div>
              </div>

              {/* Account Stats */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Account Created</h4>
                <p className="text-xs text-gray-700">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                🚪 Logout
              </button>
              <p className="text-xs text-gray-600 text-center mt-3">
                Click logout to end your session
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};