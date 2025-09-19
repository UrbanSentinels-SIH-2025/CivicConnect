import React, { useState, useEffect } from "react";
import { 
  FaUser, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaBell, 
  FaSignOutAlt,
  FaSave,
  FaEdit,
  FaCrosshairs,
  FaGlobe
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import api from "../api/axios";

const Settings = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout); // Get logout function from store
  const navigate = useNavigate(); // Initialize navigate
  
  const [coords, setCoords] = useState({
    latitude: 0,
    longitude: 0,
  });
  
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    language: "English",
    notifications: {
      issuesNearby: true,
      reportUpdates: true,
      emailAlerts: false,
      pushNotifications: true,
    }
  });

 const [loggingOut, setLoggingOut] = useState(false);

const handleLogout = async () => {
  setLoggingOut(true);
  
  try {
    // Call the backend logout endpoint via axios instance
    const response = await api.get("/auth/logout", {
      withCredentials: true, // ensures cookies are sent
    });

    console.log(response.data?.message || "Logged out successfully");


    // Redirect to login page
    navigate("/");
  }catch (error) {
    console.error("Logout error:", error.response?.data || error.message);

    navigate("/");
  }  finally {
    setLoggingOut(false);
  }
};



  // Initialize user data and coordinates when user is available
  useEffect(() => {
    if (user) {
      setUserData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }));
      
      if (user.location?.lat && user.location?.lng) {
        setCoords({
          latitude: user.location.lat,
          longitude: user.location.lng
        });
      } else {
        // If user doesn't have location, try to get it from browser
        getCurrentLocation();
      }
    }
  }, [user]);

  // Function to perform reverse geocoding
  const reverseGeocode = async (latitude, longitude) => {
    if (latitude === 0 && longitude === 0) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }
      
      const data = await response.json();
      
      if (data && data.display_name) {
        setLocation(data.display_name);
      } else {
        setLocation(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      setError("Failed to get location name");
      setLocation(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coords.latitude !== 0 && coords.longitude !== 0) {
      reverseGeocode(coords.latitude, coords.longitude);
    }
  }, [coords]);

  const getCurrentLocation = () => {
    setLoading(true);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCoords(newCoords);
      },
      (err) => {
        setError("Unable to retrieve your location");
        setLoading(false);
        console.error("Geolocation error:", err);
      }
    );
  };

  const handleSave = () => {
    setEditMode(false);
    // Here you would typically save the data to your backend
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (type) => {
    setUserData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex flex-col md:flex-row items-center justify-center px-2 py-3 md:px-4 md:py-3 rounded-lg transition-all duration-200 text-sm md:text-base ${
        activeTab === id 
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md' 
          : 'bg-white text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon className="mb-1 md:mb-0 md:mr-2 text-sm md:text-base" />
      <span>{label}</span>
    </button>
  );

  const SettingCard = ({ children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 md:mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-600">
          Settings
        </h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">Customize your experience and preferences</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Tab Navigation */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6 md:mb-8">
          <TabButton
            id="profile"
            icon={FaUser}
            label="Profile"
          />
          <TabButton
            id="location"
            icon={FaMapMarkerAlt}
            label="Location"
          />
          <TabButton
            id="notifications"
            icon={FaBell}
            label="Notifications"
          />
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <SettingCard>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-0">
              <h2 className="text-lg md:text-xl font-semibold flex items-center text-gray-800">
                <FaUser className="mr-2 text-blue-500" />
                Profile Information
              </h2>
              {!editMode ? (
                <button 
                  onClick={() => setEditMode(true)}
                  className="px-3 py-2 md:px-4 md:py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center transition-colors text-sm md:text-base"
                >
                  <FaEdit className="mr-2" /> Edit Profile
                </button>
              ) : (
                <button 
                  onClick={handleSave}
                  className="px-3 py-2 md:px-4 md:py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center transition-colors text-sm md:text-base"
                >
                  <FaSave className="mr-2" /> Save Changes
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                  />
                ) : (
                  <p className="px-3 py-2 md:px-4 md:py-3 bg-blue-50 rounded-lg text-blue-800 font-medium text-sm md:text-base">
                    {userData.name || "Not available"}
                  </p>
                )}
              </div>

              <div>
                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaEnvelope className="mr-2 text-purple-500" /> Email
                </label>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm md:text-base"
                  />
                ) : (
                  <p className="px-3 py-2 md:px-4 md:py-3 bg-purple-50 rounded-lg text-purple-800 font-medium text-sm md:text-base">
                    {userData.email || "Not available"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <p className="px-3 py-2 md:px-4 md:py-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg text-gray-700 font-medium text-sm md:text-base">
                  Community User
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <p className="px-3 py-2 md:px-4 md:py-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg text-gray-700 font-medium text-sm md:text-base">
                  {new Date(user?.createdAt).toLocaleString("en-US", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          </SettingCard>
        )}

        {/* Location Tab */}
        {activeTab === "location" && (
          <SettingCard>
            <h2 className="text-lg md:text-xl font-semibold mb-6 flex items-center text-gray-800">
              <FaMapMarkerAlt className="mr-2 text-green-500" />
              Location Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Coordinates</label>
                <p className="font-mono text-xs md:text-sm bg-gradient-to-r from-blue-50 to-green-50 p-3 md:p-4 rounded-lg border border-blue-100">
                  {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Detected Location</label>
                {loading ? (
                  <div className="flex items-center text-blue-500 p-3 md:p-4 bg-blue-50 rounded-lg text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-blue-500 mr-3"></div>
                    Detecting location...
                  </div>
                ) : error ? (
                  <p className="text-red-500 text-xs md:text-sm p-3 md:p-4 bg-red-50 rounded-lg border border-red-100">{error}</p>
                ) : coords.latitude === 0 && coords.longitude === 0 ? (
                  <p className="text-xs md:text-sm bg-gradient-to-r from-yellow-50 to-orange-50 p-3 md:p-4 rounded-lg border border-yellow-100">
                    Location not set. Click "Use Current Location" to detect.
                  </p>
                ) : (
                  <p className="text-xs md:text-sm bg-gradient-to-r from-green-50 to-blue-50 p-3 md:p-4 rounded-lg border border-green-100">
                    {location}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4">
              <button
                onClick={getCurrentLocation}
                disabled={loading}
                className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all text-sm md:text-base flex items-center justify-center"
              >
                <FaCrosshairs className="mr-2" />
                get Current Location
              </button>
              
             <button
  onClick={async () => {
    try {
      setLoading(true);
      const payload = {
        lat: coords.latitude,
        lng: coords.longitude,
      };

      // Call backend to update user location
      const response = await api.patch("/user-issue/update-location", payload, {
        withCredentials: true,
      });

      console.log("Location updated:", response.data);

      // ✅ Re-fetch user data into Zustand store
      const { data: refreshedUser } = await api.get("/auth/me", {
        withCredentials: true,
      });
      useAuthStore.getState().setUser(refreshedUser.user);

      setError("");
    } catch (err) {
      console.error("Update location error:", err.response?.data || err.message);
      setError("Failed to update location");
    } finally {
      setLoading(false);
    }
  }}
  disabled={loading}
  className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-lg hover:from-gray-300 hover:to-gray-400 disabled:opacity-50 transition-all text-sm md:text-base"
>
  Update Location
</button>

            </div>

            <p className="text-xs md:text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <FaGlobe className="inline mr-2 text-blue-400" />
              Your location helps us show you relevant community issues in your area and improve service accuracy.
            </p>
          </SettingCard>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <SettingCard>
            <h2 className="text-lg md:text-xl font-semibold mb-6 flex items-center text-gray-800">
              <FaBell className="mr-2 text-yellow-500" />
              Notification Preferences
            </h2>

            <div className="space-y-3 md:space-y-4">
              {[
                { key: 'issuesNearby', label: 'Issues near my location', desc: 'Get notified about new issues in your area', color: 'blue' },
                { key: 'reportUpdates', label: 'Updates on my reports', desc: 'Notifications about your submitted reports', color: 'purple' },
                { key: 'emailAlerts', label: 'Email alerts', desc: 'Receive important updates via email', color: 'green' },
                { key: 'pushNotifications', label: 'Push notifications', desc: 'Receive instant alerts on your device', color: 'orange' }
              ].map((item) => (
                <label key={item.key} className="flex items-center justify-between p-3 md:p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200">
                  <div className="flex-1 mr-4">
                    <p className="font-medium text-gray-800 text-sm md:text-base">{item.label}</p>
                    <p className="text-xs md:text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 align-middle select-none flex-shrink-0">
                    <input 
                      type="checkbox" 
                      checked={userData.notifications[item.key]}
                      onChange={() => handleNotificationChange(item.key)}
                      className="sr-only"
                      id={item.key}
                    />
                    <label 
                      htmlFor={item.key} 
                      className={`block h-6 w-12 rounded-full transition-colors ${
                        userData.notifications[item.key] 
                          ? `bg-${item.color}-500` 
                          : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform shadow-md ${
                        userData.notifications[item.key] ? 'transform translate-x-6' : ''
                      }`}></span>
                    </label>
                  </div>
                </label>
              ))}
            </div>
          </SettingCard>
        )}

        {/* Logout Button */}
       <div className="mt-6 md:mt-8">
  <button
    onClick={handleLogout}
    disabled={loggingOut}
    className="w-full px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm md:text-base"
  >
    {loggingOut ? (
      <div className="flex items-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
        Logging out...
      </div>
    ) : (
      <>
        <FaSignOutAlt className="mr-2 md:mr-3" />
        Logout
      </>
    )}
  </button>
</div>

      </div>
    </div>
  );
};

export default Settings;