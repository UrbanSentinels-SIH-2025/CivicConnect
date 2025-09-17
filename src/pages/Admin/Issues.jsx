import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../../api/axios";

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Utility to get status badge color
const getStatusBadge = (status) => {
  const baseClass = "px-2 py-1 rounded text-xs font-semibold";
  if (status === "Pending") return `${baseClass} bg-red-100 text-red-700`;
  if (status === "In Progress")
    return `${baseClass} bg-yellow-100 text-yellow-700`;
  if (status === "Resolved") return `${baseClass} bg-green-100 text-green-700`;
  return baseClass;
};

// Get category color for map markers
const getCategoryColor = (category) => {
  switch (category) {
    case "Street":
      return "#ef4444";
    case "Water":
      return "#3b82f6";
    case "Electricity":
      return "#eab308";
    case "Sanitation":
      return "#22c55e";
    default:
      return "#6b7280";
  }
};

// Create custom markers for each category
const createCustomIcon = (category, isSelected = false) => {
  const color = getCategoryColor(category);
  const size = isSelected ? 30 : 25;

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; 
                      width: ${size}px; 
                      height: ${size}px; 
                      border-radius: 50% 50% 50% 0; 
                      transform: rotate(-45deg);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      border: 3px solid white;
                      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                      position: relative;">
            <div style="transform: rotate(45deg); 
                       color: white; 
                       font-weight: bold;
                       font-size: ${isSelected ? "12px" : "10px"};
                       text-align: center;
                       margin-top: ${isSelected ? "2px" : "1px"};
                       margin-left: ${isSelected ? "1px" : "0"}">
              ${category.charAt(0)}
            </div>
           </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

// Filter component
const FilterBar = ({ filters, setFilters, categories, statuses }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            className="rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            className="rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="All">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            className="rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="verifications">Most Verifications</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm"
            onClick={() =>
              setFilters({ category: "All", status: "All", sortBy: "newest" })
            }
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// Simplified Issue card component
const IssueCard = ({ issue, onSelect, isSelected, onOpenVideo }) => {
  const handleVideoClick = (e) => {
    e.stopPropagation();
    onOpenVideo(issue.videoUrl, issue.title);
  };

  // Determine status based on progress
  const getStatusFromProgress = (progress) => {
    if (progress.resolved.completed) return "Resolved";
    if (progress.inProgress.completed) return "In Progress";
    if (progress.verified.completed) return "Verified";
    return "Pending";
  };

  const status = getStatusFromProgress(issue.progress);

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={() => onSelect(issue)}
    >
      {/* Video thumbnail */}
      <div className="relative">
        <img
          src={
            issue.thumbnail ||
            "https://via.placeholder.com/400x200?text=No+Thumbnail"
          }
          alt={issue.title}
          className="w-full h-32 object-cover"
        />
        <button
          onClick={handleVideoClick}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-60 transition-opacity"
        >
          <div className="bg-white rounded-full p-3 hover:bg-gray-100 transition-colors">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {issue.title}
          </h3>
          <span className={getStatusBadge(status)}>{status}</span>
        </div>

        <p className="text-sm text-gray-600 mb-2">Category: {issue.category}</p>

        <div className="flex items-center mb-2">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mr-2">
            {issue.verifications} verifications
          </span>
        </div>

        <div className="text-xs text-gray-500 mb-2">
          Reported: {formatDate(issue.createdAt)}
        </div>

        <div className="text-xs text-gray-600 mb-3">
          Reported by: <span className="font-medium">{issue.createdBy?.name || "Unknown"}</span>
        </div>

        {/* Video button */}
        <button
          onClick={handleVideoClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors"
        >
          📹 Watch Video
        </button>
      </div>
    </div>
  );
};

// Map Legend Component - Concise version
const MapLegend = () => {
  const categories = [
    { name: "Street", color: "#ef4444", description: "Road issues" },
    { name: "Water", color: "#3b82f6", description: "Water problems" },
    { name: "Electricity", color: "#eab308", description: "Power issues" },
    { name: "Sanitation", color: "#22c55e", description: "Cleanliness" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-2 mb-2 text-xs">
      <h3 className=" text-gray-800 mb-2 text-md font-bold">Map Legend</h3>
      <div className="flex gap-4 justify-evenly">
        {categories.map((category) => (
          <div key={category.name} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color }}
            ></div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-700">{category.name}</span>
              <span className="text-gray-500">{category.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Recenter Button Component
const RecenterButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-md z-[1000] hover:bg-gray-100 transition-colors"
      title="Recenter Map"
    >
      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>
  );
};

// Custom Map Component using Leaflet
const CustomMap = ({ issues, selectedIssue, onMarkerClick, onRecenter }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [19.0804, 83.8088],
        14
      );

      // Google-like tile layer
      L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        attribution:
          '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add markers for each issue
    issues.forEach((issue) => {
      const isSelected = selectedIssue && selectedIssue._id === issue._id;
      const marker = L.marker(
        [issue.location.latitude, issue.location.longitude],
        { icon: createCustomIcon(issue.category, isSelected) }
      ).addTo(mapInstanceRef.current);

      // Determine status based on progress
      const getStatusFromProgress = (progress) => {
        if (progress.resolved.completed) return "Resolved";
        if (progress.inProgress.completed) return "In Progress";
        if (progress.verified.completed) return "Verified";
        return "Pending";
      };

      const status = getStatusFromProgress(issue.progress);

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold">${issue.title}</h3>
          <p>Category: ${issue.category}</p>
          <p>Status: ${status}</p>
          <p>Verifications: ${issue.verifications}</p>
        </div>
      `);

      marker.on("click", () => {
        onMarkerClick(issue);
      });

      markersRef.current.push(marker);
    });

    if (selectedIssue) {
      mapInstanceRef.current.setView(
        [selectedIssue.location.latitude, selectedIssue.location.longitude],
        14
      );
    } else if (issues.length === 1) {
      mapInstanceRef.current.setView(
        [issues[0].location.latitude, issues[0].location.longitude],
        14
      );
    } else if (issues.length > 1) {
      const group = new L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1), {
        maxZoom: 14,
      });
    }

    return () => {
      // Cleanup function to prevent memory leaks
      markersRef.current.forEach((marker) => {
        mapInstanceRef.current.removeLayer(marker);
      });
    };
  }, [issues, selectedIssue, onMarkerClick]);

  const handleRecenter = () => {
    if (issues.length === 0) {
      mapInstanceRef.current.setView([19.0804, 83.8088], 14);
    } else if (issues.length === 1) {
      mapInstanceRef.current.setView(
        [issues[0].location.latitude, issues[0].location.longitude],
        14
      );
    } else {
      const group = new L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1), {
        maxZoom: 14,
      });
    }
    
    if (onRecenter) {
      onRecenter();
    }
  };

  return (
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden h-[600px]">
      <div
        ref={mapRef}
        className="w-full h-full rounded-xl"
        style={{ zIndex: 1 }}
      />
      <RecenterButton onClick={handleRecenter} />
    </div>
  );
};

// Video player modal component
const VideoModal = ({ isOpen, onClose, videoUrl, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg p-4 max-w-4xl w-full max-h-screen overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        <video controls className="w-full h-96 bg-black rounded" src={videoUrl}>
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default function AdminIssues() {
  const [issuesData, setIssuesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "All",
    status: "All",
    sortBy: "newest",
  });

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [videoModal, setVideoModal] = useState({
    isOpen: false,
    videoUrl: "",
    title: "",
  });

  // Fetch issues from API
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const res = await api.get("/user-issue/all-issue");
        
        if (res.data.success) {
          setIssuesData(res.data.issues);
        } else {
          setError("Failed to fetch issues");
        }
      } catch (err) {
        setError(err.message || "Error fetching issues");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // Get unique categories and statuses for filters
  const categories = [...new Set(issuesData.map((issue) => issue.category))];
  const statuses = ["Pending", "Verified", "In Progress", "Resolved"];

  // Filter and sort issues
  const filteredIssues = issuesData
    .filter((issue) => {
      // Determine status based on progress
      const getStatusFromProgress = (progress) => {
        if (progress.resolved.completed) return "Resolved";
        if (progress.inProgress.completed) return "In Progress";
        if (progress.verified.completed) return "Verified";
        return "Pending";
      };
      
      const status = getStatusFromProgress(issue.progress);
      
      return (
        (filters.category === "All" || issue.category === filters.category) &&
        (filters.status === "All" || status === filters.status)
      );
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "verifications":
          return b.verifications - a.verifications;
        default:
          return 0;
      }
    });

  const openVideoModal = (videoUrl, title) => {
    setVideoModal({ isOpen: true, videoUrl, title });
  };

  const closeVideoModal = () => {
    setVideoModal({ isOpen: false, videoUrl: "", title: "" });
  };

  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue);
  };

  const handleMarkerClick = (issue) => {
    setSelectedIssue(issue);
    setShowDetails(true);
  };

  const handleRecenter = () => {
    setSelectedIssue(null);
  };

  // Count issues by status
  const countByStatus = (status) => {
    return issuesData.filter(issue => {
      const getStatusFromProgress = (progress) => {
        if (progress.resolved.completed) return "Resolved";
        if (progress.inProgress.completed) return "In Progress";
        if (progress.verified.completed) return "Verified";
        return "Pending";
      };
      
      return getStatusFromProgress(issue.progress) === status;
    }).length;
  };

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading issues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800">Error Loading Issues</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen">
      <div className="w-full mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Community Issues Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage reported community issues
            </p>
          </div>
          <div className="flex gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
              Export Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Issues
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {issuesData.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {countByStatus("Pending")}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-700">In Progress</h3>
            <p className="text-3xl font-bold text-blue-600">
              {countByStatus("In Progress")}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-700">Resolved</h3>
            <p className="text-3xl font-bold text-green-600">
              {countByStatus("Resolved")}
            </p>
          </div>
        </div>

        <FilterBar
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          statuses={statuses}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Issues List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Reported Issues ({filteredIssues.length})
              </h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredIssues.length > 0 ? (
                  filteredIssues.map((issue) => (
                    <IssueCard
                      key={issue._id}
                      issue={issue}
                      onSelect={handleIssueSelect}
                      isSelected={
                        selectedIssue && selectedIssue._id === issue._id
                      }
                      onOpenVideo={openVideoModal}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No issues match the selected filters
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
             {/* Map Legend */}
             <MapLegend />
            <CustomMap
              issues={filteredIssues}
              selectedIssue={selectedIssue}
              onMarkerClick={handleMarkerClick}
              onRecenter={handleRecenter}
            />
          </div>
        </div>

        {/* Video Modal */}
        <VideoModal
          isOpen={videoModal.isOpen}
          onClose={closeVideoModal}
          videoUrl={videoModal.videoUrl}
          title={videoModal.title}
        />
      </div>
    </div>
  );
}