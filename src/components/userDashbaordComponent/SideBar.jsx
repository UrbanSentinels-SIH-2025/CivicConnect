import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  FaHome,
  FaMapMarkerAlt,
  FaListAlt,
  FaCheckCircle,
  FaAward,
  FaCog,
  FaExclamationTriangle,
  FaBuilding,
  FaChartBar,
} from "react-icons/fa";
import useAuthStore from "../../store/useAuthStore";

const userNavItems = [
  { path: "/user/dashboard", icon: <FaHome />, label: "Dashboard" },
  { path: "/user/report", icon: <FaMapMarkerAlt />, label: "Report Issue" },
  { path: "/user/my-issues", icon: <FaListAlt />, label: "Track Issue" },
  { path: "/user/community-reports", icon: <FaCheckCircle />, label: "Verifications" },
  { path: "/user/rewards", icon: <FaAward />, label: "Rewards" },
  { path: "/user/Settings", icon: <FaCog />, label: "Settings" },
];

const adminNavItems = [
  { path: '/admin/dashboard', icon: <FaHome />, label: 'Dashboard' },
  { path: '/admin/issues', icon: <FaExclamationTriangle />, label: 'All Issues' },
  { path: '/admin/departments', icon: <FaBuilding />, label: 'Departments' },
  { path: '/admin/analytics', icon: <FaChartBar />, label: 'Analytics' },
  { path: '/admin/user-management', icon: <FaChartBar />, label: 'User Management' },
];

const Sidebar = ({ isSidebarOpen, onMenuClick }) => {
  const navigate = useNavigate();
  const location=useLocation()
  const isMobile = window.innerWidth < 640;
  const user = useAuthStore((state) => state.user);
  const prefix=location.pathname.split("/")[1]
  // Determine which nav items to use based on user role
  const navItems = prefix === 'admin' ? adminNavItems : userNavItems;

  useEffect(() => {
    onMenuClick();
  }, []);

  const handleLinkClick = (e, path) => {
    if (isMobile) {
      e.preventDefault();
      onMenuClick();
      setTimeout(() => {
        navigate(path);
      });
    }
  };

  return (
    <motion.aside
      animate={{ width: isSidebarOpen ? "16rem" : "5rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`h-full fixed z-50 sm:mt-0 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        sm:translate-x-0
        px-4 py-4 bg-[#03091f] text-white font-sans md:flex flex-col overflow-hidden shadow-[0_0_15px_#1e40af55]`}
    >
      {/* User Profile Summary */}
      {isSidebarOpen && (
        <motion.div
          className="mb-6 p-3 rounded-lg border-2 border-blue-500 
                    bg-blue-950/40 relative overflow-hidden
                    before:absolute before:inset-0 before:rounded-lg
                    before:border-2 before:border-blue-500 
                    before:blur-[8px] before:opacity-70
                    transition-all duration-500 ease-in-out"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full border-2 border-blue-400 
                            bg-blue-900 flex items-center justify-center mr-3 overflow-hidden shadow-[0_0_8px_#3b82f6]">
              <img
                src={user?.picture}
                className="w-full h-full object-cover rounded-full"
                alt="User avatar"
              />
            </div>

            <div>
              <h3 className="font-bbh text-sm text-blue-100 drop-shadow-[0_0_5px_#3b82f6]">
                {user?.name}
              </h3>
              <p className="text-xs text-blue-200">{user?.role}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Menu label */}
      {isSidebarOpen && (
        <motion.p
          className="text-sm text-gray-400 mb-2 pl-3 tracking-wide"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3, ease: "easeInOut" }}
        >
          Menu
        </motion.p>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 px-2 font-bbh space-y-1">
        {navItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={(e) => handleLinkClick(e, item.path)}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-md transition-all my-2 duration-300 relative
              ${isSidebarOpen ? "pl-3 pr-2 py-3" : "justify-center py-3"} 
              ${
                isActive
                  ? "border border-blue-500 text-blue-300 bg-blue-950/40 shadow-[0_0_10px_#3b82f6aa]"
                  : "text-blue-100 hover:text-blue-400 hover:border hover:border-blue-500/70 hover:shadow-[0_0_12px_#3b82f655]"
              }`
            }
          >
            <div className="text-xl flex items-center justify-center w-6 h-6">
              {item.icon}
            </div>

            {isSidebarOpen && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.3,
                  type: "spring",
                  stiffness: 200,
                  delay: 0.05 * index + 0.2,
                }}
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