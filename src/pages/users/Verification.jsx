import React, { useState, useEffect } from 'react';
import { 
  FaCheckCircle, FaTimesCircle, FaEye, FaMapMarkerAlt, FaCalendarAlt, 
  FaFilter, FaSort, FaSearch, FaPlay, FaCheck, FaExclamationTriangle, 
  FaClock, FaThumbsUp, FaBan, FaFlag, FaExclamation, FaSpinner, FaUsers,
  FaVideo, FaMedal
} from 'react-icons/fa';
import api from '../../api/axios';
import useAuthStore from '../../store/useAuthStore';
import { useOtherReports } from '../../hooks/tanstack/useOtherReports';

const Verification = () => {
  
  const [apiData, setApiData] = useState({
    totalIssues: 0,
    totalVerified: 0,
    pendingCount: 0,
    issues: []
  });
  
  const { data, status, refetch } = useOtherReports();
  
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [playingVideo, setPlayingVideo] = useState(null);
  const [loadingIssues, setLoadingIssues] = useState({});

  // Get user from auth store
  const { user } = useAuthStore();
  if(user){
    console.log(user._id);
  }

  // Update apiData when TanStack Query data changes
  useEffect(() => {
    if (status === "success" && data) {
      setApiData(data);
    }
  }, [status, data]);

  const handleVerify = async (id, verifyType) => {
    setLoadingIssues(prev => ({ ...prev, [id]: true }));
    
    try {
      const response = await api.post(
        "/user-issue/verify-issues",
        {
          id,
          type: verifyType,
          userId: user?._id,
        },
        { withCredentials: true }
      );
      console.log("Verification response:", response.data);
      
      // Update the issues list with the new verification data
      const updatedIssues = apiData.issues.map(issue => {
        if (issue._id === id) {
          const updatedVerifications = { ...issue.verifications };
          if (verifyType === "real") {
            updatedVerifications.real = [...(updatedVerifications.real || []), user._id];
            // Remove from fake if user was there
            if (updatedVerifications.fake) {
              updatedVerifications.fake = updatedVerifications.fake.filter(userId => userId !== user._id);
            }
          } else if (verifyType === "fake") {
            updatedVerifications.fake = [...(updatedVerifications.fake || []), user._id];
            // Remove from real if user was there
            if (updatedVerifications.real) {
              updatedVerifications.real = updatedVerifications.real.filter(userId => userId !== user._id);
            }
          }
          return { ...issue, verifications: updatedVerifications };
        }
        return issue;
      });
      
      setApiData(prev => ({ ...prev, issues: updatedIssues }));
      
      // Refetch data to ensure consistency
      refetch();
    } catch (error) {
      console.error("Error verifying issue:", error);
    } finally {
      setLoadingIssues(prev => ({ ...prev, [id]: false }));
    }
  };

  // Get stats directly from API response
  const stats = {
    total: apiData.totalIssues || 0,
    pending: apiData.pendingCount || 0,
    verified: apiData.totalVerified || 0,
  };

  // Get unique categories from issues
  const categories = [...new Set(apiData.issues.map(issue => issue.category))];

  // Filter and sort issues based on user selection
  useEffect(() => {
    let result = [...apiData.issues];
    
    if (searchTerm) {
      result = result.filter(issue => 
        issue.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (issue.category && issue.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (issue.createdBy?.name && issue.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (statusFilter !== "All") {
      result = result.filter(issue => {
        const issueStatus = getStatusFromProgress(issue);
        return issueStatus === statusFilter;
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
  }, [searchTerm, statusFilter, categoryFilter, sortBy, sortOrder, apiData.issues]);

  // Determine status based on user verification - UPDATED
  const getStatusFromProgress = (issue) => {
    const real = issue.verifications?.real || [];
    const fake = issue.verifications?.fake || [];
    
    if (!user?._id) return "Pending";
    
    if (real.includes(user._id)) {
      return "Marked as Real";
    } else if (fake.includes(user._id)) {
      return "Marked as Fake";
    } else {
      return "Pending";
    }
  };

  // Add status to each issue based on progress
  const reportsWithStatus = filteredReports.map(issue => ({
    ...issue,
    status: getStatusFromProgress(issue),
  }));

  // UPDATED status colors for more specific statuses
  const statusColors = {
    "Pending": "bg-blue-100 text-blue-800",
    "Marked as Real": "bg-green-100 text-green-800",
    "Marked as Fake": "bg-red-100 text-red-800",
  };

  // Check if user has verified this issue as real
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

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <FaSpinner className="animate-spin mr-2" />
      <span>Processing...</span>
    </div>
  );

  // Show loading state while data is fetching
  if (status === "loading") {
    return (
      <div className="p-4 md:p-6 min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center font-rozha">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-iceberg">Loading issues...</p>
        </div>
      </div>
    );
  }

  // Show error state if fetch failed
  if (status === "error") {
    return (
      <div className="p-4 md:p-6 min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center font-rozha">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 font-iceberg">Failed to load issues. Please try again.</p>
          <button 
            onClick={refetch}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-iceberg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-[#D9F3FF] via-[#EAF9FB] to-[#CBEFF1] font-rozha text-gray-900">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 font-iceberg tracking-tight">Community Issues Verification</h1>
        <p className="text-gray-600">Verify or report issues submitted by other community members</p>
      </div>

      {/* Stats Overview - Using API data directly */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Issues */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 flex items-center text-white transform hover:scale-105 transition-all duration-300 border border-transparent hover:border-blue-400 hover:shadow-[0_0_20px_#3b82f6]">
          <div className="rounded-full bg-white/20 p-3 mr-4 backdrop-blur-sm">
            <FaFlag className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80 font-iceberg">Total Issues</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>
        
        {/* Pending Verification */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-4 flex items-center text-white transform hover:scale-105 transition-all duration-300 border border-transparent hover:border-yellow-400 hover:shadow-[0_0_20px_#eab308]">
          <div className="rounded-full bg-white/20 p-3 mr-4 backdrop-blur-sm">
            <FaExclamationTriangle className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80 font-iceberg">Pending Verification</p>
            <p className="text-2xl font-bold">{stats.pending}</p>
            <p className="text-xs opacity-80 mt-1">Awaiting your review</p>
          </div>
        </div>
        
        {/* Verified Issues */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-4 flex items-center text-white transform hover:scale-105 transition-all duration-300 border border-transparent hover:border-green-400 hover:shadow-[0_0_20px_#22c55e]">
          <div className="rounded-full bg-white/20 p-3 mr-4 backdrop-blur-sm">
            <FaCheckCircle className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80 font-iceberg">Verified Issues</p>
            <p className="text-2xl font-bold">{stats.verified}</p>
            <p className="text-xs opacity-80 mt-1">Confirmed by you</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 border border-white/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search issues..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 font-rozha"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-rozha"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Marked as Real">Marked as Real</option>
              <option value="Marked as Fake">Marked as Fake</option>
            </select>
            
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-rozha"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-rozha"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="verifications">Sort by Verifications</option>
            </select>
            
            <button 
              className="border border-gray-300 rounded-lg px-3 py-2 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm hover:bg-gray-50 transition font-rozha"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              <FaSort className="mr-1" />
              {sortOrder === "asc" ? "Asc" : "Desc"}
            </button>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 font-iceberg">
            {reportsWithStatus.length} Issue{reportsWithStatus.length !== 1 ? 's' : ''} Found
            {statusFilter !== "All" && ` (${statusFilter})`}
            {categoryFilter !== "All" && ` in ${categoryFilter}`}
          </h2>
        </div>

        <div className="space-y-4">
          {reportsWithStatus.map(issue => {
            const userVerified = hasUserVerified(issue);
            const userMarkedFake = hasUserMarkedFake(issue);
            const realVerifications = issue.verifications?.real?.length || 0;
            const fakeVerifications = issue.verifications?.fake?.length || 0;
            const isLoading = loadingIssues[issue._id];
            
            return (
              <div 
                key={issue._id} 
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-4 border-l-4 border-blue-500 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:translate-x-1"
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
                    <h4 className="font-medium text-gray-800 font-iceberg text-lg">{issue.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs ${statusColors[issue.status]} font-iceberg`}>
                        {issue.status}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800 font-iceberg">
                        {issue.category}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
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
                    </div>

                    <div className="text-xs text-gray-600 mb-3 font-iceberg">
                      Reported by: <span className="font-medium">{issue.createdBy?.name || 'Unknown'}</span>
                    </div>

                    {/* Verification Buttons */}
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleVerify(issue._id, "real")}
                        disabled={isLoading || userVerified || userMarkedFake}
                        className={`flex items-center justify-center gap-2 ${userVerified ? 'bg-green-800' : 'bg-green-600 hover:bg-green-700'} text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 min-w-[140px] font-iceberg`}
                      >
                        {isLoading ? (
                          <LoadingSpinner />
                        ) : (
                          <>
                            <FaThumbsUp />
                            {userVerified ? 'Marked as Real' : 'Verify Issue'}
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleVerify(issue._id, "fake")}
                        disabled={isLoading || userMarkedFake || userVerified}
                        className={`flex items-center justify-center gap-2 ${userMarkedFake ? 'bg-red-800' : 'bg-red-600 hover:bg-red-700'} text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 min-w-[140px] font-iceberg`}
                      >
                        {isLoading ? (
                          <LoadingSpinner />
                        ) : (
                          <>
                            <FaBan />
                            {userMarkedFake ? 'Marked as Fake' : 'Mark as Fake'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {reportsWithStatus.length === 0 && (
          <div className="text-center py-10 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/40">
            <FaFilter className="text-4xl text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-500 font-iceberg">No issues found</h3>
            <p className="text-gray-400">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verification;