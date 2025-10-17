import React, { useEffect, useState } from 'react'
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Validate token on app load
    const validateToken = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        } else {
          // Validate token is not expired
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          if (tokenData.exp * 1000 < Date.now()) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
          />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp />} />
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
            path="/voted-polls" 
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
  )
}

export default App;