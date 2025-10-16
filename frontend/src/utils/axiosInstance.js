import axios from 'axios';
import { API_PATH } from './apipath';

// ===================
// Default axios instance
// ===================
export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000'|| "https://survey-application-44on.onrender.com", // or your backend URL
    timeout: 10000, // Increase timeout to 5000ms (5 seconds)
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// Request interceptor to attach access token if exists
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                console.log("Unauthorized: Redirecting to login...");
                window.location.href = "/login";
            } else if (error.response.status === 500) {
                console.log("Server error. Please try again later");
            } else {
                console.log("An unexpected error occurred");
            }
        }
        return Promise.reject(error);
    }
);

// ===================
// Axios instance for creating polls
// ===================
export const axioscreatepoll = axios.create({
    baseURL: 'http://localhost:8000'|| 
'https://survey-application-44on.onrender.com', // or your backend URL
    timeout: 5000, // Increase timeout to 5000ms (5 seconds)
    headers: {
        "Content-Type": "multipart/form-data",
        "Accept": "application/json",
    },
});

// Request interceptor for axioscreatepoll to attach token
axioscreatepoll.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for axioscreatepoll
axioscreatepoll.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                console.log("Unauthorized:", error);
            } else if (error.response.status === 500) {
                console.log("Server error. Please try again later");
            } else {
                console.log("An unexpected error occurred");
            }
        }
        return Promise.reject(error);
    }
);

export { API_PATH };
