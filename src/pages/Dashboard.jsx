import React from 'react';
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
  FaMapMarkerAlt
} from 'react-icons/fa';

const Dashboard = () => {
  // Sample data - replace with actual data from your API
  const statsData = {
    reportsSubmitted: 42,
    issuesResolved: 31,
    verifications: 127,
    communityRank: '#12'
  };

  return (
    <div className="p-2 md:p-3">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Reports Submitted Card */}
        <div className="stats-card card border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
              <FaFlag className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Reports Submitted</p>
              <h3 className="text-2xl font-bold">{statsData.reportsSubmitted}</h3>
            </div>
          </div>
        </div>
        
        {/* Issues Resolved Card */}
        <div className="stats-card card border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mr-4">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Issues Resolved</p>
              <h3 className="text-2xl font-bold">{statsData.issuesResolved}</h3>
            </div>
          </div>
        </div>
        
        {/* Verifications Card */}
        <div className="stats-card card border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mr-4">
              <FaUsers className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Verifications</p>
              <h3 className="text-2xl font-bold">{statsData.verifications}</h3>
            </div>
          </div>
        </div>
        
        {/* Community Rank Card */}
        <div className="stats-card card border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center mr-4">
              <FaMedal className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Community Rank</p>
              <h3 className="text-2xl font-bold">{statsData.communityRank}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2">
          {/* Quick Actions */}
          <div className="card mb-6">
            <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="quick-action-btn">
                <FaCamera className="text-2xl text-blue-500 mb-2" />
                <span className="text-sm">Report Issue</span>
              </div>
              <div className="quick-action-btn">
                <FaCheckCircle className="text-2xl text-green-500 mb-2" />
                <span className="text-sm">Verify Issues</span>
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Your Recent Reports</h3>
              <button className="text-sm text-blue-600 font-medium">View All</button>
            </div>
            
            <div className="space-y-4">
              {/* Report Item */}
              <div className="issue-card card border-l-4 border-yellow-500">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">Pothole on Main Road</h4>
                    <p className="text-sm text-gray-500">Submitted 2 days ago • 1.2 km away</p>
                  </div>
                  <span className="status-badge status-progress">In Progress</span>
                </div>
                <div className="mt-3 flex items-center text-sm">
                  <div className="flex items-center mr-4">
                    <FaCheckCircle className="text-green-500 mr-1" />
                    <span>12 verifications</span>
                  </div>
                 
                </div>
              </div>
              
              {/* Report Item */}
              <div className="issue-card card border-l-4 border-green-500">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">Garbage Pileup in Sector 5</h4>
                    <p className="text-sm text-gray-500">Submitted 5 days ago • 0.8 km away</p>
                  </div>
                  <span className="status-badge status-resolved">Resolved</span>
                </div>
                <div className="mt-3 flex items-center text-sm">
                  <div className="flex items-center mr-4">
                    <FaCheckCircle className="text-green-500 mr-1" />
                    <span>23 verifications</span>
                  </div>
                 
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Verification Requests */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Verification Requests</h3>
              <button className="text-sm text-blue-600 font-medium">View All</button>
            </div>
            
            <div className="space-y-3">
              <div className="verification-item p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">Streetlight outage</h4>
                    <p className="text-xs text-gray-500">0.8 km from you • 3 verifications</p>
                  </div>
                  <div className="flex space-x-1">
                    <button className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                      <FaCheck className="text-green-600 text-xs" />
                    </button>
                    <button className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                      <FaTimes className="text-red-600 text-xs" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="verification-item p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">Park maintenance needed</h4>
                    <p className="text-xs text-gray-500">1.2 km from you • 5 verifications</p>
                  </div>
                  <div className="flex space-x-1">
                    <button className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                      <FaCheck className="text-green-600 text-xs" />
                    </button>
                    <button className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                      <FaTimes className="text-red-600 text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Badges */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Recent Badges</h3>
              <button className="text-sm text-blue-600 font-medium">View All</button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center p-2 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                  <FaCheckCircle className="text-blue-600" />
                </div>
                <p className="text-xs text-center">Verifier</p>
              </div>
              
              <div className="flex flex-col items-center p-2 bg-yellow-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mb-1">
                  <FaMedal className="text-yellow-600" />
                </div>
                <p className="text-xs text-center">First Report</p>
              </div>
              
              <div className="flex flex-col items-center p-2 bg-green-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-1">
                  <FaTrophy className="text-green-600" />
                </div>
                <p className="text-xs text-center">Champion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;