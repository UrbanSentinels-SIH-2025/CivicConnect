import React, { useState, useEffect } from "react";
import { 
  FaUser, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaSignOutAlt,
  FaSave,
  FaEdit,
  FaCrosshairs,
  FaGlobe
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import api from "../../api/axios";

const Settings = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  
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
  });

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    
    try {
      const response = await api.get("/auth/logout", {
        withCredentials: true,
      });

      console.log(response.data?.message || "Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      navigate("/");
    } finally {
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

  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex flex-col md:flex-row items-center justify-center px-2 py-3 md:px-4 md:py-3 rounded-lg transition-all duration-200 text-sm md:text-base font-rozha ${
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
    <div className={`bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-4 md:p-6 border border-white/40 ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-[#D9F3FF] via-[#EAF9FB] to-[#CBEFF1] font-rozha text-gray-900">
      {/* Header */}
      <div className="mb-6 md:mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-iceberg tracking-tight">
          Settings
        </h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">Customize your experience and preferences</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Tab Navigation */}
        <div className="grid grid-cols-2 gap-2 md:gap-3 mb-6 md:mb-8">
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
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <SettingCard>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-0">
              <h2 className="text-lg md:text-xl font-semibold flex items-center text-gray-800 font-iceberg">
                <FaUser className="mr-2 text-blue-500" />
                Profile Information
              </h2>
              {!editMode ? (
                <button 
                  onClick={() => setEditMode(true)}
                  className="px-3 py-2 md:px-4 md:py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center transition-colors text-sm md:text-base font-iceberg"
                >
                  <FaEdit className="mr-2" /> Edit Profile
                </button>
              ) : (
                <button 
                  onClick={handleSave}
                  className="px-3 py-2 md:px-4 md:py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center transition-colors text-sm md:text-base font-iceberg"
                >
                  <FaSave className="mr-2" /> Save Changes
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-iceberg">Name</label>
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base font-rozha"
                  />
                ) : (
                  <p className="px-3 py-2 md:px-4 md:py-3 bg-blue-50 rounded-lg text-blue-800 font-medium text-sm md:text-base font-rozha">
                    {userData.name || "Not available"}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center font-iceberg">
                  <FaEnvelope className="mr-2 text-purple-500" /> Email
                </label>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm md:text-base font-rozha"
                  />
                ) : (
                  <p className="px-3 py-2 md:px-4 md:py-3 bg-purple-50 rounded-lg text-purple-800 font-medium text-sm md:text-base font-rozha">
                    {userData.email || "Not available"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-iceberg">Role</label>
                <p className="px-3 py-2 md:px-4 md:py-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg text-gray-700 font-medium text-sm md:text-base font-rozha">
                  Community User
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-iceberg">Member Since</label>
                <p className="px-3 py-2 md:px-4 md:py-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg text-gray-700 font-medium text-sm md:text-base font-rozha">
                  {new Date(user?.createdAt).toLocaleString("en-US", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          </SettingCard>
        )}

        {/* Location Tab */}
        {activeTab === "location" && (
          <SettingCard>
            <h2 className="text-lg md:text-xl font-semibold mb-6 flex items-center text-gray-800 font-iceberg">
              <FaMapMarkerAlt className="mr-2 text-green-500" />
              Location Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-iceberg">Current Coordinates</label>
                <p className=" text-xs md:text-sm bg-gradient-to-r from-blue-50 to-green-50 p-3 md:p-4 rounded-lg border border-blue-100 font-rozha">
                  {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-iceberg">Detected Location</label>
                {loading ? (
                  <div className="flex items-center text-blue-500 p-3 md:p-4 bg-blue-50 rounded-lg text-sm font-rozha">
                    <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-blue-500 mr-3"></div>
                    Detecting location...
                  </div>
                ) : error ? (
                  <p className="text-red-500 text-xs md:text-sm p-3 md:p-4 bg-red-50 rounded-lg border border-red-100 font-rozha">{error}</p>
                ) : coords.latitude === 0 && coords.longitude === 0 ? (
                  <p className="text-xs md:text-sm bg-gradient-to-r from-yellow-50 to-orange-50 p-3 md:p-4 rounded-lg border border-yellow-100 font-rozha">
                    Location not set. Click "Use Current Location" to detect.
                  </p>
                ) : (
                  <p className="text-xs md:text-sm bg-gradient-to-r from-green-50 to-blue-50 p-3 md:p-4 rounded-lg border border-green-100 font-rozha">
                    {location}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4">
              <button
                onClick={getCurrentLocation}
                disabled={loading}
                className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all text-sm md:text-base flex items-center justify-center font-iceberg transform hover:scale-105 duration-300"
              >
                <FaCrosshairs className="mr-2" />
                Get Current Location
              </button>
              
              <button
                onClick={async () => {
                  try {
                    setLoading(true);
                    const payload = {
                      lat: coords.latitude,
                      lng: coords.longitude,
                    };

                    const response = await api.patch("/user-issue/update-location", payload, {
                      withCredentials: true,
                    });

                    console.log("Location updated:", response.data);

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
                className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-lg hover:from-gray-300 hover:to-gray-400 disabled:opacity-50 transition-all text-sm md:text-base font-iceberg"
              >
                Update Location
              </button>
            </div>

            <p className="text-xs md:text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200 font-rozha">
              <FaGlobe className="inline mr-2 text-blue-400" />
              Your location helps us show you relevant community issues in your area and improve service accuracy.
            </p>
          </SettingCard>
        )}

        {/* Logout Button */}
        <div className="mt-6 md:mt-8">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm md:text-base font-iceberg transform hover:scale-105 duration-300"
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