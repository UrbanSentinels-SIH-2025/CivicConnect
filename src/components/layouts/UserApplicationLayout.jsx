import React, { useState, useCallback, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../userDashbaordComponent/SideBar";
import Topbar from "../userDashbaordComponent/TopBar";
import api from "../../api/axios"; // your axios instance

export default function UserApplicationLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [user, setUser] = useState(null);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  // Auto-adjust sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Disable body scroll on mobile when sidebar is open
  useEffect(() => {
    if (window.innerWidth < 768) {
      document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  // Fetch user and handle first-time location
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/auth/me", { withCredentials: true });
        setUser(data.user);

        // If first-time login or location not set, request geolocation
        if (data.user.firstTime && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              await api.patch("/user-issue/set-location", {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              });
              setUser((prev) => ({ ...prev, firstTime: false }));
            },
            (err) => console.error("Geolocation error:", err)
          );
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100 overflow-hidden relative">
      {/* Top Navigation Bar */}
      <Topbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex flex-1 pt-18 overflow-hidden">
        {/* Sidebar */}
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
