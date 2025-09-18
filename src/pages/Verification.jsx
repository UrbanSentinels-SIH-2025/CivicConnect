import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaEye, FaMapMarkerAlt, FaCalendarAlt, FaFilter, FaSort, FaSearch, FaPlay, FaCheck, FaExclamationTriangle, FaClock, FaThumbsUp, FaBan } from 'react-icons/fa';

const Verification = () => {
  // Static data for demonstration
  const staticReports = [
    {
      _id: "68cae59745c44f4e96974323",
      title: "Street – 17 Sept 2025, 22:15",
      category: "Street",
      videoUrl: "https://res.cloudinary.com/dbe3m3hcw/video/upload/v1758127512/report-videos/tbtczvo7i4f6hlu2bicn.webm",
      thumbnail: "https://i.imgur.com/7S7qz6g.jpeg",
      verifications: 4,
      createdBy: {
        _id: "68c8223bddbfa54bbe17c0c5",
        name: "ANKEET KUMAR SAH",
        email: "ankeetkumar7777@gmail.com"
      },
      progress: {
        reported: {
          completed: true,
          date: "2025-09-17T16:45:11.392Z"
        },
        verified: {
          date: null,
          completed: false
        },
        inProgress: {
          date: null,
          completed: false
        },
        resolved: {
          date: null,
          completed: false
        }
      },
      createdAt: "2025-09-17T16:45:11.409Z",
      location: {
        latitude: 19.04851386419611,
        longitude: 83.83460154796187
      }
    },
    {
      _id: "68cae5ca45c44f4e96974326",
      title: "Water – 17 Sept 2025, 22:15",
      category: "Water",
      videoUrl: "https://res.cloudinary.com/dbe3m3hcw/video/upload/v1758127562/report-videos/rfgmqlewjrm7w2hgqd27.webm",
      thumbnail: "https://i.imgur.com/7S7qz6g.jpeg",
      verifications: 0,
      createdBy: {
        _id: "68c8223bddbfa54bbe17c0c5",
        name: "RAHUL SHARMA",
        email: "rahul@example.com"
      },
      progress: {
        reported: {
          completed: false,
          date: "2025-09-17T16:46:02.134Z"
        },
        verified: {
          date: null,
          completed: false
        },
        inProgress: {
          date: null,
          completed: false
        },
        resolved: {
          date: null,
          completed: false
        }
      },
      createdAt: "2025-09-17T16:46:02.135Z",
      location: {
        latitude: 19.04851386419611,
        longitude: 83.83460154796187
      }
    },
    {
      _id: "68cae5ca45c44f4e96974327",
      title: "Electricity – 17 Sept 2025, 22:20",
      category: "Electricity",
      videoUrl: "https://res.cloudinary.com/dbe3m3hcw/video/upload/v1758127562/report-videos/sample-electricity.webm",
      thumbnail: "https://i.imgur.com/7S7qz6g.jpeg",
      verifications: 8,
      createdBy: {
        _id: "68c8223bddbfa54bbe17c0c6",
        name: "PRIYA PATEL",
        email: "priya@example.com"
      },
      progress: {
        reported: {
          completed: true,
          date: "2025-09-17T16:50:02.134Z"
        },
        verified: {
          date: "2025-09-18T10:30:00.000Z",
          completed: true
        },
        inProgress: {
          date: null,
          completed: false
        },
        resolved: {
          date: null,
          completed: false
        }
      },
      createdAt: "2025-09-17T16:50:02.135Z",
      location: {
        latitude: 19.05851386419611,
        longitude: 83.84460154796187
      }
    }
  ];

  const [reports, setReports] = useState(staticReports);
  const [filteredReports, setFilteredReports] = useState(staticReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [playingVideo, setPlayingVideo] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // Get unique categories from reports
  const categories = [...new Set(reports.map(report => report.category))];

  // Filter and sort reports based on user selection
  useEffect(() => {
    let result = [...reports];
    
    if (searchTerm) {
      result = result.filter(report => 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "All") {
      result = result.filter(report => {
        const status = getStatusFromProgress(report.progress);
        return status === statusFilter;
      });
    }
    
    if (categoryFilter !== "All") {
      result = result.filter(report => report.category === categoryFilter);
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
    
    setFilteredReports(result);
  }, [searchTerm, statusFilter, categoryFilter, sortBy, sortOrder, reports]);

  // Determine status based on progress
  const getStatusFromProgress = (progress) => {
    if (progress.resolved.completed) return "Resolved";
    if (progress.inProgress.completed) return "In Progress";
    if (progress.verified.completed) return "Verified";
    return "Pending";
  };

  // Add status to each report based on progress
  const reportsWithStatus = filteredReports.map(report => ({
    ...report,
    status: getStatusFromProgress(report.progress),
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
    "Verified": <FaCheck className="text-purple-500" />,
    "In Progress": <FaExclamationTriangle className="text-yellow-500" />,
    "Resolved": <FaCheckCircle className="text-green-500" />
  };

  const handleVideoClick = (e, reportId) => {
    e.stopPropagation();
    setPlayingVideo(playingVideo === reportId ? null : reportId);
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

  // Handle verification (endorse) action
  const handleVerify = async (reportId) => {
    setVerifying(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the report's verification count
      setReports(prevReports => 
        prevReports.map(report => 
          report._id === reportId 
            ? { ...report, verifications: report.verifications + 1 }
            : report
        )
      );
      
      alert("Issue verified successfully!");
    } catch (error) {
      console.error("Error verifying issue:", error);
      alert("Failed to verify issue. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  // Handle mark as fake action
  const handleMarkAsFake = async (reportId) => {
    setVerifying(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove the report from the list
      setReports(prevReports => prevReports.filter(report => report._id !== reportId));
      
      alert("Issue marked as fake and removed from list!");
    } catch (error) {
      console.error("Error marking issue as fake:", error);
      alert("Failed to mark issue as fake. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  // Video Thumbnail Component
  const VideoThumbnail = ({ report, isPlaying, onClick }) => {
    return (
      <div className="relative w-full h-full group">
        {isPlaying ? (
          <video 
            src={report.videoUrl} 
            controls 
            className="w-full h-full object-cover rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div 
            className="w-full h-full bg-cover bg-center rounded-lg transition-all duration-300 group-hover:brightness-90"
            style={{ backgroundImage: `url(${report.thumbnail})` }}
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
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Community Issues Verification</h1>
        <p className="text-gray-600">Verify or report issues submitted by other community members</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
              <FaCheckCircle className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Issues</p>
              <h3 className="text-2xl font-bold">{reports.length}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center mr-4">
              <FaExclamationTriangle className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Verification</p>
              <h3 className="text-2xl font-bold">{reportsWithStatus.filter(r => r.status === "Pending").length}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mr-4">
              <FaCheck className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Verified Issues</p>
              <h3 className="text-2xl font-bold">{reportsWithStatus.filter(r => r.status === "Verified").length}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mr-4">
              <FaEye className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Verifications</p>
              <h3 className="text-2xl font-bold">
                {reports.length > 0 
                  ? Math.round(reportsWithStatus.reduce((sum, report) => sum + report.verifications, 0) / reports.length)
                  : 0}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
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
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
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
              className="border border-gray-300 rounded-lg px-3 py-2 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              <FaSort className="mr-1" />
              {sortOrder === "asc" ? "Asc" : "Desc"}
            </button>
            
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button 
                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-white'}`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
              <button 
                className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'bg-white'}`}
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
          <h2 className="text-lg font-semibold">
            {reportsWithStatus.length} Issue{reportsWithStatus.length !== 1 ? 's' : ''} Found
          </h2>
        </div>

        {viewMode === 'list' ? (
          /* List View */
          <div className="space-y-4">
            {reportsWithStatus.map(report => (
              <div 
                key={report._id} 
                className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Video Thumbnail/Player */}
                  <div className="relative md:w-1/3 h-40 rounded-lg overflow-hidden">
                    <VideoThumbnail 
                      report={report} 
                      isPlaying={playingVideo === report._id}
                      onClick={(e) => handleVideoClick(e, report._id)}
                    />
                  </div>
                  
                  {/* Report Details */}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{report.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[report.status]}`}>
                        {report.status}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                        {report.category}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                      <span className="flex items-center">
                        <FaMapMarkerAlt className="mr-1 text-gray-400" />
                        {getDistanceFromLocation(report.location.latitude, report.location.longitude)}
                      </span>
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-1 text-gray-400" />
                        {formatDate(report.createdAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <FaCheckCircle className="text-green-500 mr-1" />
                        <span>{report.verifications} verifications</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaEye className="text-gray-500 mr-1" />
                        <span>{report.views} views</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600 mb-3">
                      Reported by: <span className="font-medium">{report.createdBy.name}</span>
                    </div>

                    {/* Verification Buttons */}
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleVerify(report._id)}
                        disabled={verifying}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                      >
                        <FaThumbsUp />
                        Verify Issue
                      </button>
                      <button
                        onClick={() => handleMarkAsFake(report._id)}
                        disabled={verifying}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                      >
                        <FaBan />
                        Mark as Fake
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportsWithStatus.map(report => (
              <div 
                key={report._id} 
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Video Thumbnail/Player */}
                <div className="relative h-48">
                  <VideoThumbnail 
                    report={report} 
                    isPlaying={playingVideo === report._id}
                    onClick={(e) => handleVideoClick(e, report._id)}
                  />
                </div>
                
                {/* Report Details */}
                <div className="p-4 flex-grow">
                  <h4 className="font-medium text-gray-800 mb-2">{report.title}</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[report.status]}`}>
                      {report.status}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {report.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <FaMapMarkerAlt className="mr-1 text-gray-400" />
                    {getDistanceFromLocation(report.location.latitude, report.location.longitude)}
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500 mb-3">
                    <span className="flex items-center">
                      <FaCheckCircle className="text-green-500 mr-1" />
                      {report.verifications}
                    </span>
                    <span className="flex items-center">
                      <FaEye className="text-gray-500 mr-1" />
                      {report.views}
                    </span>
                    <span>{formatDate(report.createdAt)}</span>
                  </div>

                  <div className="text-xs text-gray-600 mb-3">
                    Reported by: <span className="font-medium">{report.createdBy.name}</span>
                  </div>

                  {/* Verification Buttons */}
                  <div className="flex flex-col gap-2 mt-2">
                    <button
                      onClick={() => handleVerify(report._id)}
                      disabled={verifying}
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors disabled:opacity-50"
                    >
                      <FaThumbsUp />
                      Verify
                    </button>
                    <button
                      onClick={() => handleMarkAsFake(report._id)}
                      disabled={verifying}
                      className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors disabled:opacity-50"
                    >
                      <FaBan />
                      Mark Fake
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {reportsWithStatus.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
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