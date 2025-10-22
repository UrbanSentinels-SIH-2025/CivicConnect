import React, { useState, useRef, useEffect } from "react";
import {
  FaFlag,
  FaCheckCircle,
  FaUsers,
  FaMedal,
  FaFilter,
  FaSort,
  FaSearch,
  FaEye,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTimes,
  FaPlay,
  FaClock,
  FaCheck,
  FaExclamationTriangle,
  FaVideo,
  FaThumbsUp,
} from "react-icons/fa";
import { useReports } from "../../hooks/tanstack/useReports";

const MyReports = () => {
  const { data: reports = [], status, error } = useReports();

  const [filteredReports, setFilteredReports] = useState([]);
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
  const categories = [...new Set(reports.map((report) => report.category))];

  // FIXED: Safe calculation of total verifications
  const getTotalVerifications = (verifications) => {
    if (!verifications) return 0;

    const realCount = verifications.real?.length || 0;
    const fakeCount = verifications.fake?.length || 0;

    return realCount + fakeCount;
  };

  // FIXED: Safe access to verification arrays
  const getVerificationCounts = (verifications) => {
    if (!verifications) return { real: 0, fake: 0 };

    return {
      real: verifications.real?.length || 0,
      fake: verifications.fake?.length || 0,
    };
  };

  // Filter and sort reports based on user selection
  useEffect(() => {
    let result = [...reports];

    if (searchTerm) {
      result = result.filter(
        (report) =>
          report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (report) => getStatusFromProgress(report.progress) === statusFilter
      );
    }

    if (categoryFilter !== "All") {
      result = result.filter((report) => report.category === categoryFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "verifications") {
        const aVerifications = getTotalVerifications(a.verifications);
        const bVerifications = getTotalVerifications(b.verifications);
        return sortOrder === "asc"
          ? aVerifications - bVerifications
          : bVerifications - aVerifications;
      }
      return 0;
    });

    setFilteredReports(result);
  }, [searchTerm, statusFilter, categoryFilter, sortBy, sortOrder, reports]);

  // Determine status based on progress (updated to match your API structure)
  const getStatusFromProgress = (progress) => {
    if (!progress) return "Reported";

    if (progress.resolved?.completed) return "Resolved";
    if (progress.inProgress?.completed) return "In Progress";
    if (progress.verified?.completed) return "Verified";
    return "Reported";
  };

  // Add status and total verifications to each report (FIXED)
  const reportsWithStatus = filteredReports.map((report) => ({
    ...report,
    status: getStatusFromProgress(report.progress),
    totalVerifications: getTotalVerifications(report.verifications),
    verificationCounts: getVerificationCounts(report.verifications), // Add this for safe access
  }));

  const statusColors = {
    Reported: "bg-blue-100 text-blue-800",
    Verified: "bg-purple-100 text-purple-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    Resolved: "bg-green-100 text-green-800",
  };

  const statusIcons = {
    Reported: <FaClock className="text-blue-500" />,
    Verified: <FaCheck className="text-purple-500" />,
    "In Progress": <FaExclamationTriangle className="text-yellow-500" />,
    Resolved: <FaCheckCircle className="text-green-500" />,
  };

  const handleVideoClick = (e, reportId) => {
    e.stopPropagation();
    setPlayingVideo(playingVideo === reportId ? null : reportId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const VideoThumbnail = ({ report, isPlaying, onClick }) => {
    return (
      <div className="relative w-full h-full group">
        {isPlaying ? (
          <video
            ref={(el) => (videoRefs.current[report._id] = el)}
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

  // Progress Tracker Component (FIXED with safe access)
  const ProgressTracker = ({ report }) => {
    if (!report.progress) return null;

    const steps = [
      {
        key: "reported",
        label: "Reported",
        date: report.progress.reported?.date,
      },
      {
        key: "verified",
        label: "Verified",
        date: report.progress.verified?.date,
      },
      {
        key: "inProgress",
        label: "In Progress",
        date: report.progress.inProgress?.date,
      },
      {
        key: "resolved",
        label: "Resolved",
        date: report.progress.resolved?.date,
      },
    ];

    // Find the current active step
    const currentStatusIndex = steps.findIndex(
      (step) => report.progress[step.key]?.completed
    );

    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className="flex flex-col items-center relative flex-1"
            >
              {/* Connection line */}
              {index > 0 && (
                <div
                  className={`absolute h-0.5 w-full -left-1/2 top-3 -z-10 ${
                    index <= currentStatusIndex ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
              )}

              {/* Step circle */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  report.progress[step.key]?.completed
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {report.progress[step.key]?.completed ? (
                  <FaCheck className="w-3 h-3" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>

              {/* Step label */}
              <span
                className={`text-xs mt-1 font-medium text-center ${
                  index <= currentStatusIndex
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </span>

              {/* Date */}
              {step.date && (
                <span className="text-xs text-gray-400 mt-1 text-center">
                  {formatDate(step.date)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Current status text */}
        <div className="text-center mt-3">
          <span className="text-sm font-medium text-gray-700">
            Current Status:{" "}
            <span
              className={
                statusColors[report.status]
                  ?.replace("bg-", "text-")
                  .replace("100", "800") || "text-gray-600"
              }
            >
              {report.status}
            </span>
          </span>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center font-rozha">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 font-iceberg">
            Error Loading Reports
          </h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-iceberg"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 min-h-screen  font-rozha text-gray-900">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 font-iceberg tracking-tight">
          Your Video Reports
        </h1>
        <p className="text-gray-600">
          All issues you've reported through video submissions
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Reports */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 flex items-center text-white transform hover:scale-105 transition-all duration-300 border border-transparent hover:border-blue-400 hover:shadow-[0_0_20px_#3b82f6]">
          <div className="rounded-full bg-white/20 p-3 mr-4 backdrop-blur-sm">
            <FaFlag className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80 font-iceberg">Total Reports</p>
            <p className="text-2xl font-bold">{reports.length}</p>
            <p className="text-xs opacity-80 mt-1">Your contributions</p>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-4 flex items-center text-white transform hover:scale-105 transition-all duration-300 border border-transparent hover:border-yellow-400 hover:shadow-[0_0_20px_#eab308]">
          <div className="rounded-full bg-white/20 p-3 mr-4 backdrop-blur-sm">
            <FaExclamationTriangle className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80 font-iceberg">In Progress</p>
            <p className="text-2xl font-bold">
              {
                reportsWithStatus.filter((r) => r.status === "In Progress")
                  .length
              }
            </p>
            <p className="text-xs opacity-80 mt-1">Being addressed</p>
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-4 flex items-center text-white transform hover:scale-105 transition-all duration-300 border border-transparent hover:border-green-400 hover:shadow-[0_0_20px_#22c55e]">
          <div className="rounded-full bg-white/20 p-3 mr-4 backdrop-blur-sm">
            <FaCheckCircle className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80 font-iceberg">Resolved</p>
            <p className="text-2xl font-bold">
              {reportsWithStatus.filter((r) => r.status === "Resolved").length}
            </p>
            <p className="text-xs opacity-80 mt-1">Successfully fixed</p>
          </div>
        </div>

        {/* Avg. Verifications */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-4 flex items-center text-white transform hover:scale-105 transition-all duration-300 border border-transparent hover:border-purple-400 hover:shadow-[0_0_20px_#a855f7]">
          <div className="rounded-full bg-white/20 p-3 mr-4 backdrop-blur-sm">
            <FaUsers className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80 font-iceberg">
              Avg. Verifications
            </p>
            <p className="text-2xl font-bold">
              {reportsWithStatus.length > 0
                ? Math.round(
                    reportsWithStatus.reduce(
                      (sum, report) => sum + report.totalVerifications,
                      0
                    ) / reportsWithStatus.length
                  )
                : 0}
            </p>
            <p className="text-xs opacity-80 mt-1">Community support</p>
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
              placeholder="Search reports..."
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
              <option value="All">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="Verified">Verified</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-rozha"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
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

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                className={`px-3 py-2 text-sm ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-white hover:bg-gray-50"
                } transition font-rozha`}
                onClick={() => setViewMode("list")}
              >
                List
              </button>
              <button
                className={`px-3 py-2 text-sm ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-white hover:bg-gray-50"
                } transition font-rozha`}
                onClick={() => setViewMode("grid")}
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
          <h2 className="text-lg font-semibold text-gray-800 font-iceberg">
            {reportsWithStatus.length} Report
            {reportsWithStatus.length !== 1 ? "s" : ""} Found
          </h2>
        </div>

        {viewMode === "list" ? (
          /* List View */
          <div className="space-y-4">
            {reportsWithStatus.map((report) => (
              <div
                key={report._id}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-4 border-l-4 border-blue-500 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:translate-x-1"
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
                    <h4 className="font-medium text-gray-800 font-iceberg text-lg">
                      {report.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          statusColors[report.status] ||
                          "bg-gray-100 text-gray-800"
                        } font-iceberg`}
                      >
                        {report.status}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800 font-iceberg">
                        {report.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-1 text-gray-400" />
                        {formatDate(report.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <FaCheckCircle className="text-green-500 mr-1" />
                        <span>{report.totalVerifications} verifications</span>
                        <span className="text-xs text-gray-400 ml-1">
                          ({report.verificationCounts.real} real,{" "}
                          {report.verificationCounts.fake} fake)
                        </span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportsWithStatus.map((report) => (
              <div
                key={report._id}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 flex flex-col border border-white/40 transform hover:scale-105"
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
                  <h4 className="font-medium text-gray-800 mb-2 font-iceberg text-lg">
                    {report.title}
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        statusColors[report.status] ||
                        "bg-gray-100 text-gray-800"
                      } font-iceberg`}
                    >
                      {report.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800 font-iceberg">
                      {report.category}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500 mb-3">
                    <span className="flex items-center">
                      <FaCheckCircle className="text-green-500 mr-1" />
                      {report.totalVerifications}
                    </span>

                    <span>{formatDate(report.createdAt)}</span>
                  </div>

                  {/* Simplified Progress for Grid View */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500 font-iceberg">
                        Progress:
                      </span>
                      <span
                        className={`text-xs font-medium font-iceberg ${
                          report.status === "Resolved"
                            ? "text-green-600"
                            : report.status === "In Progress"
                            ? "text-yellow-600"
                            : report.status === "Verified"
                            ? "text-purple-600"
                            : "text-blue-600"
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          report.status === "Resolved"
                            ? "bg-green-500"
                            : report.status === "In Progress"
                            ? "bg-yellow-500"
                            : report.status === "Verified"
                            ? "bg-purple-500"
                            : "bg-blue-500"
                        }`}
                        style={{
                          width:
                            report.status === "Resolved"
                              ? "100%"
                              : report.status === "In Progress"
                              ? "75%"
                              : report.status === "Verified"
                              ? "50%"
                              : "25%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {reportsWithStatus.length === 0 && (
          <div className="text-center py-10 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/40">
            <FaFilter className="text-4xl text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-500 font-iceberg">
              No reports found
            </h3>
            <p className="text-gray-400">
              Try adjusting your filters or search term
            </p>
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-white to-blue-50 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/40">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800 font-iceberg">
                  {selectedReport.title}
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
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
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-500 mb-1 font-iceberg">
                    Status
                  </h3>
                  <p
                    className={`px-3 py-1 rounded-full text-sm inline-block ${
                      statusColors[selectedReport.status] ||
                      "bg-gray-100 text-gray-800"
                    } font-iceberg`}
                  >
                    {selectedReport.status}
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-500 mb-1 font-iceberg">
                    Category
                  </h3>
                  <p className="font-medium font-iceberg">
                    {selectedReport.category}
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-500 mb-1 font-iceberg">
                    Date Reported
                  </h3>
                  <p className="font-medium font-iceberg">
                    {formatDate(selectedReport.createdAt)}
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-500 mb-1 font-iceberg">
                    Verifications
                  </h3>
                  <p className="font-medium font-iceberg">
                    {selectedReport.totalVerifications} total
                    <span className="text-xs text-gray-600 ml-2">
                      ({selectedReport.verificationCounts.real} real,{" "}
                      {selectedReport.verificationCounts.fake} fake)
                    </span>
                  </p>
                </div>
              </div>

              {/* Progress Tracker in Modal */}
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="text-sm font-medium text-blue-500 mb-3 font-iceberg">
                  Issue Progress
                </h3>
                <ProgressTracker report={selectedReport} />
              </div>

              {/* Verification Details */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-500 mb-3 font-iceberg">
                  Verification Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-green-600 font-bold text-xl font-iceberg">
                      {selectedReport.verificationCounts.real}
                    </div>
                    <div className="text-sm text-gray-600 font-iceberg">
                      Real Verifications
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-600 font-bold text-xl font-iceberg">
                      {selectedReport.verificationCounts.fake}
                    </div>
                    <div className="text-sm text-gray-600 font-iceberg">
                      Fake Reports
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReports;
