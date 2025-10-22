import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import api from "../../api/axios";
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
  FaSignOutAlt,
} from "react-icons/fa";
import useAuthStore from "../../store/useAuthStore";
import useAdminStore from "../../store/useAdminStore";

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
  const location = useLocation();
  const isMobile = window.innerWidth < 640;
  const user = useAuthStore((state) => state.user);
  const admin = useAdminStore((state) => state.admin);
  const clearUser = useAuthStore((state) => state.clearUser);
  const clearAdmin = useAdminStore((state) => state.clearAdmin);
  const [loggingOut, setLoggingOut] = useState(false);
  
  console.log(admin);
  const prefix = location.pathname.split("/")[1];
  
  // Determine which nav items to use based on user role
  const navItems = prefix === 'admin' ? adminNavItems : userNavItems;
  const isAdminRoute = prefix === 'admin';

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

  const handleLogout = async () => {
    setLoggingOut(true);
    
    try {
      const response = await api.get("/admin/logout", {
        withCredentials: true,
      });

      console.log(response.data?.message || "Logged out successfully");
      
      // Clear stores
      clearUser();
      clearAdmin();
      
      navigate("/admin-login");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      
      // Clear stores even on error to ensure clean state
      clearUser();
      clearAdmin();
      
      navigate("/");
    } finally {
      setLoggingOut(false);
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
                src={user?.picture || admin?.picture || "/default-avatar.png"}
                className="w-full h-full object-cover rounded-full"
                alt="User avatar"
              />
            </div>

            <div>
              <h3 className="font-bbh text-sm text-blue-100 drop-shadow-[0_0_5px_#3b82f6]">
                {user?.name || admin?.name || "User"}
              </h3>
              <p className="text-xs font-iceberg text-blue-200">
                {isAdminRoute ? "Administrator" : (user?.role || "User")}
              </p>
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

        {/* Logout Button - Only show for admin routes */}
        {isAdminRoute && (
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className={`group flex items-center gap-3 rounded-md transition-all my-2 duration-300 relative w-full
              ${isSidebarOpen ? "pl-3 pr-2 py-3" : "justify-center py-3"} 
              ${loggingOut 
                ? "text-yellow-400 border border-yellow-500/70 shadow-[0_0_12px_#f59e0b55] cursor-not-allowed" 
                : "text-red-100 hover:text-red-400 hover:border hover:border-red-500/70 hover:shadow-[0_0_12px_#ef444455]"
              }
              border border-transparent`}
          >
            <div className="text-xl flex items-center justify-center w-6 h-6">
              {loggingOut ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"
                />
              ) : (
                <FaSignOutAlt />
              )}
            </div>

            {isSidebarOpen && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.3,
                  type: "spring",
                  stiffness: 200,
                  delay: 0.05 * (navItems.length) + 0.2,
                }}
                className="origin-left"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </motion.span>
            )}
          </button>
        )}
      </nav>

      {/* Footer with user info when sidebar is collapsed */}
      {!isSidebarOpen && (
        <div className="mt-auto py-4 border-t border-blue-800/50">
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-blue-400 
                          bg-blue-900 flex items-center justify-center overflow-hidden shadow-[0_0_8px_#3b82f6]">
              <img
                src={user?.picture || admin?.picture || "/default-avatar.png"}
                className="w-full h-full object-cover rounded-full"
                alt="User avatar"
              />
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  );
};

Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  onMenuClick: PropTypes.func.isRequired,
};

export default Sidebar;