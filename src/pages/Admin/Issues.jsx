import { NavLink } from "react-router-dom";
import api from "../../api/axios";
import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import IssueRow from "./issues/IssueRow";
import Card from "./issues/Card";
import FilterResultsInfo from "./issues/FilterResultsInfo";
import Header from "./issues/Header";
import VideoModal from "./issues/VideoModal";

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
              ${category ? category.charAt(0) : 'I'}
            </div>
           </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
};

// Map Component
const MapComponent = ({ issues, selectedIssue, onMarkerClick, onMapClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Initialize map
    if (!mapInstanceRef.current && mapRef.current) {
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

      // Add click event listener to the map
      mapInstanceRef.current.on('click', (e) => {
        // Check if the click was directly on the map (not on a marker)
        if (!e.originalEvent._stopped) {
          onMapClick();
        }
      });
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];

    // Add markers for each issue
    issues.forEach((issue) => {
      if (!issue.location || !issue.location.latitude || !issue.location.longitude) {
        console.warn('Issue missing location data:', issue);
        return;
      }

      const isSelected = selectedIssue && selectedIssue._id === issue._id;
      const marker = L.marker(
        [issue.location.latitude, issue.location.longitude],
        { icon: createCustomIcon(issue.category, isSelected) }
      ).addTo(mapInstanceRef.current);

      // Determine status based on progress
      const getStatusFromProgress = (progress) => {
        if (!progress) return "Pending";
        if (progress.resolved?.completed) return "Resolved";
        if (progress.inProgress?.completed) return "In Progress";
        if (progress.verified?.completed) return "Verified";
        return "Pending";
      };

      const status = getStatusFromProgress(issue.progress);

      marker.bindPopup(`
        <div class="p-2 min-w-[200px]">
          <h3 class="font-semibold text-lg mb-2">${issue.title || 'No Title'}</h3>
          <p class="text-sm"><strong>Category:</strong> ${issue.category || 'N/A'}</p>
          <p class="text-sm"><strong>Status:</strong> ${status}</p>
          <p class="text-sm"><strong>Reported:</strong> ${new Date(issue.createdAt).toLocaleDateString()}</p>
        </div>
      `);

      marker.on("click", (e) => {
        // Stop the event from propagating to the map
        e.originalEvent._stopped = true;
        onMarkerClick(issue);
        
        // Close other popups and open this one
        markersRef.current.forEach(m => {
          if (m !== marker) m.closePopup();
        });
        marker.openPopup();
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers if there are issues and no issue is selected
    if (issues.length > 0 && !selectedIssue) {
      const group = new L.featureGroup(markersRef.current);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1), {
          maxZoom: 14,
        });
      }
    }

    // If a specific issue is selected, center the map on that issue
    if (selectedIssue && selectedIssue.location) {
      mapInstanceRef.current.setView(
        [selectedIssue.location.latitude, selectedIssue.location.longitude],
        16 // Zoom in closer when showing single issue
      );
    }

    return () => {
      // Cleanup function to prevent memory leaks
      markersRef.current.forEach((marker) => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(marker);
        }
      });
    };
  }, [issues, selectedIssue, onMarkerClick, onMapClick]);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
      <div
        ref={mapRef}
        className="w-full h-full rounded-xl"
        style={{ minHeight: '500px' }}
        onClick={(e) => {
          // Handle direct div click as map click
          if (e.target === mapRef.current) {
            onMapClick();
          }
        }}
      />
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
    <div className="bg-white rounded-lg shadow-md p-3 mb-4 text-xs">
      <h3 className="text-gray-800 mb-2 text-sm font-bold">Map Legend</h3>
      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => (
          <div key={category.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color }}
            ></div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-700">{category.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Issues = () => {
  const [issuesData, setIssuesData] = useState([]);
  const [statusCount, setStatusCount] = useState({
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [mapView, setMapView] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
  });
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [displayedIssues, setDisplayedIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await api.get("/user-issue/all-issue");
        const issues = res.data.issues || [];
        setIssuesData(issues);
        setFilteredIssues(issues);
        setDisplayedIssues(issues);
        setStatusCount(countByStatus(issues));

        const uniqueCategories = [
          ...new Set(issues.map((issue) => issue.category)),
        ].filter(Boolean);
        setCategories(uniqueCategories);
      } catch (err) {
        console.log(err);
      }
    };
    fetchIssues();
  }, []);

  function countByStatus(issues) {
    const statusCount = {
      pending: 0,
      inProgress: 0,
      resolved: 0,
    };

    issues.forEach((issue) => {
      const { reported, inProgress, resolved } = issue.progress || {};
      if (resolved?.completed) {
        statusCount.resolved++;
      } else if (inProgress?.completed) {
        statusCount.inProgress++;
      } else if (reported?.completed) {
        statusCount.pending++;
      }
    });

    return statusCount;
  }

  // Filter issues based on status and category
  const applyFilters = (newFilters = filters) => {
    const filtered = issuesData.filter((issue) => {
      const matchesStatus = newFilters.status
        ? newFilters.status === "pending"
          ? issue.progress.reported?.completed &&
            !issue.progress.inProgress?.completed
          : newFilters.status === "inProgress"
          ? issue.progress.inProgress?.completed &&
            !issue.progress.resolved?.completed
          : newFilters.status === "resolved"
          ? issue.progress.resolved?.completed
          : true
        : true;

      const matchesCategory = newFilters.category
        ? issue.category === newFilters.category
        : true;

      return matchesStatus && matchesCategory;
    });

    setFilteredIssues(filtered);
    setDisplayedIssues(filtered);
    setSelectedIssue(null);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value,
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = { status: "", category: "" };
    setFilters(resetFilters);
    setFilteredIssues(issuesData);
    setDisplayedIssues(issuesData);
    setSelectedIssue(null);
  };

  const validateVideoUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch (error) {
      console.error("Invalid video URL:", url);
      return false;
    }
  };

  const openVideoModal = (videoUrl, title) => {
    if (validateVideoUrl(videoUrl)) {
      setSelectedVideo({ url: videoUrl, title });
    } else {
      console.error("Invalid video URL:", videoUrl);
      alert("The video URL is invalid or unavailable.");
    }
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue);
    setDisplayedIssues([issue]);
  };

  const handleMarkerClick = (issue) => {
    setSelectedIssue(issue);
    setDisplayedIssues([issue]);
  };

  const handleMapClick = () => {
    // Only reset if we're currently showing a single issue
    if (selectedIssue) {
      setDisplayedIssues(filteredIssues);
      setSelectedIssue(null);
    }
  };

  // Handle click outside modal to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeVideoModal();
      }
    };

    if (selectedVideo) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [selectedVideo]);

  // Update displayed issues when filteredIssues changes (only if no issue is selected)
  useEffect(() => {
    if (!selectedIssue) {
      setDisplayedIssues(filteredIssues);
    }
  }, [filteredIssues, selectedIssue]);

  const stats = [
    {
      title: "Total Issues",
      icon: "📊",
      gradient: "from-blue-500 to-indigo-600",
      textColor: "text-white",
      value: issuesData.length,
    },
    {
      title: "Pending",
      icon: "⏳",
      gradient: "from-yellow-400 to-orange-500",
      textColor: "text-black",
      value: statusCount.pending,
    },
    {
      title: "In Progress",
      icon: "⚡",
      gradient: "from-cyan-400 to-blue-500",
      textColor: "text-white",
      value: statusCount.inProgress,
    },
    {
      title: "Resolved",
      icon: "✅",
      gradient: "from-green-400 to-emerald-600",
      textColor: "text-white",
      value: statusCount.resolved,
    },
  ];

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen">
      <div className="w-full mx-auto">
        {/* Header */}
        <Header />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              title={stat.title}
              icon={stat.icon}
              gradient={stat.gradient}
              textColor={stat.textColor}
              value={stat.value}
            />
          ))}
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-cyan-50/10 pointer-events-none"></div>

          <div className="flex flex-col md:flex-row gap-4 items-end relative z-10">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                  />
                </svg>
                Filter by Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="inProgress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Filter by Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>

          {/* Enhanced Filter Results Info */}
          <FilterResultsInfo
            filteredIssues={filteredIssues}
            issuesData={issuesData}
            filters={filters}
          />
        </div>

        {/* Toggle Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {mapView ? "Map View" : "Table View"}
          </h2>
          <button 
            onClick={() => {
              setMapView(!mapView);
              if (!mapView) {
                setDisplayedIssues(filteredIssues);
                setSelectedIssue(null);
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 flex items-center gap-2"
          >
            {mapView ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Show Table View
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Show Map View
              </>
            )}
          </button>
        </div>

        {/* Main Content Area */}
        {mapView ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Issues List Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-4 h-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Issues ({displayedIssues.length})
                  {selectedIssue && (
                    <span className="text-sm text-blue-600 ml-2">
                      (Showing selected issue)
                    </span>
                  )}
                </h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {displayedIssues.length > 0 ? (
                    displayedIssues.map((issue) => (
                      <div
                        key={issue._id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          selectedIssue && selectedIssue._id === issue._id
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                        onClick={() => handleIssueSelect(issue)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 line-clamp-2">
                            {issue.title}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              issue.progress?.resolved?.completed
                                ? "bg-green-100 text-green-700"
                                : issue.progress?.inProgress?.completed
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {issue.progress?.resolved?.completed
                              ? "Resolved"
                              : issue.progress?.inProgress?.completed
                              ? "In Progress"
                              : "Pending"}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-1">
                          Category: {issue.category}
                        </p>
                        <p className="text-xs text-gray-500">
                          Reported: {new Date(issue.createdAt).toLocaleDateString()}
                        </p>

                        {issue.videoUrl && (
                          <div className="mt-2 w-full bg-black rounded-lg overflow-hidden">
                            <video
                              src={issue.videoUrl}
                              controls
                              className="w-full h-48 object-contain"
                            >
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No issues found matching the current filters
                    </p>
                  )}
                </div>
                {selectedIssue && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 text-center">
                      Click anywhere on the map to show all filtered issues
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Map Area */}
            <div className="lg:col-span-2">
              <MapLegend />
              <MapComponent
                issues={displayedIssues}
                selectedIssue={selectedIssue}
                onMarkerClick={handleMarkerClick}
                onMapClick={handleMapClick}
              />
            </div>
          </div>
        ) : (
          // Table View (unchanged)
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reported By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredIssues.length > 0 ? (
                    filteredIssues.map((issue) => (
                      <IssueRow
                        key={issue._id}
                        issue={issue}
                        onWatchVideo={openVideoModal}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No issues found matching the current filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          selectedVideo={selectedVideo}
          closeVideoModal={closeVideoModal}
        />
      )}
    </div>
  );
};

export default Issues;