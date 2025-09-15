import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaMapMarkerAlt, 
  FaListAlt, 
  FaCheckCircle, 
  FaAward,
  FaCity ,
    FaUser
} from 'react-icons/fa';

const navItems = [
  { path: '/user/dashboard', icon: <FaHome className="text-xl" />, label: 'Dashboard' },
  { path: '/user/report', icon: <FaMapMarkerAlt className="text-xl" />, label: 'Report Issue' },
  { path: '/user/my-Reports', icon: <FaListAlt className="text-xl" />, label: 'My Reports' },
  { path: '/user/verify', icon: <FaCheckCircle className="text-xl" />, label: 'Verifications' },
  { path: '/user/Rewards', icon: <FaAward className="text-xl" />, label: 'Rewards' },
];

const Sidebar = ({ isSidebarOpen, onMenuClick }) => {
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 640;

  // Close sidebar on mobile and navigate
  const handleLinkClick = (e, path) => {
    if (isMobile) {
      e.preventDefault();
      onMenuClick(); // Close sidebar
      setTimeout(() => {
        navigate(path);
      });
    }
  };

  return (
    <motion.aside
      animate={{ width: isSidebarOpen ? '16rem' : '5rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`h-full fixed z-1000 sm:mt-0  
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        sm:translate-x-0
        px-4 py-4 bg-gradient-to-b from-white via-gray-50 to-white text-black font-sans md:flex flex-col overflow-hidden`}
    >
      

      {/* User Profile Summary - Only shown when sidebar is open */}
      {isSidebarOpen && (
        <motion.div 
          className="mb-6 p-3 bg-blue-50 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <FaUser className="text-blue-600 text-sm" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Ankeet Kumar Sah</h3>
              <p className="text-xs text-gray-500">Trust Score: 87%</p>
            </div>
          </div>
        </motion.div>
      )}

      {isSidebarOpen && (
        <motion.p
          className="text-sm text-gray-400 mb-2 pl-3"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3, ease: 'easeInOut' }}
        >
          Menu
        </motion.p>
      )}

      {/* Links */}
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={(e) => handleLinkClick(e, item.path)}
            className={({ isActive }) =>
              `flex items-center ${
                isSidebarOpen ? 'justify-start pl-3' : 'justify-center px-5'
              } gap-3 px-3 py-3 rounded-md transition-all duration-300 font-medium ${
                isActive 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
              }`
            }
          >
            <div className="w-6 h-6 flex items-center justify-center text-xl">
              {item.icon}
            </div>
            {isSidebarOpen && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={ isMobile 
                  ? { duration: 0.2, ease: 'easeInOut', delay: 0.05 * index + 0.3 } 
                  : { duration: 0.2, type: 'spring', stiffness: 200, delay: 0.05 * index + 0.3 } 
                }
                className="origin-left"
              >
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

     
    </motion.aside>
  );
};

Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  onMenuClick: PropTypes.func.isRequired,
};

export default Sidebar;