import React, { useState } from 'react';
import { FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { FaRegMoon } from "react-icons/fa";
import { motion } from 'framer-motion';
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { FaCity } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
const Topbar = ({ onMenuClick, isSidebarOpen,name }) => {
  const [notificationCount, setNotificationCount] = useState(3);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();






  return (
    <header className="w-full fixed h-16 z-1000 bg-[#03091f]  flex items-center justify-between px-4 sm:px-6 shadow-sm py-9">
      
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
            {name}
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