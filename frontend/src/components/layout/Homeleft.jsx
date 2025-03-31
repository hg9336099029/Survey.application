import React from 'react'
import {
  MdOutlineDashboard,
} from "react-icons/md";
import {
  IoCreate,
} from "react-icons/io5";
import {
  FaRegBookmark,
  FaRegCheckCircle,
  FaBookOpen,
} from "react-icons/fa";
import {
  FiLogOut,
} from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';
import { API_PATH } from '../../utils/apipath';
import axios from 'axios';

const Homeleft = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint
      await axios.post(API_PATH.AUTH.LOGOUT, {}, { withCredentials: true });

      // Clear the token from local storage
      localStorage.removeItem('token');

      // Redirect to the login page
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      {/* Desktop Sidebar (fixed width on medium screens) */}
      <div className='hidden md:block w-[20%] h-full bg-gray-100'>
        <Link to="/dashboard" className="flex items-center gap-4 justify-start w-full px-4 md:px-6 lg:px-10 hover:bg-sky-300 hover:text-white rounded-full py-4 cursor-pointer">
          <MdOutlineDashboard className="min-w-[20px] md:text-lg lg:text-xl flex-shrink-0" />
          <span className="md:text-sm lg:text-base whitespace-nowrap flex items-center">Dashboard</span>
        </Link>

        <Link to="/bookmark" className="flex items-center gap-4 justify-start w-full px-4 md:px-6 lg:px-10 hover:bg-sky-300 hover:text-white rounded-full py-4 cursor-pointer">
          <FaRegBookmark className="min-w-[20px] md:text-lg lg:text-xl flex-shrink-0" />
          <span className="md:text-sm lg:text-base whitespace-nowrap flex items-center">Bookmark</span>
        </Link>

        <Link to="/create-poll" className="flex items-center gap-4 justify-start w-full px-4 md:px-6 lg:px-10 hover:bg-sky-300 hover:text-white rounded-full py-4 cursor-pointer">
          <IoCreate className="min-w-[20px] md:text-lg lg:text-xl flex-shrink-0" />
          <span className="md:text-sm lg:text-base whitespace-nowrap flex items-center">Create Poll</span>
        </Link>

        <Link to="/voted-polls" className="flex items-center gap-4 justify-start w-full px-4 md:px-6 lg:px-10 hover:bg-sky-300 hover:text-white rounded-full py-4 cursor-pointer">
          <FaRegCheckCircle className="min-w-[20px] md:text-lg lg:text-xl flex-shrink-0" />
          <span className="md:text-sm lg:text-base whitespace-nowrap flex items-center">Voted Polls</span>
        </Link>

        <Link to="/mypolls" className="flex items-center gap-4 justify-start w-full px-4 md:px-6 lg:px-10 hover:bg-sky-300 hover:text-white rounded-full py-4 cursor-pointer">
          <FaBookOpen className="min-w-[20px] md:text-lg lg:text-xl flex-shrink-0" />
          <span className="md:text-sm lg:text-base whitespace-nowrap flex items-center">My Polls</span>
        </Link>

        <Link to="#" onClick={handleLogout} className="flex items-center gap-4 justify-start w-full px-4 md:px-6 lg:px-10 hover:bg-sky-300 hover:text-white rounded-full py-4 cursor-pointer">
          <FiLogOut className="min-w-[20px] md:text-lg lg:text-xl flex-shrink-0" />
          <span className="md:text-sm lg:text-base whitespace-nowrap flex items-center">Logout</span>
        </Link>
      </div>

      {/* Mobile Navbar Button */}
      <div className="md:hidden flex justify-content items-center fixed top-0 left-0 w-full bg-gray-100 p-2 z-50">
        <details className="dropdown boredr-black">
          <summary className="btn btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </summary>

          <ul className="p-2 shadow-lg menu dropdown-content z-[1] bg-base-100 rounded-box w-52 fixed mt-2 rounded-lg bg-gray-100">
            <li><Link to="/dashboard" className="flex items-center gap-2 p-2 hover:bg-sky-300 hover:text-white rounded-full"><MdOutlineDashboard className="min-w-[20px]" /> Dashboard</Link></li>
            <li><Link to="/bookmarks" className="flex items-center gap-2 p-2 hover:bg-sky-300 hover:text-white rounded-full"><FaRegBookmark className="min-w-[20px]" /> Bookmark</Link></li>
            <li><Link to="/create-poll" className="flex items-center gap-2 p-2 hover:bg-sky-300 hover:text-white rounded-full"><IoCreate className="min-w-[20px]" /> Create Poll</Link></li>
            <li><Link to="/voted-polls" className="flex items-center gap-2 p-2 hover:bg-sky-300 hover:text-white rounded-full"><FaRegCheckCircle className="min-w-[20px]" /> Voted Polls</Link></li>
            <li><Link to="/mypolls" className="flex items-center gap-2 p-2 hover:bg-sky-300 hover:text-white rounded-full"><FaBookOpen className="min-w-[20px]" /> My Polls</Link></li>
            <li><Link to="#" onClick={handleLogout} className="flex items-center gap-2 p-2 hover:bg-sky-300 hover:text-white rounded-full"><FiLogOut className="min-w-[20px]" /> Logout</Link></li>
          </ul>

        </details>

        <span className='left -2 mt-4 text-2xl font-bold'>Polling App</span>
      </div>
    </>
  )
}

export default Homeleft