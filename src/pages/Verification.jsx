import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaEye, FaMapMarkerAlt, FaCalendarAlt, FaFilter, FaSort, FaSearch, FaPlay, FaCheck, FaExclamationTriangle, FaClock, FaThumbsUp, FaBan, FaUsers, FaFlag, FaExclamation } from 'react-icons/fa';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';

const Verification = () => {
  const [issues, setIssues] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [playingVideo, setPlayingVideo] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // Get user from auth store
  const { user } = useAuthStore();

  const handleVerify = async (id, type) => {
    try {
      const { data } = await api.post(
        "/user-issue/verify-issues",
        {
          id,
          type,
          userId: user?._id,
        },
        { withCredentials: true }
      );
      console.log("Verification response:", data);
    } catch (error) {
      console.error("Error verifying issue:", error);
    }
  };

  useEffect(() => {
    const fetchMyIssues = async () => {
      try {
        const { data } = await api.get("/user-issue/other-issues", {
          withCredentials: true,
        });
        setIssues(data);
      } catch (err) {
        console.error("Error fetching my-issues:", err);
      }
    };
    fetchMyIssues();
  }, [user?._id]);

  // Calculate stats from all issues (not filtered)
  const getStatsFromAllIssues = () => {
    const pendingCount = issues.filter(issue => {
      const real = issue.verifications?.real || [];
      const fake = issue.verifications?.fake || [];
      const hasVerified = user?._id && (real.includes(user._id) || fake.includes(user._id));
      return !hasVerified;
    }).length;

    const verifiedCount = issues.filter(issue => {
      const real = issue.verifications?.real || [];
      const fake = issue.verifications?.fake || [];
      const hasVerified = user?._id && (real.includes(user._id) || fake.includes(user._id));
      return hasVerified;
    }).length;

    const totalVerifications = issues.reduce((sum, issue) => 
      sum + ((issue.verifications?.real || []).length), 0
    );

    const avgVerifications = issues.length > 0 
      ? Math.round(totalVerifications / issues.length)
      : 0;

    return {
      total: issues.length,
      pending: pendingCount,
      verified: verifiedCount,
      avgVerifications: avgVerifications
    };
  };

  const stats = getStatsFromAllIssues();

  // Get unique categories from issues
  const categories = [...new Set(issues.map(issue => issue.category))];

  // Filter and sort issues based on user selection
  useEffect(() => {
    let result = [...issues];
    
    if (searchTerm) {
      result = result.filter(issue => 
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (issue.category && issue.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (issue.createdBy && issue.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (statusFilter !== "All") {
      result = result.filter(issue => {
        const status = getStatusFromProgress(issue);
        return status === statusFilter;
      });
    }
    
    if (categoryFilter !== "All") {
      result = result.filter(issue => issue.category === categoryFilter);
    }
    
    result.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc" 
          ? new Date(a.createdAt) - new Date(b.createdAt) 
          : new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "verifications") {
        const aVerifications = a.verifications?.real?.length || 0;
        const bVerifications = b.verifications?.real?.length || 0;
        return sortOrder === "asc" ? aVerifications - bVerifications : bVerifications - aVerifications;
      }
      return 0;
    });
    
    setFilteredReports(result);
  }, [searchTerm, statusFilter, categoryFilter, sortBy, sortOrder, issues]);

  // Determine status based ONLY on progress (not user verification)
  const getStatusFromProgress = (issue) => {
    const real = issue.verifications?.real || [];
    const fake = issue.verifications?.fake || [];
    const hasVerified = user?._id && (real.includes(user._id) || fake.includes(user._id));
    
    if(hasVerified === false){
      return "Pending";
    } else {
      return "Verified";
    }
  };

  // Add status to each issue based on progress
  const reportsWithStatus = filteredReports.map(issue => ({
    ...issue,
    status: getStatusFromProgress(issue),
    views: Math.floor(Math.random() * 100)
  }));

  const statusColors = {
    "Pending": "bg-blue-100 text-blue-800",
    "Verified": "bg-purple-100 text-purple-800",
  };

  const statusIcons = {
    "Pending": <FaClock className="text-blue-500" />,
    "Verified": <FaCheck className="text-purple-500" />,
  };

  // Check if user has verified this issue
  const hasUserVerified = (issue) => {
    if (!user || !issue.verifications) return false;
    return issue.verifications.real && issue.verifications.real.includes(user._id);
  };

  // Check if current user has marked an issue as fake
  const hasUserMarkedFake = (issue) => {
    if (!user || !issue.verifications) return false;
    return issue.verifications.fake && issue.verifications.fake.includes(user._id);
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

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Community Issues Verification</h1>
        <p className="text-gray-600">Verify or report issues submitted by other community members</p>
      </div>

      {/* Stats Overview - Fixed counts from all issues */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Issues */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaFlag className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Total Issues</p>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs opacity-80 mt-1">Needing attention</p>
          </div>
        </div>
        
        {/* Pending Verification */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaExclamationTriangle className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Pending Verification</p>
            <p className="text-2xl font-bold">{stats.pending}</p>
            <p className="text-xs opacity-80 mt-1">Awaiting your review</p>
          </div>
        </div>
        
        {/* Verified Issues */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaCheckCircle className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Verified Issues</p>
            <p className="text-2xl font-bold">{stats.verified}</p>
            <p className="text-xs opacity-80 mt-1">Confirmed by you</p>
          </div>
        </div>
        
        {/* Avg. Verifications */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaUsers className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Avg. Verifications</p>
            <p className="text-2xl font-bold">{stats.avgVerifications}</p>
            <p className="text-xs opacity-80 mt-1">Community engagement</p>
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
              placeholder="Search issues..."
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
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
            </select>
            
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
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
            
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button 
                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-white hover:bg-gray-50'} transition`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
              <button 
                className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'bg-white hover:bg-gray-50'} transition`}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {reportsWithStatus.length} Issue{reportsWithStatus.length !== 1 ? 's' : ''} Found
            {statusFilter !== "All" && ` (${statusFilter})`}
            {categoryFilter !== "All" && ` in ${categoryFilter}`}
          </h2>
        </div>

        {viewMode === 'list' ? (
          /* List View */
          <div className="space-y-4">
            {reportsWithStatus.map(issue => {
              const userVerified = hasUserVerified(issue);
              const userMarkedFake = hasUserMarkedFake(issue);
              const realVerifications = issue.verifications?.real?.length || 0;
              const fakeVerifications = issue.verifications?.fake?.length || 0;
              
              return (
                <div 
                  key={issue._id} 
                  className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-lg p-4 border-l-4 border-blue-500 hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Video Thumbnail/Player */}
                    <div className="relative md:w-1/3 h-40 rounded-lg overflow-hidden">
                      <VideoThumbnail 
                        issue={issue} 
                        isPlaying={playingVideo === issue._id}
                        onClick={(e) => handleVideoClick(e, issue._id)}
                      />
                    </div>
                    
                    {/* Issue Details */}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{issue.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${statusColors[issue.status]}`}>
                          {issue.status}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                          {issue.category}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                        <span className="flex items-center">
                          <FaMapMarkerAlt className="mr-1 text-gray-400" />
                          {issue.location && getDistanceFromLocation(issue.location.latitude, issue.location.longitude)}
                        </span>
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-1 text-gray-400" />
                          {formatDate(issue.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <FaCheckCircle className="text-green-500 mr-1" />
                          <span>{realVerifications} verifications</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaTimesCircle className="text-red-500 mr-1" />
                          <span>{fakeVerifications} fake reports</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaEye className="text-gray-500 mr-1" />
                          <span>{issue.views} views</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-600 mb-3">
                        Reported by: <span className="font-medium">{issue.createdBy?.name || 'Unknown'}</span>
                      </div>

                      {/* Verification Buttons */}
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleVerify(issue._id,"real")}
                          disabled={verifying || userVerified || userMarkedFake}
                          className={`flex items-center gap-2 ${userVerified ? 'bg-green-800' : 'bg-green-600 hover:bg-green-700'} text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50`}
                        >
                          <FaThumbsUp />
                          {userVerified ? 'Already Verified' : 'Verify Issue'}
                        </button>
                        <button
                          onClick={() => handleVerify(issue._id,"fake")}
                          disabled={verifying || userMarkedFake || userVerified}
                          className={`flex items-center gap-2 ${userMarkedFake ? 'bg-red-800' : 'bg-red-600 hover:bg-red-700'} text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50`}
                        >
                          <FaBan />
                          {userMarkedFake ? 'Reported as Fake' : 'Mark as Fake'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportsWithStatus.map(issue => {
              const userVerified = hasUserVerified(issue);
              const userMarkedFake = hasUserMarkedFake(issue);
              const realVerifications = issue.verifications?.real?.length || 0;
              const fakeVerifications = issue.verifications?.fake?.length || 0;
              
              return (
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
                        {issue.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FaMapMarkerAlt className="mr-1 text-gray-400" />
                      {issue.location && getDistanceFromLocation(issue.location.latitude, issue.location.longitude)}
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 mb-3">
                      <span className="flex items-center">
                        <FaCheckCircle className="text-green-500 mr-1" />
                        {realVerifications}
                      </span>
                      <span className="flex items-center">
                        <FaTimesCircle className="text-red-500 mr-1" />
                        {fakeVerifications}
                      </span>
                      <span className="flex items-center">
                        <FaEye className="text-gray-500 mr-1" />
                        {issue.views}
                      </span>
                      <span>{formatDate(issue.createdAt)}</span>
                    </div>

                    <div className="text-xs text-gray-600 mb-3">
                      Reported by: <span className="font-medium">{issue.createdBy?.name || 'Unknown'}</span>
                    </div>

                    {/* Verification Buttons */}
                    <div className="flex flex-col gap-2 mt-2">
                      <button
                        onClick={() => handleVerify(issue._id,"real")}
                        disabled={verifying || userVerified || userMarkedFake}
                        className={`flex items-center justify-center gap-2 ${userVerified ? 'bg-green-800' : 'bg-green-600 hover:bg-green-700'} text-white text-sm font-medium py-2 px-3 rounded-md transition-colors disabled:opacity-50`}
                      >
                        <FaThumbsUp />
                        {userVerified ? 'Verified' : 'Verify'}
                      </button>
                      <button
                        onClick={() => handleVerify(issue._id,"fake")}
                        disabled={verifying || userMarkedFake || userVerified}
                        className={`flex items-center justify-center gap-2 ${userMarkedFake ? 'bg-red-800' : 'bg-red-600 hover:bg-red-700'} text-white text-sm font-medium py-2 px-3 rounded-md transition-colors disabled:opacity-50`}
                      >
                        <FaBan />
                        {userMarkedFake ? 'Reported Fake' : 'Mark Fake'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {reportsWithStatus.length === 0 && (
          <div className="text-center py-10 bg-gradient-to-r from-white to-indigo-50 rounded-xl shadow-lg">
            <FaFilter className="text-4xl text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-500">No issues found</h3>
            <p className="text-gray-400">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verification;