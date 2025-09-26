import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  FaMapMarkerAlt, 
  FaUser, 
  FaCalendar, 
  FaCheck, 
  FaClock, 
  FaThumbsUp, 
  FaThumbsDown, 
  FaExclamationTriangle,
  FaVideo,
  FaMapPin
} from 'react-icons/fa';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon in Leaflet
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

// Color scheme constants
const COLOR_SCHEME = {
  primary: { 500: '#3b82f6', 600: '#2563eb' },
  success: { 500: '#22c55e', 600: '#16a34a', 700: '#15803d' },
  warning: { 500: '#f59e0b' },
  error: { 500: '#ef4444', 600: '#dc2626' },
  gray: { 100: '#f3f4f6', 200: '#e5e7eb', 500: '#6b7280', 600: '#4b5563' }
};

// Category colors
const CATEGORY_COLORS = {
  "Street": { bg: '#fee2e2', text: '#dc2626', border: '#fecaca', gradient: 'linear-gradient(135deg, #f87171, #dc2626)' },
  "Water": { bg: '#dbeafe', text: '#2563eb', border: '#bfdbfe', gradient: 'linear-gradient(135deg, #60a5fa, #2563eb)' },
  "Electricity": { bg: '#fef3c7', text: '#d97706', border: '#fde68a', gradient: 'linear-gradient(135deg, #fbbf24, #d97706)' },
  "Sanitation": { bg: '#dcfce7', text: '#16a34a', border: '#bbf7d0', gradient: 'linear-gradient(135deg, #4ade80, #16a34a)' },
  "default": { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb', gradient: 'linear-gradient(135deg, #9ca3af, #4b5563)' }
};

// Status Indicator Component
const StatusIndicator = ({ status, label, stepNumber }) => (
  <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
    status ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
  }`}>
    <div className="flex items-center gap-3">
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
        status ? 'bg-green-500 shadow-lg' : 'bg-gray-400'
      }`}>
        {stepNumber}
      </div>
      <span className={`font-medium ${status ? 'text-green-800' : 'text-gray-600'}`}>
        {label}
      </span>
    </div>
    <span className={status ? "text-green-600 text-lg" : "text-gray-400 text-lg"}>
      {status ? <FaCheck className="inline" /> : <FaClock className="inline" />}
    </span>
  </div>
);

// Detail Card Component
const DetailCard = ({ title, children, icon, gradient }) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-transform duration-300 hover:shadow-xl">
    <div className={`px-4 py-4 border-b border-gray-100 ${gradient || 'bg-gradient-to-r from-blue-50 to-cyan-50'}`}>
      <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
        {icon} {title}
      </h3>
    </div>
    <div className="p-4">
      {children}
    </div>
  </div>
);

// Recenter Button Component
const RecenterButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg z-[1000] hover:bg-gray-50 transition-all duration-300 border border-gray-200"
    title="Recenter Map"
  >
    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  </button>
);

// Create custom icon based on category
const createCustomIcon = (category, isResolved = false) => {
  const color = CATEGORY_COLORS[category]?.text || CATEGORY_COLORS.default.text;
  const size = 40;
  const resolvedGradient = isResolved 
    ? 'linear-gradient(135deg, #10b981, #059669)' 
    : (CATEGORY_COLORS[category]?.gradient || CATEGORY_COLORS.default.gradient);

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background: ${resolvedGradient}; 
        width: ${size}px; 
        height: ${size}px; 
        border-radius: 50% 50% 50% 0; 
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          transform: rotate(45deg); 
          color: white; 
          font-weight: bold;
          font-size: 14px;
          text-align: center;
        ">
          ${isResolved ? '✓' : (category ? category.charAt(0) : 'I')}
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
};

const IssueDetail = () => {
 const { departmentName, issueId, id } = useParams();

  // Prefer issueId, but fall back to id if it's missing
  const finalIssueId = issueId || id;

  console.log(useParams());
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('reported'); // 'reported' or 'resolved'
  const [locationNames, setLocationNames] = useState({}); // Store location names
  const mapRef = useRef();
  const videoRef = useRef();
  const completedVideoRef = useRef();

  useEffect(() => {
    const fetchIssue = async () => {
      if (!finalIssueId) return;
      
      try {
        setLoading(true);
        const res = await api.get(`/user-issue/issue/${finalIssueId}`);
        setIssue(res.data);
        setError(null);
        
        // Fetch location names after issue data is loaded
        if (res.data) {
          await fetchLocationNames(res.data);
        }
      } catch (err) {
        console.error('Error fetching issue:', err);
        setError('Failed to load issue details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchIssue();
  }, [finalIssueId]);

  // Function to fetch location names
  const fetchLocationNames = async (issueData) => {
    const names = {};
    
    try {
      // Fetch reported location name
      if (issueData.location?.latitude && issueData.location?.longitude) {
        const reportedName = await getLocationName(issueData.location);
        names.reported = reportedName;
      }
      
      // Fetch resolved location name if available
      if (issueData.taskCompletelocation?.latitude && issueData.taskCompletelocation?.longitude) {
        const resolvedName = await getLocationName(issueData.taskCompletelocation);
        names.resolved = resolvedName;
      }
      
      setLocationNames(names);
    } catch (error) {
      console.error('Error fetching location names:', error);
    }
  };

  // Function to get location name from coordinates
  const getLocationName = async (location) => {
    const { latitude, longitude } = location;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      
      const data = await response.json();
      
      if (data && data.address) {
        const address = data.address;
        
        // Return the most relevant location name with priority
        return data.display_name||
               `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      }
      
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    } catch (error) {
      console.error('Error fetching location name:', error);
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  const handleStartWork = async () => {
    if (!issue?._id) return;
    
    try {
      const payload = {
        id: issue._id,
        progressStage: "inProgress",
      };
      await api.patch('/user-issue/department-issues/progress', payload);
      setShowModal(false);
      // Optionally refresh the issue data
      const res = await api.get(`/user-issue/issue/${finalIssueId}`);
      setIssue(res.data);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const openGoogleMapsDirections = (lat, lng) => {
    if (!lat || !lng) {
      alert('Location data is not available');
      return;
    }
    
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`,
      '_blank'
    );
  };

  const handleRecenter = (lat, lng) => {
    if (mapRef.current && lat && lng) {
      mapRef.current.setView([lat, lng], 15);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-semibold text-blue-700">Loading issue details...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-200 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-600 text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Issue</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // No issue found
  if (!issue) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-gray-600 text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-700">Issue Not Found</h2>
          <p className="text-gray-600 mt-2">The requested issue could not be found.</p>
        </div>
      </div>
    );
  }

  const {
    videoUrl,
    taskCompleteUrl,
    title,
    createdAt,
    updatedAt,
    category,
    location,
    taskCompletelocation,
    progress = {},
    verifications = {},
    createdBy = {},
  } = issue;

  const isResolved = progress.resolved?.completed;
  const hasReportedLocation = location?.latitude && location?.longitude;
  const hasCompletedLocation = taskCompletelocation?.latitude && taskCompletelocation?.longitude;
  const categoryColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNERTVENjQiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEwIDEwQzEyLjIwOTEgMTAgMTQgOC4yMDkxIDE0IDZDMTQgMy43OTA4NiAxMi4yMDkxIDIgMTAgMkM3Ljc5MDg2IDIgNiAzLjc5MDg2IDYgNkM2IDguMjA5MSA3Ljc5MDg2IDEwIDEwIDEwWk0xMCAxMkM3LjMzMzMzIDEyIDIgMTMuMzQgMiAxNkgyQzIgMTguNjYgNy4zMzMzMyAyMCAxMCAyMEMxMi42NjY3IDIwIDE4IDE4LjY2IDE4IDE2SDE4QzE4IDEzLjM0IDEyLjY2NjcgMTIgMTAgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+';

  // Function to display location name
  const displayLocationName = (type) => {
    if (!locationNames[type]) {
      return "Loading location...";
    }
    return locationNames[type];
  };

  // Media Card with tabs for reported vs resolved content
  const MediaCard = () => (
    <DetailCard 
      title={isResolved ? "Issue Media & Resolution" : "Issue Media"} 
      gradient="bg-gradient-to-r from-purple-50 to-pink-50"
      icon={<FaVideo />}
    >
      {isResolved ? (
        <div>
          {/* Tabs for Reported vs Resolved */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              className={`flex-1 py-2 px-4 text-center font-medium ${
                activeTab === 'reported' 
                  ? 'border-b-2 border-purple-600 text-purple-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('reported')}
            >
              Reported Issue
            </button>
            <button
              className={`flex-1 py-2 px-4 text-center font-medium ${
                activeTab === 'resolved' 
                  ? 'border-b-2 border-green-600 text-green-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('resolved')}
            >
              Resolution Proof
            </button>
          </div>

          {/* Content based on active tab */}
          <div className="aspect-video bg-black rounded-xl overflow-hidden">
            {activeTab === 'reported' ? (
              <video
                src={videoUrl}
                controls
                className="w-full h-full object-cover rounded-lg"
                preload="metadata"
                ref={videoRef}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <video
                src={taskCompleteUrl}
                controls
                className="w-full h-full object-cover rounded-lg"
                preload="metadata"
                ref={completedVideoRef}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {/* Tab descriptions */}
          <div className="mt-3 text-sm text-gray-600">
            {activeTab === 'reported' ? (
              <p>Original issue reported by citizen on {createdAt ? new Date(createdAt).toLocaleDateString() : 'unknown date'}</p>
            ) : (
              <p>Proof of resolution completed on {progress.resolved?.date ? new Date(progress.resolved.date).toLocaleDateString() : 'unknown date'}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-cover rounded-lg"
            preload="metadata"
            ref={videoRef}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </DetailCard>
  );

  // Map Card showing both locations if resolved
  const MapCard = () => (
    <DetailCard 
      title={isResolved ? "Issue Locations" : "Issue Location"} 
      gradient="bg-gradient-to-r from-blue-50 to-cyan-50"
      icon={<FaMapPin />}
    >
      {isResolved ? (
        <div>
          {/* Tabs for Reported vs Resolved locations */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              className={`flex-1 py-2 px-4 text-center font-medium ${
                activeTab === 'reported' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('reported')}
            >
              Reported Location
            </button>
            <button
              className={`flex-1 py-2 px-4 text-center font-medium ${
                activeTab === 'resolved' 
                  ? 'border-b-2 border-green-600 text-green-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('resolved')}
            >
              Resolution Location
            </button>
          </div>

          {/* Map based on active tab */}
          <div className="h-64 lg:h-96 rounded-xl overflow-hidden relative">
            {activeTab === 'reported' && hasReportedLocation ? (
              <MapContainer
                center={[location.latitude, location.longitude]}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                <Marker 
                  position={[location.latitude, location.longitude]}
                  icon={createCustomIcon(category, false)}
                >
                  <Popup>
                    <div className="p-2 max-w-xs">
                      <strong className="text-sm">Reported Issue Location</strong>
                      <p className="text-xs mt-1 text-gray-600">Category: {category}</p>
                      <p className="text-xs text-gray-500">Reported: {createdAt ? new Date(createdAt).toLocaleDateString() : 'Unknown'}</p>
                      <p className="text-xs text-blue-600 mt-1">{displayLocationName('reported')}</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            ) : activeTab === 'resolved' && hasCompletedLocation ? (
              <MapContainer
                center={[taskCompletelocation.latitude, taskCompletelocation.longitude]}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                <Marker 
                  position={[taskCompletelocation.latitude, taskCompletelocation.longitude]}
                  icon={createCustomIcon(category, true)}
                >
                  <Popup>
                    <div className="p-2 max-w-xs">
                      <strong className="text-sm">Resolution Location</strong>
                      <p className="text-xs mt-1 text-gray-600">Category: {category}</p>
                      <p className="text-xs text-gray-500">Resolved: {progress.resolved?.date ? new Date(progress.resolved.date).toLocaleDateString() : 'Unknown'}</p>
                      <p className="text-xs text-green-600 mt-1">{displayLocationName('resolved')}</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="h-full bg-gray-100 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">Location data not available</p>
              </div>
            )}

            {/* Recenter and Directions buttons */}
            <RecenterButton onClick={() => {
              if (activeTab === 'reported' && hasReportedLocation) {
                handleRecenter(location.latitude, location.longitude);
              } else if (activeTab === 'resolved' && hasCompletedLocation) {
                handleRecenter(taskCompletelocation.latitude, taskCompletelocation.longitude);
              }
            }} />

            <button
              onClick={() => {
                if (activeTab === 'reported' && hasReportedLocation) {
                  openGoogleMapsDirections(location.latitude, location.longitude);
                } else if (activeTab === 'resolved' && hasCompletedLocation) {
                  openGoogleMapsDirections(taskCompletelocation.latitude, taskCompletelocation.longitude);
                }
              }}
              className="absolute top-3 left-3 bg-white px-3 py-2 rounded-lg shadow-lg z-[1000] text-xs font-medium"
            >
              <FaMapMarkerAlt className="text-blue-600 inline mr-1" />
              Open in Maps
            </button>
          </div>

          {/* Location details */}
          <div className="mt-3 text-sm text-gray-600">
            {activeTab === 'reported' ? (
              <p>
                <strong>Location:</strong> {displayLocationName('reported')}
              </p>
            ) : (
              <p>
                <strong>Location:</strong> {displayLocationName('resolved')}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="h-64 lg:h-96 rounded-xl overflow-hidden relative">
          {hasReportedLocation ? (
            <MapContainer
              center={[location.latitude, location.longitude]}
              zoom={15}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <Marker 
                position={[location.latitude, location.longitude]}
                icon={createCustomIcon(category, false)}
              >
                <Popup>
                  <div className="p-2 max-w-xs">
                    <strong className="text-sm">{title}</strong>
                    <p className="text-xs mt-1 text-gray-600">Category: {category}</p>
                    <p className="text-xs text-blue-600">{displayLocationName('reported')}</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="h-full bg-gray-100 rounded-xl flex items-center justify-center">
              <p className="text-gray-500">Location data not available</p>
            </div>
          )}
          <RecenterButton onClick={() => handleRecenter(location.latitude, location.longitude)} />
          <button
            onClick={() => openGoogleMapsDirections(location.latitude, location.longitude)}
            className="absolute top-3 left-3 bg-white px-3 py-2 rounded-lg shadow-lg z-[1000] text-xs font-medium"
          >
            <FaMapMarkerAlt className="text-blue-600 inline mr-1" />
            Open in Maps
          </button>
          
          {/* Location name display */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg z-[1000] text-xs font-medium max-w-xs">
            <FaMapMarkerAlt className="text-blue-600 inline mr-1" />
            <span className="text-gray-700">{displayLocationName('reported')}</span>
          </div>
        </div>
      )}
    </DetailCard>
  );

  // Progress Card - Fixed Start Work button alignment
  const ProgressCard = () => (
    <DetailCard title="Progress Status" gradient="bg-gradient-to-r from-green-50 to-emerald-50">
      <div className="space-y-3">
        <StatusIndicator status={progress.reported?.completed} label="Reported" stepNumber={1} />
        <StatusIndicator status={progress.verified?.completed} label="Verified" stepNumber={2} />
        <StatusIndicator status={progress.inProgress?.completed} label="In Progress" stepNumber={3} />
        <StatusIndicator status={progress.resolved?.completed} label="Resolved" stepNumber={4} />
      </div>
      
      {/* Fixed alignment for Start Work button */}
      <div className="mt-6 flex flex-col gap-3">
        {!isResolved && !progress.inProgress?.completed && (
          <NavLink
            to={`/department/${departmentName}/mark-as-complete/${finalIssueId}`}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-colors text-center"
          >
            Start Work on This Issue
          </NavLink>
        )}
        
        {progress.inProgress?.completed && !isResolved && (
          <NavLink
            to={`/department/${departmentName}/mark-as-complete/${finalIssueId}`}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-colors text-center"
          >
            Mark as Complete
          </NavLink>
        )}

        {isResolved && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
            <FaCheck className="text-green-600 text-2xl mx-auto mb-2" />
            <p className="text-green-800 font-medium">Issue Resolved</p>
            <p className="text-green-600 text-sm">
              Completed on {progress.resolved?.date ? new Date(progress.resolved.date).toLocaleDateString() : 'unknown date'}
            </p>
          </div>
        )}
      </div>
    </DetailCard>
  );

  // Rest of the components remain the same...
  const ReporterCard = () => (
    <DetailCard title="Reporter Information" gradient="bg-gradient-to-r from-indigo-50 to-blue-50" icon={<FaUser />}>
      <div className="flex items-center gap-4 p-3 bg-white/50 rounded-lg">
        <div className="relative">
          <img 
            src={createdBy.picture || defaultAvatar} 
            alt={createdBy.name} 
            className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-lg"
            onError={(e) => { e.target.src = defaultAvatar; }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 truncate">{createdBy.name || 'Unknown Reporter'}</p>
          <p className="text-sm text-gray-600 truncate">{createdBy.email || 'No email provided'}</p>
          <p className="text-xs text-gray-500 mt-1">
            Reported: {createdAt ? new Date(createdAt).toLocaleDateString() : 'Unknown'}
          </p>
        </div>
      </div>
    </DetailCard>
  );

  const VerificationCard = () => (
    <DetailCard title="Community Verification" gradient="bg-gradient-to-r from-amber-50 to-orange-50">
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="text-2xl font-bold text-green-700">{verifications.real?.length || 0}</div>
          <div className="text-sm text-green-600 flex items-center justify-center gap-1 mt-1">
            <FaThumbsUp /> Verified Real
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
          <div className="text-2xl font-bold text-red-700">{verifications.fake?.length || 0}</div>
          <div className="text-sm text-red-600 flex items-center justify-center gap-1 mt-1">
            <FaThumbsDown /> Reported Fake
          </div>
        </div>
      </div>
    </DetailCard>
  );

  const TimelineCard = () => (
    <DetailCard title="Timeline" gradient="bg-gradient-to-r from-gray-50 to-blue-50" icon={<FaCalendar />}>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-gray-700">Created:</span>
          <span className="font-semibold text-blue-700">
            {createdAt ? new Date(createdAt).toLocaleString() : 'Unknown'}
          </span>
        </div>
        {progress.resolved?.date && (
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="text-gray-700">Resolved:</span>
            <span className="font-semibold text-green-700">
              {new Date(progress.resolved.date).toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
          <span className="text-gray-700">Last Updated:</span>
          <span className="font-semibold text-purple-700">
            {updatedAt ? new Date(updatedAt).toLocaleString() : 'Unknown'}
          </span>
        </div>
      </div>
    </DetailCard>
  );

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-cyan-50 pb-8">
      {/* Header */}
      <div className={`rounded-2xl px-4 py-8 text-white shadow-lg ${
        isResolved 
          ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
          : 'bg-gradient-to-r from-blue-600 to-purple-600'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold mb-4">{title}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm">
                  <FaMapMarkerAlt /> {category || 'Uncategorized'}
                </span>
                <span className="inline-flex items-center gap-2 text-white/90">
                  <FaCalendar /> {createdAt ? new Date(createdAt).toLocaleDateString() : 'Unknown'}
                </span>
                {isResolved && (
                  <span className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm">
                    <FaCheck /> Resolved
                  </span>
                )}
              </div>
            </div>
            {isResolved && (
              <div className="bg-white/20 px-4 py-2 rounded-lg mt-4 lg:mt-0">
                <p className="text-sm">Resolution Date</p>
                <p className="font-bold">{progress.resolved?.date ? new Date(progress.resolved.date).toLocaleDateString() : 'Unknown'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden space-y-4 px-4 mt-4">
        <MediaCard />
        <ProgressCard />
        <MapCard />
        <ReporterCard />
        <VerificationCard />
        <TimelineCard />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block py-6 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <MediaCard />
              <MapCard />
            </div>
            <div className="space-y-8">
              <ProgressCard />
              <ReporterCard />
              <VerificationCard />
              <TimelineCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;