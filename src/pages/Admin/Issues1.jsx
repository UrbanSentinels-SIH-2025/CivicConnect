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

// Issue Row Component for List View (YouTube Studio style)
const IssueRow = ({ issue, onSelect, isSelected, onOpenVideo, index }) => {
  // Determine status based on progress
  const getStatusFromProgress = (progress) => {
    if (!progress) return "Pending";
    if (progress.resolved && progress.resolved.completed) return "Resolved";
    if (progress.inProgress && progress.inProgress.completed) return "In Progress";
    if (progress.verified && progress.verified.completed) return "Verified";
    return "Pending";
  };

  // Calculate total verifications from real array
  const getVerificationCount = (verifications) => {
    if (!verifications) return 0;
    return verifications.real ? verifications.real.length : 0;
  };

  const status = getStatusFromProgress(issue.progress);
  const verificationCount = getVerificationCount(issue.verifications);

  return (
    <div
      className={`grid grid-cols-12 gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
        isSelected ? "bg-blue-50 border-blue-200" : ""
      }`}
      onClick={() => onSelect(issue)}
    >
      {/* Checkbox */}
      <div className="col-span-1 flex items-center">
        <input
          type="checkbox"
          className="h-4 w-4 text-blue-600 rounded"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(issue);
          }}
        />
      </div>

      {/* Thumbnail */}
      <div className="col-span-2">
        <div className="relative aspect-video rounded overflow-hidden">
          <img
            src={issue.thumbnail || "https://via.placeholder.com/160x90?text=No+Thumbnail"}
            alt={issue.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenVideo(issue.videoUrl, issue.title);
            }}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-40 transition-opacity"
          >
            <div className="bg-white rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Title and Details */}
      <div  className="col-span-5">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{issue.title}</h3>
        <p  className="text-sm text-gray-600 mb-1">Category: {issue.category}</p>
        <p  className="text-xs text-gray-500">Reported: {formatDate(issue.createdAt)}</p>
        <p  className="text-xs text-gray-500">By: {issue.createdBy?.name || "Unknown"}</p>
      </div>

      {/* Status */}
      <div className="col-span-2 flex items-center">
        <span className={getStatusBadge(status)}>{status}</span>
      </div>

      {/* Verifications */}
      <div className="col-span-1 flex items-center">
        <span className="text-sm text-gray-700 font-medium">{verificationCount}</span>
      </div>

      {/* Actions */}
      <div className="col-span-1 flex items-center justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenVideo(issue.videoUrl, issue.title);
          }}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Watch
        </button>
      </div>
    </div>
  );
};

// Map Legend Component
const MapLegend = () => {
  const categories = [
    { name: "Street", color: "#ef4444", description: "Road issues" },
    { name: "Water", color: "#3b82f6", description: "Water problems" },
    { name: "Electricity", color: "#eab308", description: "Power issues" },
    { name: "Sanitation", color: "#22c55e", description: "Cleanliness" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-2 mb-2 text-xs">
      <h3 className="text-gray-800 mb-2 text-md font-bold">Map Legend</h3>
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

      // Google Satellite with labels tile layer
      L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Maps'
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
        if (!progress) return "Pending";
        if (progress.resolved && progress.resolved.completed) return "Resolved";
        if (progress.inProgress && progress.inProgress.completed) return "In Progress";
        if (progress.verified && progress.verified.completed) return "Verified";
        return "Pending";
      };

      // Calculate verification count
      const getVerificationCount = (verifications) => {
        if (!verifications) return 0;
        return verifications.real ? verifications.real.length : 0;
      };

      const status = getStatusFromProgress(issue.progress);
      const verificationCount = getVerificationCount(issue.verifications);

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold">${issue.title}</h3>
          <p>Category: ${issue.category}</p>
          <p>Status: ${status}</p>
          <p>Verifications: ${verificationCount}</p>
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

// Tab Navigation Component
const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'list', label: 'List View', icon: '📋' },
    { id: 'map', label: 'Map View', icon: '🗺️' },
  ];

  return (
    <div className="bg-white rounded-lg shadow mb-4">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
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
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'map'
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const issuesPerPage = 20;

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
        console.log("API Response:", res.data);
        
        if (res.data.success) {
          // Handle both array and object responses
          const issues = Array.isArray(res.data.issues) ? res.data.issues : 
                        Array.isArray(res.data) ? res.data : 
                        [res.data];
          setIssuesData(issues);
        } else {
          setError("Failed to fetch issues");
        }
      } catch (err) {
        console.error("Error fetching issues:", err);
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
        if (!progress) return "Pending";
        if (progress.resolved && progress.resolved.completed) return "Resolved";
        if (progress.inProgress && progress.inProgress.completed) return "In Progress";
        if (progress.verified && progress.verified.completed) return "Verified";
        return "Pending";
      };
      
      const status = getStatusFromProgress(issue.progress);
      
      return (
        (filters.category === "All" || issue.category === filters.category) &&
        (filters.status === "All" || status === filters.status)
      );
    })
    .sort((a, b) => {
      // Calculate verification counts for sorting
      const getVerificationCount = (verifications) => {
        if (!verifications) return 0;
        return verifications.real ? verifications.real.length : 0;
      };

      const aVerifications = getVerificationCount(a.verifications);
      const bVerifications = getVerificationCount(b.verifications);

      switch (filters.sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "verifications":
          return bVerifications - aVerifications;
        default:
          return 0;
      }
    });

  // Pagination for list view
  const totalPages = Math.ceil(filteredIssues.length / issuesPerPage);
  const startIndex = (currentPage - 1) * issuesPerPage;
  const currentIssues = filteredIssues.slice(startIndex, startIndex + issuesPerPage);

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
  };

  const handleRecenter = () => {
    setSelectedIssue(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when switching tabs
  };

  // Count issues by status
  const countByStatus = (status) => {
    return issuesData.filter(issue => {
      const getStatusFromProgress = (progress) => {
        if (!progress) return "Pending";
        if (progress.resolved && progress.resolved.completed) return "Resolved";
        if (progress.inProgress && progress.inProgress.completed) return "In Progress";
        if (progress.verified && progress.verified.completed) return "Verified";
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
          {/* Total Issues */}
          <div className="rounded-lg shadow-md p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium uppercase tracking-wide opacity-90">
                Total Issues
              </h3>
              <div className="bg-white/20 p-2 rounded-full">
                📊
              </div>
            </div>
            <p className="text-3xl font-extrabold mt-2">{issuesData.length}</p>
          </div>

          {/* Pending */}
          <div className="rounded-lg shadow-md p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium uppercase tracking-wide opacity-90">
                Pending
              </h3>
              <div className="bg-black/10 p-2 rounded-full">
                ⏳
              </div>
            </div>
            <p className="text-3xl font-extrabold mt-2">{countByStatus("Pending")}</p>
          </div>

          {/* In Progress */}
          <div className="rounded-lg shadow-md p-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium uppercase tracking-wide opacity-90">
                In Progress
              </h3>
              <div className="bg-white/20 p-2 rounded-full">
                ⚡
              </div>
            </div>
            <p className="text-3xl font-extrabold mt-2">{countByStatus("In Progress")}</p>
          </div>

          {/* Resolved */}
          <div className="rounded-lg shadow-md p-4 bg-gradient-to-r from-green-400 to-emerald-600 text-white hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium uppercase tracking-wide opacity-90">
                Resolved
              </h3>
              <div className="bg-white/20 p-2 rounded-full">
                ✅
              </div>
            </div>
            <p className="text-3xl font-extrabold mt-2">{countByStatus("Resolved")}</p>
          </div>
        </div>

        <FilterBar
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          statuses={statuses}
        />

        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        {activeTab === 'list' ? (
          /* List View */
          <div className="bg-white rounded-lg shadow">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 font-medium text-gray-700 text-sm">
              <div className="col-span-1">Select</div>
              <div className="col-span-2">Thumbnail</div>
              <div className="col-span-5">Issue Details</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Verifications</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Issues List */}
            <div className="max-h-[600px] overflow-y-auto">
              {currentIssues.length > 0 ? (
                currentIssues.map((issue, index) => (
                  <IssueRow
                    key={issue._id}
                    issue={issue}
                    onSelect={handleIssueSelect}
                    isSelected={selectedIssue && selectedIssue._id === issue._id}
                    onOpenVideo={openVideoModal}
                    index={startIndex + index}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No issues match the selected filters
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1}-{Math.min(startIndex + issuesPerPage, filteredIssues.length)} of {filteredIssues.length} issues
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Map View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Issues List Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Reported Issues ({filteredIssues.length})
                </h2>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {filteredIssues.length > 0 ? (
                    filteredIssues.map((issue) => (
                      <div
                        key={issue._id}
                        className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer p-4 ${
                          selectedIssue && selectedIssue._id === issue._id ? "ring-2 ring-blue-500" : ""
                        }`}
                        onClick={() => handleIssueSelect(issue)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {issue.title}
                          </h3>
                          <span className={getStatusBadge(getStatusFromProgress(issue.progress))}>
                            {getStatusFromProgress(issue.progress)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Category: {issue.category}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openVideoModal(issue.videoUrl, issue.title);
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors"
                        >
                          📹 Watch Video
                        </button>
                      </div>
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
              <MapLegend />
              <CustomMap
                issues={filteredIssues}
                selectedIssue={selectedIssue}
                onMarkerClick={handleMarkerClick}
                onRecenter={handleRecenter}
              />
            </div>
          </div>
        )}

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

// Helper function to determine status from progress
function getStatusFromProgress(progress) {
  if (!progress) return "Pending";
  if (progress.resolved && progress.resolved.completed) return "Resolved";
  if (progress.inProgress && progress.inProgress.completed) return "In Progress";
  if (progress.verified && progress.verified.completed) return "Verified";
  return "Pending";
}