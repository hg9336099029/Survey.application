import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Authlayout from "../../components/layout/Authlayout";
import { axiosInstance } from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apipath";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUpForm = () => {
  const navigate = useNavigate();
  const [fullname, setfullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!fullname.trim()) {
      newErrors.fullname = "Full Name is required";
      setErrors(newErrors);
      return false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      setErrors(newErrors);
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
      setErrors(newErrors);
      return false;
    }

    if (!username.trim()) {
      newErrors.username = "Username is required";
      setErrors(newErrors);
      return false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      setErrors(newErrors);
      return false;
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData();
      formData.append("fullname", fullname);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (profileImage) {
        formData.append("profileImage", profileImage.file);
      }

      try {
        const response = await axiosInstance.post(API_PATH.AUTH.REGISTER, formData);
        if (response.status === 201) {
          localStorage.setItem("accessToken", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          navigate("/dashboard");
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage({
        preview: URL.createObjectURL(file),
        file: file
      });
    }
  };

  return (
    <Authlayout>
      <div className="w-full max-w-md mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] w-full"
        >
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Create an Account</h2>
          </div>

          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                {profileImage ? (
                  <img
                    src={profileImage.preview}
                    alt="profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <svg className="w-8 h-8 text-blue-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1.5 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3v14M3 10h14" strokeWidth="2" stroke="currentColor" />
                </svg>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setfullname(e.target.value)}
                className={`w-full p-2 bg-gray-50 rounded text-sm ${errors.fullname ? "border border-red-500" : ""}`}
                placeholder="John"
              />
              {errors.fullname && (
                <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-2 bg-gray-50 rounded text-sm ${errors.email ? "border border-red-500" : ""}`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full p-2 bg-gray-50 rounded text-sm ${errors.username ? "border border-red-500" : ""}`}
                placeholder="@"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-2 bg-gray-50 rounded text-sm ${errors.password ? "border border-red-500" : ""}`}
                placeholder="Min 8 Characters"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition-colors mt-2"
          >
            Create Account
          </button>

          <p className="text-center text-xs text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-semibold hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
      <ToastContainer />
    </Authlayout>
  );
};

export default SignUpForm;
