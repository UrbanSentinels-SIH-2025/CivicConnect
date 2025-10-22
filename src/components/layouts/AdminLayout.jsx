import React, { useState, useCallback, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Topbar from "../userDashbaordComponent/TopBar";
import Sidebar from "../userDashbaordComponent/SideBar";
export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  // Disable body scroll when sidebar is open (on mobile)
  useEffect(() => {
    if (window.innerWidth < 768) { // only on mobile/tablet
      document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
    }
    return () => {
      document.body.style.overflow = "auto"; // reset on unmount
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100 overflow-hidden relative">
      {/* Top Navigation Bar */}
       <Topbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} name={" Admin Dashboard"} />

      <div className="flex flex-1 pt-18 overflow-hidden">
         <Sidebar isSidebarOpen={isSidebarOpen} onMenuClick={toggleSidebar} />
        
        {/* Glassmorphism Overlay (mobile only) */}
        {isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          ></div>
        )}

       <main
                 className={`flex-grow max-w-full transition-all duration-300 ease-in-out bg-gradient-to-br from-[#D9F3FF] via-[#EAF9FB] to-[#CBEFF1] ${
                   isSidebarOpen ? "md:ml-64" : "md:ml-20"
                 }  overflow-x-hidden`}
               >
                 <Outlet />
               </main>
      </div>
    </div>
  );
}
