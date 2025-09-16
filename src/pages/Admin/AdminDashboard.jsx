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
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <FaExclamationTriangle className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Issues</p>
            <p className="text-2xl font-bold">{stats.totalIssues}</p>
            <p className="text-xs text-gray-500 mt-1">+12% from last week</p>
          </div>
        </div>

        {/* Resolved Issues */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <FaCheckCircle className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Resolved</p>
            <p className="text-2xl font-bold">{stats.resolvedIssues}</p>
            <p className="text-xs text-green-600 mt-1">
              {((stats.resolvedIssues / stats.totalIssues) * 100).toFixed(1)}% resolution rate
            </p>
          </div>
        </div>

        {/* Pending Issues */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <FaClock className="text-yellow-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-2xl font-bold">{stats.pendingIssues}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.highPriority} high priority</p>
          </div>
        </div>

        {/* Average Resolution Time */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <FaChartLine className="text-purple-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Avg. Resolution</p>
            <p className="text-2xl font-bold">{stats.avgResolutionTime} days</p>
            <p className="text-xs text-gray-500 mt-1">Target: 2.0 days</p>
          </div>
        </div>
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Active Users */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-indigo-100 p-3 mr-4">
            <FaUsers className="text-indigo-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Active Users</p>
            <p className="text-2xl font-bold">{stats.activeUsers}</p>
            <p className="text-xs text-gray-500 mt-1">+8% from last month</p>
          </div>
        </div>

        {/* Departments */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-teal-100 p-3 mr-4">
            <FaBuilding className="text-teal-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Departments</p>
            <p className="text-2xl font-bold">{stats.departments}</p>
            <p className="text-xs text-gray-500 mt-1">Managing issues</p>
          </div>
        </div>

        {/* User Satisfaction */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-pink-100 p-3 mr-4">
            <FaThumbsUp className="text-pink-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Satisfaction Rate</p>
            <p className="text-2xl font-bold">{stats.userSatisfaction}/5</p>
            <p className="text-xs text-gray-500 mt-1">Based on 234 reviews</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Activity */}
        <div className="lg:col-span-2">
          {/* Recent Issues */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Recent Issues</h3>
              <button className="text-sm text-blue-600 font-medium">View All</button>
            </div>
            
            <div className="space-y-4">
              {/* Issue Item */}
              <div className="flex items-center justify-between p-3 border-l-4 border-yellow-500 bg-yellow-50 rounded">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                    <FaExclamationTriangle className="text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Pothole on Main Street</h4>
                    <p className="text-sm text-gray-500">Reported 2 hours ago • High Priority</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>
              </div>
              
              {/* Issue Item */}
              <div className="flex items-center justify-between p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <FaTools className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Water Leakage in Sector 7</h4>
                    <p className="text-sm text-gray-500">Reported 5 hours ago • Medium Priority</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">In Progress</span>
              </div>
              
              {/* Issue Item */}
              <div className="flex items-center justify-between p-3 border-l-4 border-green-500 bg-green-50 rounded">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <FaCheckCircle className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Garbage Pileup in Market Area</h4>
                    <p className="text-sm text-gray-500">Resolved today • 12 verifications</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Resolved</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                <FaExclamationTriangle className="text-blue-600 text-xl mb-2" />
                <span className="text-sm">Priority Issues</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition">
                <FaCheckCircle className="text-green-600 text-xl mb-2" />
                <span className="text-sm">Verify Resolution</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
                <FaChartLine className="text-purple-600 text-xl mb-2" />
                <span className="text-sm">Generate Report</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition">
                <FaAward className="text-yellow-600 text-xl mb-2" />
                <span className="text-sm">Reward Users</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Department Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Department Performance</h3>
              <button className="text-sm text-blue-600 font-medium">View Details</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Public Works</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Sanitation</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Water Department</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Electricity</span>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-4">System Status</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">API Services</span>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Operational</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Database</span>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Operational</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">AI Services</span>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Operational</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm">Notification System</span>
                </div>
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">Degraded</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;