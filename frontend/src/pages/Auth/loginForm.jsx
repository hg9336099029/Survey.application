import React, { useState, useContext } from "react";
import Authlayout from "../../components/layout/Authlayout";
import { axiosInstance } from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apipath";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUserDetails } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter email");
      return;
    }
    if (!password) {
      setError("Please enter password");
      return;
    }
    setError("");
    try {
      const response = await axiosInstance.post(API_PATH.AUTH.LOGIN, { email, password });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUserDetails(user);
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
        setError(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <Authlayout>
      <div className="w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] w-full">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-1">Welcome Back</h2>
            <p className="text-gray-600 text-xs">Please enter your details to login</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 bg-gray-50 rounded text-sm"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 bg-gray-50 rounded text-sm"
                placeholder="Min 8 Characters"
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors mt-6"
          >
            Login
          </button>

          <p className="text-center text-xs text-gray-600 mt-4">
            Not registered?{" "}
            <a href="/signup" className="text-blue-600 font-semibold hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </Authlayout>
  );
};

export default Login;
