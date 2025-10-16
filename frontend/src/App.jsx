import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import UserProvider from './context/userContext';
import Mypolls from './pages/Dashboard/Mypolls';
import Bookmark from './pages/Dashboard/Bookmark';
import CreatePoll from './pages/Dashboard/CreatePoll';
import Home from './pages/Dashboard/Home';
import Login from './pages/Auth/loginForm';
import SignUp from './pages/Auth/SignUpForm';
import VotedPolls from './pages/Dashboard/VotedPolls';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('accessToken');

  useEffect(() => {
    // Check if token exists and is valid
    const token = localStorage.getItem('accessToken');
    if (!token) {
      localStorage.removeItem('user');
    }
  }, []);

  return (
    <div>
      <UserProvider>
        <Router>
          <Routes>
            <Route 
              path="/" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Home /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/bookmark" 
              element={isAuthenticated ? <Bookmark /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/create-poll" 
              element={isAuthenticated ? <CreatePoll /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/Voted-polls" 
              element={isAuthenticated ? <VotedPolls /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/mypolls" 
              element={isAuthenticated ? <Mypolls /> : <Navigate to="/login" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </UserProvider>
    </div>
  )
}

export default App;