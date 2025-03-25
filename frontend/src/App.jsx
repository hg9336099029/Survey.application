import React from 'react'
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
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <div>
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard"/> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/dashboard" exact element={<Home/>} />
          <Route path="/bookmark" exact element={<Bookmark />} />
          <Route path="/create-poll" exact element={<CreatePoll/>} />
          <Route path="/Voted-polls" exact element={<VotedPolls/>} />
          <Route path="/mypolls" exact element={<Mypolls/>}/>
        </Routes>
      </Router>
    </UserProvider>
    </div>
  )
}

export default App;