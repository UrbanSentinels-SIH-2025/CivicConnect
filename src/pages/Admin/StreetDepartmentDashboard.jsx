import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaEye, FaMapMarkerAlt, FaCalendarAlt, FaFilter, FaSort, FaSearch, FaPlay, FaClock, FaRoad, FaExclamationTriangle, FaUsers, FaFlag } from 'react-icons/fa';
import api from '../../api/axios';

const StreetDepartmentDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [playingVideo, setPlayingVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllIssues = async () => {
      try {
        setLoading(true);
        const res = await api.get("/user-issue/all-issue");
        console.log("Fetched All Issues:", res.data);
        
        // Filter to only show street category issues
        const streetIssues = res.data.issues.filter(issue => 
          issue.category === "Street"
        );
        
        setIssues(streetIssues);
        setFilteredIssues(streetIssues);
      } catch (err) {
        console.error("Error fetching all issues:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllIssues();
  }, []);

  // Filter and sort issues based on user selection
  useEffect(() => {
    let result = [...issues];
    
    if (searchTerm) {
      result = result.filter(issue => 
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (issue.createdBy && issue.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (statusFilter !== "All") {
      result = result.filter(issue => {
        const status = getStatusFromProgress(issue.progress);
        return status === statusFilter;
      });
    }
    
    result.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc" 
          ? new Date(a.createdAt) - new Date(b.createdAt) 
          : new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "verifications") {
        return sortOrder === "asc" ? a.verifications - b.verifications : b.verifications - a.verifications;
      }
      return 0;
    });
    
    setFilteredIssues(result);
  }, [searchTerm, statusFilter, sortBy, sortOrder, issues]);

  // Determine status based on progress
  const getStatusFromProgress = (progress) => {
    if (!progress) return "Pending";
    if (progress.resolved && progress.resolved.completed) return "Resolved";
    if (progress.inProgress && progress.inProgress.completed) return "In Progress";
    if (progress.verified && progress.verified.completed) return "Verified";
    return "Pending";
  };

  // Add status to each issue based on progress
  const issuesWithStatus = filteredIssues.map(issue => ({
    ...issue,
    status: getStatusFromProgress(issue.progress),
    views: Math.floor(Math.random() * 100) // Add random views for demo
  }));

  const statusColors = {
    "Pending": "bg-blue-100 text-blue-800",
    "Verified": "bg-purple-100 text-purple-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    "Resolved": "bg-green-100 text-green-800"
  };

  const statusIcons = {
    "Pending": <FaClock className="text-blue-500" />,
    "Verified": <FaCheckCircle className="text-purple-500" />,
    "In Progress": <FaExclamationTriangle className="text-yellow-500" />,
    "Resolved": <FaCheckCircle className="text-green-500" />
  };

  const handleVideoClick = (e, issueId) => {
    e.stopPropagation();
    setPlayingVideo(playingVideo === issueId ? null : issueId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDistanceFromLocation = (lat, lng) => {
    // Simple mock function
    const distances = ["0.2 km away", "0.5 km away", "0.8 km away", "1.2 km away", "1.5 km away"];
    return distances[Math.floor(Math.random() * distances.length)];
  };

  // Video Thumbnail Component
  const VideoThumbnail = ({ issue, isPlaying, onClick }) => {
    return (
      <div className="relative w-full h-full group">
        {isPlaying ? (
          <video 
            src={issue.videoUrl} 
            controls 
            className="w-full h-full object-cover rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div 
            className="w-full h-full bg-cover bg-center rounded-lg transition-all duration-300 group-hover:brightness-90"
            style={{ backgroundImage: `url(${issue.thumbnail})` }}
            onClick={onClick}
          >
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white bg-opacity-90 flex items-center justify-center transform scale-95 group-hover:scale-105 transition-transform duration-300 shadow-md">
                <FaPlay className="text-blue-600 text-xl ml-1" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading street issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <div className="mb-6 flex items-center">
        <div className="bg-blue-600 p-3 rounded-lg mr-4">
          <FaRoad className="text-white text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Street Department Dashboard</h1>
          <p className="text-gray-600">Manage and monitor street-related issues in your area</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Street Issues */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaFlag className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Total Street Issues</p>
            <p className="text-2xl font-bold">{issues.length}</p>
            <p className="text-xs opacity-80 mt-1">Reported by community</p>
          </div>
        </div>
        
        {/* Pending Verification */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaClock className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Pending Verification</p>
            <p className="text-2xl font-bold">{issuesWithStatus.filter(r => r.status === "Pending").length}</p>
            <p className="text-xs opacity-80 mt-1">Awaiting review</p>
          </div>
        </div>
        
        {/* In Progress */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaExclamationTriangle className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">In Progress</p>
            <p className="text-2xl font-bold">{issuesWithStatus.filter(r => r.status === "In Progress").length}</p>
            <p className="text-xs opacity-80 mt-1">Being addressed</p>
          </div>
        </div>
        
        {/* Resolved Issues */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaCheckCircle className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Resolved Issues</p>
            <p className="text-2xl font-bold">{issuesWithStatus.filter(r => r.status === "Resolved").length}</p>
            <p className="text-xs opacity-80 mt-1">Successfully fixed</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gradient-to-r from-white to-indigo-50 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search street issues..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="verifications">Sort by Verifications</option>
            </select>
            
            <button 
              className="border border-gray-300 rounded-lg px-3 py-2 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm hover:bg-gray-50 transition"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              <FaSort className="mr-1" />
              {sortOrder === "asc" ? "Asc" : "Desc"}
            </button>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {issuesWithStatus.length} Street Issue{issuesWithStatus.length !== 1 ? 's' : ''} Found
          </h2>
        </div>

        {/* Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issuesWithStatus.map(issue => (
            <div 
              key={issue._id} 
              className="bg-gradient-to-r from-white to-indigo-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all flex flex-col"
            >
              {/* Video Thumbnail/Player */}
              <div className="relative h-48">
                <VideoThumbnail 
                  issue={issue} 
                  isPlaying={playingVideo === issue._id}
                  onClick={(e) => handleVideoClick(e, issue._id)}
                />
              </div>
              
              {/* Issue Details */}
              <div className="p-4 flex-grow">
                <h4 className="font-medium text-gray-800 mb-2">{issue.title}</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[issue.status]}`}>
                    {issue.status}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                    Street
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <FaMapMarkerAlt className="mr-1 text-gray-400" />
                  {issue.location && getDistanceFromLocation(issue.location.latitude, issue.location.longitude)}
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 mb-3">
                  <span className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-1" />
                    {issue.verifications || 0} verifications
                  </span>
                  <span className="flex items-center">
                    <FaEye className="text-gray-500 mr-1" />
                    {issue.views} views
                  </span>
                </div>

                <div className="text-xs text-gray-600 mb-3">
                  Reported by: <span className="font-medium">{issue.createdBy?.name || 'Unknown'}</span>
                </div>

                <div className="text-xs text-gray-500">
                  <FaCalendarAlt className="inline mr-1" />
                  {formatDate(issue.createdAt)}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 mt-4">
                  <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors">
                    <FaEye />
                    View Details
                  </button>
                  {issue.status === "Pending" && (
                    <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors">
                      <FaCheckCircle />
                      Mark as Verified
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {issuesWithStatus.length === 0 && (
          <div className="text-center py-10 bg-gradient-to-r from-white to-indigo-50 rounded-xl shadow-lg">
            <FaRoad className="text-4xl text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-500">No street issues found</h3>
            <p className="text-gray-400">All street issues are resolved or try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreetDepartmentDashboard;