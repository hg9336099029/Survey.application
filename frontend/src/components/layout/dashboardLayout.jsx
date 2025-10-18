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
      <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl flex flex-col border-r border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">PollHub</h1>
              <p className="text-xs text-gray-400">Analytics</p>
            </div>
          </div>
        </div>

        <nav className="mt-8 flex-1 px-4 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            to="/home"
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2c0 1.1-.9 2-2 2s2 .9 2 2v2a2 2 0 002 2h5l-1.293-1.293a1 1 0 011.414-1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 00-1.414 1.414L10 5H5z" />
            </svg>
            <span className="font-medium">Explore</span>
          </Link>

          <Link
            to="/create-poll"
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 rounded-lg transition-all duration-200 group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Create Poll</span>
          </Link>

          <Link
            to="/my-polls"
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
            </svg>
            <span className="font-medium">My Polls</span>
          </Link>

          <Link
            to="/voted-polls"
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Voted Polls</span>
          </Link>

          <Link
            to="/bookmarks"
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            <span className="font-medium">Bookmarks</span>
          </Link>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 mb-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-sm">Settings</span>
          </Link>
          <p className="text-xs text-gray-500 text-center py-2">
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
                  <Link to="/edit-profile" className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors block">
                    👤 Edit Profile
                  </Link>
                  <Link to="/settings" className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors block">
                    🔐 Change Password
                  </Link>
                  <Link to="/settings" className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors block">
                    ⚙️ Settings
                  </Link>
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