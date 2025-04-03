import React from 'react';
import { useLocation, Link } from 'react-router-dom';
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

const Homeleft = () => {
  const location = useLocation(); // Get the current route

  const isActive = (path) => location.pathname === path; // Check if the route matches

  const handleLogout = () => {
    // Clear the token from localStorage or sessionStorage
    localStorage.removeItem('token');

    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <>
      {/* Desktop Sidebar (fixed width on medium screens) */}
      <div className="hidden md:block w-[20%] h-full bg-gray-100 space-y-4 p-4">
        <Link
          to="/dashboard"
          className={`flex items-center gap-4 justify-start w-full px-4 md:px-6 lg:px-10 rounded-full py-4 cursor-pointer ${
            isActive('/dashboard') ? 'bg-sky-300 text-white' : 'hover:bg-sky-300 hover:text-white'
          }`}
        >
          <MdOutlineDashboard className="min-w-[20px] md:text-lg lg:text-xl flex-shrink-0" />
          <span className="md:text-sm lg:text-base whitespace-nowrap flex items-center">Dashboard</span>
        </Link>

        <Link
          to="/bookmark"
          className={`flex items-center gap-4 justify-start w-full px-4 md:px-6 lg:px-10 rounded-full py-4 cursor-pointer ${
            isActive('/bookmark') ? 'bg-sky-300 text-white' : 'hover:bg-sky-300 hover:text-white'
          }`}
        >
          <FaRegBookmark className="min-w-[20px] md:text-lg lg:text-xl flex-shrink-0" />
          <span className="md:text-sm lg:text-base whitespace-nowrap flex items-center">Bookmark</span>
        </Link>

        <Link
          to="/create-poll"
          className={`flex items-center gap-4 justify-start w-full px-4 md:px-6 lg:px-10 rounded-full py-4 cursor-pointer ${
            isActive('/create-poll') ? 'bg-sky-300 text-white' : 'hover:bg-sky-300 hover:text-white'
          }`}
        >
          <IoCreate className="min-w-[20px] md:text-lg lg:text-xl flex-shrink-0" />
          <span className="md:text-sm lg:text-base whitespace-nowrap flex items-center">Create Poll</span>
        </Link>

        <Link
          to="/voted-polls"
          className={`flex items-center gap-4 justify-start w-full px-4 md:px-6 lg:px-10 rounded-full py-4 cursor-pointer ${
            isActive('/voted-polls') ? 'bg-sky-300 text-white' : 'hover:bg-sky-300 hover:text-white'
          }`}
        >
          <FaRegCheckCircle className="min-w-[20px] md:text-lg lg:text-xl flex-shrink-0" />
          <span className="md:text-sm lg:text-base whitespace-nowrap flex items-center">Voted Polls</span>
        </Link>

        <Link
          to="/mypolls"
          className={`flex items-center gap-4 justify-start w-full px-4 md:px-6 lg:px-10 rounded-full py-4 cursor-pointer ${
            isActive('/mypolls') ? 'bg-sky-300 text-white' : 'hover:bg-sky-300 hover:text-white'
          }`}
        >
          <FaBookOpen className="min-w-[20px] md:text-lg lg:text-xl flex-shrink-0" />
          <span className="md:text-sm lg:text-base whitespace-nowrap flex items-center">My Polls</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 justify-start w-full px-4 md:px-6 lg:px-10 rounded-full py-4 cursor-pointer hover:bg-sky-300 hover:text-white"
        >
          <FiLogOut className="min-w-[20px] md:text-lg lg:text-xl flex-shrink-0" />
          <span className="md:text-sm lg:text-base whitespace-nowrap flex items-center">Logout</span>
        </button>
      </div>
    </>
  );
};

export default Homeleft;