import React from 'react';
import { FaFlag, FaCheckCircle, FaUsers, FaMedal } from 'react-icons/fa';

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="quick-action-btn">
                <i className="fas fa-camera text-2xl text-blue-500 mb-2"></i>
                <span className="text-sm">Report Issue</span>
              </div>
              <div className="quick-action-btn">
                <i className="fas fa-check-circle text-2xl text-green-500 mb-2"></i>
                <span className="text-sm">Verify Issues</span>
              </div>
              <div className="quick-action-btn">
                <i className="fas fa-map-marked-alt text-2xl text-purple-500 mb-2"></i>
                <span className="text-sm">View Map</span>
              </div>
            </div>
          </div>

          {/* Recent Issues Map */}
          <div className="card mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Issues Near You</h3>
              <button className="text-sm text-blue-600 font-medium">View All</button>
            </div>
            <div className="map-container">
              <div className="text-center py-8">
                <i className="fas fa-map-marker-alt text-3xl text-gray-400 mb-2"></i>
                <p className="text-gray-500">Interactive map showing issues near your location</p>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                  <i className="fas fa-location-arrow mr-1"></i> View Full Map
                </button>
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
                    <i className="fas fa-check-circle text-green-500 mr-1"></i>
                    <span>12 verifications</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-eye mr-1 text-gray-500"></i>
                    <span>45 views</span>
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
                    <i className="fas fa-check-circle text-green-500 mr-1"></i>
                    <span>23 verifications</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-eye mr-1 text-gray-500"></i>
                    <span>78 views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Notifications</h3>
              <button className="text-sm text-blue-600 font-medium">Clear All</button>
            </div>
            
            <div className="space-y-3">
              <div className="notification-item unread p-3 rounded-lg">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="fas fa-check-circle text-blue-500 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm">Your report <span className="font-medium">"Pothole on Main Road"</span> has been verified by 5 more citizens.</p>
                    <p className="text-xs text-gray-500">30 minutes ago</p>
                  </div>
                </div>
              </div>
              
              <div className="notification-item p-3 rounded-lg">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="fas fa-truck text-green-500 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm">Municipal team has been dispatched to address <span className="font-medium">"Garbage Pileup in Sector 5"</span>.</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                      <i className="fas fa-check text-green-600 text-xs"></i>
                    </button>
                    <button className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                      <i className="fas fa-times text-red-600 text-xs"></i>
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
                      <i className="fas fa-check text-green-600 text-xs"></i>
                    </button>
                    <button className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                      <i className="fas fa-times text-red-600 text-xs"></i>
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
                  <i className="fas fa-check-circle text-blue-600"></i>
                </div>
                <p className="text-xs text-center">Verifier</p>
              </div>
              
              <div className="flex flex-col items-center p-2 bg-yellow-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mb-1">
                  <i className="fas fa-medal text-yellow-600"></i>
                </div>
                <p className="text-xs text-center">First Report</p>
              </div>
              
              <div className="flex flex-col items-center p-2 bg-green-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-1">
                  <i className="fas fa-trophy text-green-600"></i>
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