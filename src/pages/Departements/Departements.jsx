import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import { getStatusCount } from "../../utils/statusHelper";
import { NavLink } from "react-router-dom";
import useDepartmentIssueStore from "../../store/departmentIssue";

const Departements = () => {
  const { departmentName } = useParams();
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [locationNames, setLocationNames] = useState({});
  
  const { 
    setDepartment, 
    departmentIssues, 
    updateIssueProgress 
  } = useDepartmentIssueStore();

  // Use departmentIssues from Zustand store instead of local state
  const issues = departmentIssues;
  
  // Filtered issues based on current filter
  const [filteredIssues, setFilteredIssues] = useState(departmentIssues);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/user-issue/department-issues/${departmentName}`
        );
        const issuesData = response.data.issues || response.data || [];
        setDepartment(issuesData);
        
        // Fetch location names for all issues
        fetchLocationNames(issuesData);
      } catch (error) {
        console.error("Error fetching department issues:", error);
      } finally {
        setLoading(false);
      }
    };

    if (departmentName) {
      fetchData();
    }
  }, [departmentName]);

  // Update filteredIssues when departmentIssues changes
  useEffect(() => {
    setFilteredIssues(departmentIssues);
    
    // Re-fetch location names when issues change
    if (departmentIssues.length > 0) {
      fetchLocationNames(departmentIssues);
    }
  }, [departmentIssues]);

  // Function to fetch location names for all issues
  const fetchLocationNames = async (issuesData) => {
    const names = {};
    
    const locationPromises = issuesData.map(async (issue) => {
      try {
        const name = await getLocationName(issue);
        names[issue._id] = name;
      } catch (error) {
        console.error(`Error fetching location for issue ${issue._id}:`, error);
        names[issue._id] = `${issue.location.latitude.toFixed(4)}, ${issue.location.longitude.toFixed(4)}`;
      }
    });

    await Promise.all(locationPromises);
    setLocationNames(names);
  };

  const statusCount = getStatusCount(issues);

  const filterIssuesByStatus = (status) => {
    return issues.filter((issue) => {
      const { progress } = issue;
      if (status === "pending") {
        return (
          progress?.verified?.completed &&
          !progress?.inProgress?.completed &&
          !progress?.resolved?.completed
        );
      } else if (status === "inProgress") {
        return (
          progress?.inProgress?.completed && !progress?.resolved?.completed
        );
      } else if (status === "resolved") {
        return progress?.resolved?.completed;
      }
      return false;
    });
  };

  const handleFilterChange = (e) => {
    const status = e.target.value;
    setActiveFilter(status);
    
    if (status === "all") {
      setFilteredIssues(issues);
    } else {
      setFilteredIssues(filterIssuesByStatus(status));
    }
  };

  const handleSortChange = (e) => {
    const order = e.target.value;
    setSortOrder(order);
    const sorted = [...filteredIssues].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return order === "newest" ? dateB - dateA : dateA - dateB;
    });
    setFilteredIssues(sorted);
  };

  const confirmStartWork = (issueId) => {
    setSelectedIssueId(issueId);
    setShowModal(true);
  };

  const handleStartWork = async (issueId) => {
    try {
      const payload = {
        id: issueId,
        progressStage: "inProgress",
      };

      const response = await api.patch(`/user-issue/department-issues/progress`, payload);
      
      // Update the issue progress in Zustand store
      updateIssueProgress(issueId, {
        inProgress: { 
          completed: true, 
          date: new Date().toISOString() 
        }
      });

      setShowModal(false);
      setSelectedIssueId(null);

    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedIssueId(null);
  };

  const getStatusBadge = (issue) => {
    if (issue.progress.resolved.completed) {
      return <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-200">Resolved</span>;
    } else if (issue.progress.inProgress.completed) {
      return <span className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium border border-yellow-200">In Progress</span>;
    } else if (issue.progress.verified.completed) {
      return <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200">Pending</span>;
    } else {
      return <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-xs font-medium border border-gray-200">Reported</span>;
    }
  };

  // Updated async function to get location name
  const getLocationName = async (issue) => {
    const { latitude, longitude } = issue.location;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      
      const data = await response.json();
      
      if (data && data.address) {
        return data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      }
      
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    } catch (error) {
      console.error('Error fetching location name:', error);
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  // Function to display location name with loading state
  const displayLocationName = (issue) => {
    if (!locationNames[issue._id]) {
      return "Loading location...";
    }
    return locationNames[issue._id];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {departmentName} Department
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage and resolve issues efficiently</p>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 bg-blue-50 px-3 py-2 rounded-lg">
              {filteredIssues.length} of {issues.length} issues shown
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-sm border border-blue-100/50 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-semibold text-gray-700">Total Issues</h2>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-lg">📋</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">{statusCount.totalIssues}</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-sm border border-blue-100/50 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-semibold text-gray-700">Pending</h2>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-lg">⏳</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">{statusCount.pending}</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-sm border border-yellow-100/50 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-semibold text-gray-700">In Progress</h2>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-lg">🔧</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-2">{statusCount.inProgress}</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-sm border border-green-100/50 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-semibold text-gray-700">Resolved</h2>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-lg">✅</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-2">{statusCount.resolved}</p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-sm border border-blue-100/50 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <select 
                onChange={handleFilterChange} 
                value={activeFilter}
                className="w-full sm:w-48 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm font-medium"
              >
                <option value="all">All Issues</option>
                <option value="pending">Pending</option>
                <option value="inProgress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              <select 
                onChange={handleSortChange} 
                value={sortOrder}
                className="w-full sm:w-48 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <div key={issue._id} className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100/50">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Video Section */}
                  {issue.videoUrl && (
                    <div className="flex-shrink-0 lg:w-64">
                      <div className="relative rounded-xl overflow-hidden shadow-md">
                        <video
                          src={issue.videoUrl}
                          className="w-full h-40 sm:h-48 object-cover"
                          controls
                          preload="metadata"
                        />
                      </div>
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 line-clamp-2">{issue.title}</h3>
                      <div className="flex-shrink-0">
                        {getStatusBadge(issue)}
                      </div>
                    </div>
                    
                    {/* Location Display */}
                    <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base mb-4">
                      <span className="text-gray-400">📍</span>
                      <span>{displayLocationName(issue)}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-xs sm:text-sm">
                      <div className="text-gray-500">
                        <span className="font-medium">Created:</span> {new Date(issue.createdAt).toLocaleDateString()}
                      </div>
                      {issue.progress.resolved.completed && (
                        <div className="text-green-600">
                          <span className="font-medium">Resolved:</span> {new Date(issue.progress.resolved.date).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Link 
                        to={`/department/${departmentName}/issue/${issue._id}`} 
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md flex items-center gap-2"
                      >
                        <span>👁️</span> View Details
                      </Link>
                      
                      {!issue.progress.inProgress.completed && !issue.progress.resolved.completed && (
                        <button
                          onClick={() => confirmStartWork(issue._id)}
                          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md flex items-center gap-2"
                        >
                          <span>🚀</span> Start Work
                        </button>
                      )}
                      
                      {issue.progress.inProgress.completed && !issue.progress.resolved.completed && (
                        <NavLink
                          to={`/department/${departmentName}/mark-as-complete/${issue._id}`}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md flex items-center gap-2"
                        >
                          <span>✅</span> Mark Resolved
                        </NavLink>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-blue-100/50 text-center">
              <div className="text-gray-300 mb-4">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg font-medium mb-2">No issues found</p>
              <p className="text-gray-500 text-sm mb-4">Try changing your filters to see more results</p>
              {activeFilter !== "all" && (
                <button
                  onClick={() => {
                    setActiveFilter("all");
                    setFilteredIssues(issues);
                  }}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                >
                  Show All Issues
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform animate-scaleIn">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-lg">⚠️</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Confirm Start Work</h2>
              </div>
              <p className="text-gray-600 mb-6">Are you sure you want to start working on this issue? This action will change the status to "In Progress".</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl transition duration-200 font-medium text-sm flex-1 sm:flex-none"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStartWork(selectedIssueId)}
                  className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition duration-200 font-medium text-sm flex-1 sm:flex-none shadow-sm hover:shadow-md"
                >
                  Start Work
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departements;