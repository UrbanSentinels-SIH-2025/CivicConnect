import React, { useState, useEffect } from 'react';
import { 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaClock, 
  FaChartLine,
  FaUsers,
  FaMapMarkerAlt,
  FaBuilding,
  FaAward,
  FaEye,
  FaThumbsUp,
  FaTools
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalIssues: 0,
    resolvedIssues: 0,
    pendingIssues: 0,
    avgResolutionTime: 0,
    userSatisfaction: 0,
    activeUsers: 0,
    departments: 0,
    highPriority: 0
  });

  // Sample data - replace with API calls
  useEffect(() => {
    // Simulate API fetch
    setStats({
      totalIssues: 1247,
      resolvedIssues: 893,
      pendingIssues: 354,
      avgResolutionTime: 2.5, // days
      userSatisfaction: 4.2, // out of 5
      activeUsers: 842,
      departments: 8,
      highPriority: 47
    });
  }, []);

  return (
   <div className="p-6 min-h-screen bg-gradient-to-b from-blue-50 to-blue-200
">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of civic issue reporting and resolution system</p>
      </div>

      {/* Stats Cards */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  {/* Total Issues */}
  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-4 flex items-center text-white">
    <div className="rounded-full bg-white/20 p-3 mr-4">
      <FaExclamationTriangle className="text-white text-xl" />
    </div>
    <div>
      <p className="text-sm opacity-80">Total Issues</p>
      <p className="text-2xl font-bold">{stats.totalIssues}</p>
      <p className="text-xs opacity-80 mt-1">+12% from last week</p>
    </div>
  </div>

  {/* Resolved Issues */}
  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-4 flex items-center text-white">
    <div className="rounded-full bg-white/20 p-3 mr-4">
      <FaCheckCircle className="text-white text-xl" />
    </div>
    <div>
      <p className="text-sm opacity-80">Resolved</p>
      <p className="text-2xl font-bold">{stats.resolvedIssues}</p>
      <p className="text-xs mt-1">
        {((stats.resolvedIssues / stats.totalIssues) * 100).toFixed(1)}% resolution rate
      </p>
    </div>
  </div>

  {/* Pending Issues */}
  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg shadow p-4 flex items-center text-black">
    <div className="rounded-full bg-black/10 p-3 mr-4">
      <FaClock className="text-white text-xl" />
    </div>
    <div>
      <p className="text-sm opacity-80">Pending</p>
      <p className="text-2xl font-bold">{stats.pendingIssues}</p>
      <p className="text-xs opacity-80 mt-1">{stats.highPriority} high priority</p>
    </div>
  </div>

  {/* Average Resolution Time */}
  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-4 flex items-center text-white">
    <div className="rounded-full bg-white/20 p-3 mr-4">
      <FaChartLine className="text-white text-xl" />
    </div>
    <div>
      <p className="text-sm opacity-80">Avg. Resolution</p>
      <p className="text-2xl font-bold">{stats.avgResolutionTime} days</p>
      <p className="text-xs opacity-80 mt-1">Target: 2.0 days</p>
    </div>
  </div>
</div>


    {/* Second Row Stats */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  {/* Reported Issues */}
  <div className="bg-white rounded-lg shadow p-4 flex items-center">
    <div className="rounded-full bg-yellow-100 p-3 mr-4">
      <FaExclamationTriangle className="text-yellow-600 text-xl" />
    </div>
    <div>
      <p className="text-gray-500 text-sm">Reported Issues</p>
      <p className="text-2xl font-bold">{stats.reportedIssues}</p>
      <p className="text-xs text-gray-500 mt-1">+15 new this week</p>
    </div>
  </div>

  {/* Resolved Cases */}
  <div className="bg-white rounded-lg shadow p-4 flex items-center">
    <div className="rounded-full bg-green-100 p-3 mr-4">
      <FaCheckCircle className="text-green-600 text-xl" />
    </div>
    <div>
      <p className="text-gray-500 text-sm">Resolved Cases</p>
      <p className="text-2xl font-bold">{stats.resolvedCases}</p>
      <p className="text-xs text-gray-500 mt-1">+12% efficiency rate</p>
    </div>
  </div>

  {/* Pending Approvals */}
  <div className="bg-white rounded-lg shadow p-4 flex items-center">
    <div className="rounded-full bg-red-100 p-3 mr-4">
      <FaClock className="text-red-600 text-xl" />
    </div>
    <div>
      <p className="text-gray-500 text-sm">Pending Approvals</p>
      <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
      <p className="text-xs text-gray-500 mt-1">Awaiting admin action</p>
    </div>
  </div>
</div>


      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Left Column - Recent Activity */}
  <div className="lg:col-span-2">
    {/* Recent Issues */}
    <div className="bg-gradient-to-r from-indigo-50 to-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-indigo-700">Recent Issues</h3>
        <button className="text-sm text-indigo-600 font-medium hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {/* Issue Item */}
        <div className="flex items-center justify-between p-3 border-l-4 border-yellow-500 bg-yellow-100/70 rounded-lg hover:shadow-md transition">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
              <FaExclamationTriangle className="text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800">
                Pothole on Main Street
              </h4>
              <p className="text-sm text-yellow-700">
                Reported 2 hours ago • High Priority
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-800 text-xs rounded-full font-medium">
            Pending
          </span>
        </div>

        {/* Issue Item */}
        <div className="flex items-center justify-between p-3 border-l-4 border-blue-500 bg-blue-100/70 rounded-lg hover:shadow-md transition">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
              <FaTools className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-800">
                Water Leakage in Sector 7
              </h4>
              <p className="text-sm text-blue-700">
                Reported 5 hours ago • Medium Priority
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-800 text-xs rounded-full font-medium">
            In Progress
          </span>
        </div>

        {/* Issue Item */}
        <div className="flex items-center justify-between p-3 border-l-4 border-green-500 bg-green-100/70 rounded-lg hover:shadow-md transition">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
              <FaCheckCircle className="text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-green-800">
                Garbage Pileup in Market Area
              </h4>
              <p className="text-sm text-green-700">
                Resolved today • 12 verifications
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-green-500/20 text-green-800 text-xs rounded-full font-medium">
            Resolved
          </span>
        </div>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="bg-gradient-to-r from-white to-indigo-50 rounded-xl shadow-lg p-6">
      <h3 className="font-semibold text-lg text-indigo-700 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="flex flex-col items-center justify-center p-4 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 hover:scale-105 transition transform">
          <FaExclamationTriangle className="text-xl mb-2" />
          <span className="text-sm font-medium">Priority Issues</span>
        </button>
        <button className="flex flex-col items-center justify-center p-4 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 hover:scale-105 transition transform">
          <FaCheckCircle className="text-xl mb-2" />
          <span className="text-sm font-medium">Verify Resolution</span>
        </button>
        <button className="flex flex-col items-center justify-center p-4 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 hover:scale-105 transition transform">
          <FaChartLine className="text-xl mb-2" />
          <span className="text-sm font-medium">Generate Report</span>
        </button>
        <button className="flex flex-col items-center justify-center p-4 bg-yellow-100 text-yellow-700 rounded-xl hover:bg-yellow-200 hover:scale-105 transition transform">
          <FaAward className="text-xl mb-2" />
          <span className="text-sm font-medium">Reward Users</span>
        </button>
      </div>
    </div>
  </div>

  {/* Right Column */}
  <div className="space-y-6">
    {/* Department Performance */}
    <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-blue-700">Department Performance</h3>
        <button className="text-sm text-blue-600 font-medium hover:underline">
          View Details
        </button>
      </div>

      <div className="space-y-4">
        {[
          { name: "Public Works", percent: 92, color: "bg-green-500" },
          { name: "Sanitation", percent: 85, color: "bg-blue-500" },
          { name: "Water Department", percent: 78, color: "bg-yellow-500" },
          { name: "Electricity", percent: 65, color: "bg-red-500" },
        ].map((dept, idx) => (
          <div key={idx}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{dept.name}</span>
              <span className="text-sm font-semibold text-gray-700">
                {dept.percent}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${dept.color} h-2 rounded-full`}
                style={{ width: `${dept.percent}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* System Status */}
    <div className="bg-gradient-to-r from-white to-green-50 rounded-xl shadow-lg p-6">
      <h3 className="font-semibold text-lg text-green-700 mb-4">System Status</h3>

      <div className="space-y-3">
        {[
          { name: "API Services", status: "Operational", color: "green" },
          { name: "Database", status: "Operational", color: "green" },
          { name: "AI Services", status: "Operational", color: "green" },
          { name: "Notification System", status: "Degraded", color: "yellow" },
        ].map((sys, idx) => (
          <div className="flex items-center justify-between" key={idx}>
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full bg-${sys.color}-500 mr-2`}
              ></div>
              <span className="text-sm font-medium">{sys.name}</span>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                sys.color === "green"
                  ? "text-green-700 bg-green-100"
                  : "text-yellow-700 bg-yellow-100"
              }`}
            >
              {sys.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default AdminDashboard;