import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/dashboardLayout';
import { UserContext } from '../../context/userContext';
import { axiosInstance } from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apipath';
import { toast } from 'react-toastify';

const EditProfile = () => {
  const { user, setUserDetails } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // Profile Form State
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        setFullname(parsedUser.fullname || '');
        setUsername(parsedUser.username || '');
        setEmail(parsedUser.email || '');
        if (parsedUser.profileImageUrl) {
          setPreviewImage(parsedUser.profileImageUrl);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be less than 2MB');
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }

      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!fullname.trim()) {
      newErrors.fullname = 'Full Name is required';
    } else if (fullname.trim().length < 2) {
      newErrors.fullname = 'Full Name must be at least 2 characters';
    }

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (username.trim().length > 20) {
      newErrors.username = 'Username must be at most 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors above');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('fullname', fullname.trim());
      formData.append('username', username.trim());
      
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const response = await axiosInstance.put(API_PATH.AUTH.UPDATE_PROFILE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const updatedUser = response.data.user;
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserDetails(updatedUser);
        
        toast.success('Profile updated successfully!');
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const userInitial = (fullname || 'U').charAt(0).toUpperCase();

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-600 mt-2">Update your profile information</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <p className="text-blue-100">Customize your public profile</p>
            </div>

            {/* Content */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-lg overflow-hidden">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        userInitial
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-white text-blue-600 rounded-full p-3 cursor-pointer hover:bg-gray-100 shadow-lg transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={loading}
                      />
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </label>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-700 font-medium">
                      {profileImage ? '✓ ' + profileImage.name : 'Upload a profile picture'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Max 2MB • JPG, PNG, GIF, WebP</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullname}
                      onChange={(e) => {
                        setFullname(e.target.value);
                        if (errors.fullname) setErrors({ ...errors, fullname: '' });
                      }}
                      disabled={loading}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                        errors.fullname ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullname && (
                      <p className="text-red-600 text-sm mt-1">❌ {errors.fullname}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (errors.username) setErrors({ ...errors, username: '' });
                      }}
                      disabled={loading}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                        errors.username ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="Enter your username"
                    />
                    {errors.username && (
                      <p className="text-red-600 text-sm mt-1">❌ {errors.username}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                      placeholder="Email cannot be changed"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      🔒 Email address cannot be changed for security reasons
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    disabled={loading}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 text-white font-semibold rounded-lg transition-all"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditProfile;