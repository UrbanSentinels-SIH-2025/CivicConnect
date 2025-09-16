import React, { useState, useRef, useEffect } from 'react';
import { FaFlag, FaCheckCircle, FaUsers, FaMedal, FaFilter, FaSort, FaSearch, FaEye, FaMapMarkerAlt, FaCalendarAlt, FaTimes, FaPlay, FaClock, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

const MyReports = () => {
  // Sample reports data based on the provided structure
  const [reports, setReports] = useState([
    {
      _id: "68c9c6b1cb6755b956e44e57",
      title: "Street – 17 Sept 2025, 01:50",
      category: "Street",
      status: "Pending",
      createdAt: "2025-09-16T20:21:05.907+00:00",
      location: {
        latitude: 19.048513983424947,
        longitude: 83.83460043809389
      },
      verifications: 3,
      views: 15,
      videoUrl: "https://res.cloudinary.com/dbe3m3hcw/video/upload/v1758054063/report-videos/iipn4d29dootnvgavphv.webm",
      thumbnail: "https://i.imgur.com/7S7qz6g.jpeg",
      progress: {
        reported: { date: "2025-09-16", completed: true },
        verified: { date: null, completed: false },
        inProgress: { date: null, completed: false },
        resolved: { date: null, completed: false }
      }
    },
    {
      _id: "68c9c6b1cb6755b956e44e58",
      title: "Garbage Pileup – 16 Sept 2025, 14:30",
      category: "Sanitation",
      status: "In Progress",
      createdAt: "2025-09-15T14:30:00.000+00:00",
      location: {
        latitude: 19.058713983424947,
        longitude: 83.84460043809389
      },
      verifications: 12,
      views: 48,
      videoUrl: "https://res.cloudinary.com/dbe3m3hcw/video/upload/v1758054063/report-video-2.mp4",
      thumbnail: "https://i.imgur.com/5JaJZ7Q.jpeg",
      progress: {
        reported: { date: "2025-09-15", completed: true },
        verified: { date: "2025-09-16", completed: true },
        inProgress: { date: "2025-09-17", completed: true },
        resolved: { date: null, completed: false }
      }
    },
    {
      _id: "68c9c6b1cb6755b956e44e59",
      title: "Streetlight Outage – 15 Sept 2025, 20:15",
      category: "Electrical",
      status: "Verified",
      createdAt: "2025-09-14T20:15:00.000+00:00",
      location: {
        latitude: 19.038513983424947,
        longitude: 83.82460043809389
      },
      verifications: 8,
      views: 32,
      videoUrl: "https://res.cloudinary.com/dbe3m3hcw/video/upload/v1758054063/report-video-3.mp4",
      thumbnail: "https://i.imgur.com/3GJYKWp.jpeg",
      progress: {
        reported: { date: "2025-09-14", completed: true },
        verified: { date: "2025-09-15", completed: true },
        inProgress: { date: null, completed: false },
        resolved: { date: null, completed: false }
      }
    },
    {
      _id: "68c9c6b1cb6755b956e44e60",
      title: "Water Logging – 14 Sept 2025, 11:20",
      category: "Drainage",
      status: "Resolved",
      createdAt: "2025-09-13T11:20:00.000+00:00",
      location: {
        latitude: 19.068513983424947,
        longitude: 83.85460043809389
      },
      verifications: 18,
      views: 72,
      videoUrl: "https://res.cloudinary.com/dbe3m3hcw/video/upload/v1758054063/report-video-4.mp4",
      thumbnail: "https://i.imgur.com/9L9ZQ2J.jpeg",
      progress: {
        reported: { date: "2025-09-13", completed: true },
        verified: { date: "2025-09-13", completed: true },
        inProgress: { date: "2025-09-14", completed: true },
        resolved: { date: "2025-09-15", completed: true }
      }
    },
    {
      _id: "68c9c6b1cb6755b956e44e61",
      title: "Road Damage – 13 Sept 2025, 09:45",
      category: "Infrastructure",
      status: "Pending",
      createdAt: "2025-09-12T09:45:00.000+00:00",
      location: {
        latitude: 19.028513983424947,
        longitude: 83.81460043809389
      },
      verifications: 5,
      views: 25,
      videoUrl: "https://res.cloudinary.com/dbe3m3hcw/video/upload/v1758054063/report-video-5.mp4",
      thumbnail: "https://i.imgur.com/8Q6QY7J.jpeg",
      progress: {
        reported: { date: "2025-09-12", completed: true },
        verified: { date: null, completed: false },
        inProgress: { date: null, completed: false },
        resolved: { date: null, completed: false }
      }
    }
  ]);

  const [filteredReports, setFilteredReports] = useState(reports);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [playingVideo, setPlayingVideo] = useState(null);
  const videoRefs = useRef({});

  // Get unique categories from reports
  const categories = [...new Set(reports.map(report => report.category))];

  // Filter and sort reports based on user selection
  useEffect(() => {
    let result = reports;
    
    if (searchTerm) {
      result = result.filter(report => 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "All") {
      result = result.filter(report => report.status === statusFilter);
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
      } else if (sortBy === "views") {
        return sortOrder === "asc" ? a.views - b.views : b.views - a.views;
      }
      return 0;
    });
    
    setFilteredReports(result);
  }, [searchTerm, statusFilter, categoryFilter, sortBy, sortOrder, reports]);

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
    // Simple mock function - in a real app, you'd calculate actual distance
    const distances = ["0.2 km away", "0.5 km away", "0.8 km away", "1.2 km away", "1.5 km away"];
    return distances[Math.floor(Math.random() * distances.length)];
  };

  const VideoThumbnail = ({ report, isPlaying, onClick }) => {
    return (
      <div className="relative w-full h-full group">
        {isPlaying ? (
          <video 
            ref={el => videoRefs.current[report._id] = el}
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

  // Progress Tracker Component (Flipkart-style)
  const ProgressTracker = ({ report }) => {
    const steps = [
      { key: 'reported', label: 'Reported', date: report.progress.reported.date },
      { key: 'verified', label: 'Verified', date: report.progress.verified.date },
      { key: 'inProgress', label: 'In Progress', date: report.progress.inProgress.date },
      { key: 'resolved', label: 'Resolved', date: report.progress.resolved.date }
    ];

    const currentStatusIndex = steps.findIndex(step => report.progress[step.key].completed && 
      (step.key === 'resolved' || !report.progress[steps[steps.indexOf(step) + 1]]?.completed));

    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          {steps.map((step, index) => (
            <div key={step.key} className="flex flex-col items-center relative">
              {/* Connection line */}
              {index > 0 && (
                <div 
                  className={`absolute h-0.5 w-full -left-1/2 top-3 -z-10 ${
                    index <= currentStatusIndex ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                ></div>
              )}
              
              {/* Step circle */}
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  report.progress[step.key].completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {report.progress[step.key].completed ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              
              {/* Step label */}
              <span className={`text-xs mt-1 font-medium ${
                index <= currentStatusIndex ? 'text-green-600' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
              
              {/* Date */}
              {step.date && (
                <span className="text-xs text-gray-400 mt-1">
                  {new Date(step.date).toLocaleDateString()}
                </span>
              )}
            </div>
          ))}
        </div>
        
        {/* Current status text */}
        <div className="text-center mt-3">
          <span className="text-sm font-medium text-gray-700">
            Current Status: <span className={statusColors[report.status].replace('bg-', 'text-')}>
              {report.status}
            </span>
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Video Reports</h1>
        <p className="text-gray-600">All issues you've reported through video submissions</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
              <FaFlag className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Reports</p>
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
              <p className="text-sm text-gray-500">In Progress</p>
              <h3 className="text-2xl font-bold">{reports.filter(r => r.status === "In Progress").length}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mr-4">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Resolved</p>
              <h3 className="text-2xl font-bold">{reports.filter(r => r.status === "Resolved").length}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mr-4">
              <FaUsers className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Verifications</p>
              <h3 className="text-2xl font-bold">
                {Math.round(reports.reduce((sum, report) => sum + report.verifications, 0) / reports.length)}
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
              placeholder="Search reports..."
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
              <option value="views">Sort by Views</option>
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
            {filteredReports.length} Report{filteredReports.length !== 1 ? 's' : ''} Found
          </h2>
        </div>

        {viewMode === 'list' ? (
          /* List View */
          <div className="space-y-4">
            {filteredReports.map(report => (
              <div 
                key={report._id} 
                className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedReport(report)}
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

                    {/* Progress Tracker */}
                    <ProgressTracker report={report} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map(report => (
              <div 
                key={report._id} 
                className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex flex-col"
                onClick={() => setSelectedReport(report)}
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

                  {/* Simplified Progress for Grid View */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Progress:</span>
                      <span className={`text-xs font-medium ${
                        report.status === "Resolved" ? "text-green-600" : 
                        report.status === "In Progress" ? "text-yellow-600" : 
                        report.status === "Verified" ? "text-purple-600" : "text-blue-600"
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          report.status === "Resolved" ? "bg-green-500" : 
                          report.status === "In Progress" ? "bg-yellow-500" : 
                          report.status === "Verified" ? "bg-purple-500" : "bg-blue-500"
                        }`}
                        style={{
                          width: report.status === "Resolved" ? "100%" : 
                                 report.status === "In Progress" ? "75%" : 
                                 report.status === "Verified" ? "50%" : "25%"
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredReports.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <FaFilter className="text-4xl text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-500">No reports found</h3>
            <p className="text-gray-400">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">{selectedReport.title}</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  onClick={() => setSelectedReport(null)}
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              {/* Video Player */}
              <div className="mb-6 rounded-lg overflow-hidden bg-gray-900">
                <video 
                  src={selectedReport.videoUrl} 
                  controls 
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                  <p className={`px-3 py-1 rounded-full text-sm inline-block ${statusColors[selectedReport.status]}`}>
                    {selectedReport.status}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                  <p className="font-medium">{selectedReport.category}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Date Reported</h3>
                  <p className="font-medium">{formatDate(selectedReport.createdAt)}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                  <p className="font-medium">{getDistanceFromLocation(selectedReport.location.latitude, selectedReport.location.longitude)}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Verifications</h3>
                  <p className="font-medium">{selectedReport.verifications}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Views</h3>
                  <p className="font-medium">{selectedReport.views}</p>
                </div>
              </div>

              {/* Progress Tracker in Modal */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Issue Progress</h3>
                <ProgressTracker report={selectedReport} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReports;