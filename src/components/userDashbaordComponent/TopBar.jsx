import React, { useState } from 'react';
import { FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { FaRegMoon } from "react-icons/fa";
import { motion } from 'framer-motion';
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { FaCity } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
const Topbar = ({ onMenuClick, isSidebarOpen }) => {
  const [notificationCount, setNotificationCount] = useState(3);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

const handleLogout = async () => {
  setIsLoggingOut(true);
  try {
    // Call the backend logout endpoint via axios instance
    const response = await api.get("/auth/logout", {
      withCredentials: true, // ensures cookies are sent
    });

    console.log(response.data?.message || "Logged out successfully");


    // Redirect to login page
    navigate("/");
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);

    navigate("/");
  } finally {
    setIsLoggingOut(false);
    setShowLogoutConfirm(false);
  }
};




  return (
    <header className="w-full fixed h-16 z-1000 bg-[#0a1045] border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shadow-sm py-9">
      
      {/* Left side: Logo & Menu */}
      <div className="flex items-center gap-4">
        {/* Hamburger Menu */}
        <button
          className="group relative hidden md:block text-[#CBEFF1]  hover:text-blue-600 transition p-2 rounded-lg hover:bg-blue-50"
          onClick={onMenuClick}   
        >
          {isSidebarOpen ? <TbLayoutSidebarLeftCollapse className="text-2xl" /> : <TbLayoutSidebarRightCollapse className="text-2xl" />}
          
          <div className="absolute inset-0 bg-blue-500/20 rounded-lg scale-0 group-hover:scale-100 transition duration-300 -z-10"></div>
        </button>

        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg"
          >
            <FaCity className="text-white text-lg sm:text-xl" />
          </motion.div>
          <h1 className="text-lg sm:text-xl  text-[#CBEFF1] font-bbh">
            <span className="hidden md:inline">CivicConnect </span>
            Citizen Dashboard
          </h1>
        </div>
      </div>

      {/* Right side: Controls */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notification Bell */}
        <div className="relative group">
          <button
            onClick={() => setNotificationCount(Math.max(0, notificationCount - 1))}
            className="relative text-gray-900 hover:text-blue-500 p-2 rounded-lg transition hover:bg-blue-50"
          >
            <FaBell className="text-xl text-[#CBEFF1]  group-hover:animate-pulse" />
            <div className="absolute inset-0 bg-blue-400/20 rounded-lg scale-0 group-hover:scale-100 transition duration-300 -z-10"></div>
          </button>
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium shadow">
              {notificationCount}
            </span>
          )}
        </div>

        {/* Logout Button */}
        <div className="relative group">
          
          
          {/* Logout Confirmation Dialog */}
          {showLogoutConfirm && (
            <div className="absolute right-0 top-12 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-10 w-48">
              <p className="text-sm text-gray-700 mb-3">Are you sure you want to logout?</p>
              <div className="flex justify-between">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  disabled={isLoggingOut}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Logout'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        
        
        {/* Mobile menu button */}
        <button
          className="group relative block md:hidden text-[#CBEFF1]  hover:text-blue-600 transition p-2 rounded-lg hover:bg-blue-50"
          onClick={onMenuClick}   
        >
          {isSidebarOpen ? <TbLayoutSidebarLeftCollapse className="text-2xl" /> : <TbLayoutSidebarRightCollapse className="text-2xl" />}
          
          <div className="absolute inset-0 bg-blue-500/20 rounded-lg scale-0 group-hover:scale-100 transition duration-300 -z-10"></div>
        </button>
      </div>
      
    </header>
  );
};

export default Topbar;