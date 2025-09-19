import React, { useState, useEffect } from 'react';
import { 
  FaFlag, 
  FaCheckCircle, 
  FaUsers, 
  FaMedal, 
  FaCamera, 
  FaCheck, 
  FaTimes, 
  FaEye,
  FaTrophy,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaClock,
  FaChartLine
} from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    reportsSubmitted: 0,
    issuesResolved: 0,
    verifications: 0,
    communityRank: '#0',
    pendingReports: 0,
    highPriority: 0
  });

  // Sample data - replace with API calls
  useEffect(() => {
    // Simulate API fetch
    setStats({
      reportsSubmitted: 42,
      issuesResolved: 31,
      verifications: 127,
      communityRank: '#12',
      pendingReports: 8,
      highPriority: 3
    });
  }, []);

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Citizen Dashboard</h1>
        <p className="text-gray-600">Track your civic contributions and impact</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Reports Submitted */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaFlag className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Reports Submitted</p>
            <p className="text-2xl font-bold">{stats.reportsSubmitted}</p>
            <p className="text-xs opacity-80 mt-1">+5 this week</p>
          </div>
        </div>

        {/* Issues Resolved */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaCheckCircle className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Issues Resolved</p>
            <p className="text-2xl font-bold">{stats.issuesResolved}</p>
            <p className="text-xs opacity-80 mt-1">
              {((stats.issuesResolved / stats.reportsSubmitted) * 100).toFixed(1)}% success rate
            </p>
          </div>
        </div>

        {/* Verifications */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaUsers className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Verifications</p>
            <p className="text-2xl font-bold">{stats.verifications}</p>
            <p className="text-xs opacity-80 mt-1">Community contributions</p>
          </div>
        </div>

        {/* Community Rank */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaMedal className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Community Rank</p>
            <p className="text-2xl font-bold">{stats.communityRank}</p>
            <p className="text-xs opacity-80 mt-1">Top contributor</p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2">
          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-indigo-50 to-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="font-semibold text-lg text-indigo-700 mb-4">Quick Actions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Report Issue */}
              <div className="flex flex-col items-center justify-center p-5 rounded-xl cursor-pointer 
                bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 
                hover:from-blue-200 hover:to-blue-300 transition-all duration-300 hover:scale-[1.02]">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center mb-3 shadow-md">
                  <FaCamera className="text-white text-xl" />
                </div>
                <span className="text-base font-medium text-blue-800">Report Issue</span>
              </div>

              {/* Verify Issues */}
              <div className="flex flex-col items-center justify-center p-5 rounded-xl cursor-pointer 
                bg-gradient-to-r from-green-100 to-green-200 border border-green-300 
                hover:from-green-200 hover:to-green-300 transition-all duration-300 hover:scale-[1.02]">
                <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center mb-3 shadow-md">
                  <FaCheckCircle className="text-white text-xl" />
                </div>
                <span className="text-base font-medium text-green-800">Verify Issues</span>
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-gradient-to-r from-indigo-50 to-white rounded-xl shadow-lg p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg text-indigo-700">Your Recent Reports</h3>
              <button className="text-sm text-indigo-600 font-medium hover:underline transition">View All</button>
            </div>

            <div className="space-y-4">
              {/* Report Item - In Progress */}
              <div className="flex items-center justify-between p-4 border-l-4 border-yellow-500 bg-yellow-100/70 rounded-lg hover:shadow-md transition">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                    <FaExclamationTriangle className="text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-800">Pothole on Main Road</h4>
                    <p className="text-sm text-yellow-700">Submitted 2 days ago • 1.2 km away</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-800 text-xs rounded-full font-medium">
                  In Progress
                </span>
              </div>

              {/* Report Item - Resolved */}
              <div className="flex items-center justify-between p-4 border-l-4 border-green-500 bg-green-100/70 rounded-lg hover:shadow-md transition">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                    <FaCheckCircle className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800">Garbage Pileup in Sector 5</h4>
                    <p className="text-sm text-green-700">Submitted 5 days ago • 0.8 km away</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-800 text-xs rounded-full font-medium">
                  Resolved
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Verification Requests */}
          <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-blue-700">Verification Requests</h3>
              <button className="text-sm text-blue-600 font-medium hover:underline transition">View All</button>
            </div>

            <div className="space-y-4">
              {/* Request Item */}
              <div className="p-3 bg-blue-100/50 rounded-lg border border-blue-200 hover:bg-blue-200/50 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-blue-800">Streetlight outage</h4>
                    <p className="text-xs text-blue-700 mt-1">0.8 km from you • 3 verifications</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/30 transition">
                      <FaCheck className="text-green-600 text-sm" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center hover:bg-red-500/30 transition">
                      <FaTimes className="text-red-600 text-sm" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Request Item */}
              <div className="p-3 bg-blue-100/50 rounded-lg border border-blue-200 hover:bg-blue-200/50 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-blue-800">Park maintenance needed</h4>
                    <p className="text-xs text-blue-700 mt-1">1.2 km from you • 5 verifications</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/30 transition">
                      <FaCheck className="text-green-600 text-sm" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center hover:bg-red-500/30 transition">
                      <FaTimes className="text-red-600 text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Badges */}
          <div className="bg-gradient-to-r from-white to-yellow-50 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-yellow-700">Recent Badges</h3>
              <button className="text-sm text-yellow-600 font-medium hover:underline transition">View All</button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Verifier */}
              <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-b from-blue-100 to-blue-200 border border-blue-300 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mb-2 shadow-md">
                  <FaCheckCircle className="text-white text-lg" />
                </div>
                <p className="text-xs font-medium text-blue-800">Verifier</p>
              </div>

              {/* First Report */}
              <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-b from-yellow-100 to-yellow-200 border border-yellow-300 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 rounded-full bg-yellow-600 flex items-center justify-center mb-2 shadow-md">
                  <FaMedal className="text-white text-lg" />
                </div>
                <p className="text-xs font-medium text-yellow-800">First Report</p>
              </div>

              {/* Champion */}
              <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-b from-green-100 to-green-200 border border-green-300 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mb-2 shadow-md">
                  <FaTrophy className="text-white text-lg" />
                </div>
                <p className="text-xs font-medium text-green-800">Champion</p>
              </div>
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default Dashboard;