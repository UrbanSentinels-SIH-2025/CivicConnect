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
  FaCity,
  FaUser,
  FaUsers,
  FaChartBar,
  FaCog,
  FaClipboardList,
  FaBuilding,
  FaExclamationTriangle
} from 'react-icons/fa';

const adminNavItems = [
  { path: '/admin/dashboard', icon: <FaHome className="text-xl" />, label: 'Dashboard' },
  { path: '/admin/issues', icon: <FaExclamationTriangle className="text-xl" />, label: 'All Issues' },
  { path: '/admin/departments', icon: <FaBuilding className="text-xl" />, label: 'Departments' },
  { path: '/admin/analytics', icon: <FaChartBar className="text-xl" />, label: 'Analytics' },
  { path: '/admin/user-management', icon: <FaChartBar className="text-xl" />, label: 'User Management' },
  { path: '/admin/street', icon: <FaChartBar className="text-xl" />, label: 'Street Department' },
];

const AdminSidebar = ({ isSidebarOpen, onMenuClick }) => {
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
        px-4 py-4 bg-white text-gray-800 font-sans md:flex flex-col overflow-hidden shadow-sm border-r border-gray-200`}
    >
      
      {/* Admin Header - Only shown when sidebar is open */}
      {isSidebarOpen && (
        <motion.div 
          className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              <FaUser className="text-gray-600 text-sm" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Admin Panel</h3>
              <p className="text-xs text-gray-500">Municipal Corporation</p>
            </div>
          </div>
        </motion.div>
      )}

      {isSidebarOpen && (
        <motion.p
          className="text-sm text-gray-500 mb-2 pl-3 font-medium"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3, ease: 'easeInOut' }}
        >
          Administration
        </motion.p>
      )}

      {/* Links */}
      <nav className="flex-1 px-2 space-y-1">
        {adminNavItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={(e) => handleLinkClick(e, item.path)}
            className={({ isActive }) =>
              `flex items-center ${
                isSidebarOpen ? 'justify-start pl-3' : 'justify-center px-5'
              } gap-3 px-3 py-3 rounded-md transition-all duration-300 font-medium ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                  : 'text-gray-600 hover:bg-blue-100 hover:text-blue-500'
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

      {/* Footer - Only shown when sidebar is open */}
      {isSidebarOpen && (
        <motion.div 
          className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>CivicConnect Admin</p>
          <p className="mt-1">v1.0.0</p>
        </motion.div>
      )}
    </motion.aside>
  );
};

AdminSidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  onMenuClick: PropTypes.func.isRequired,
};

export default AdminSidebar;