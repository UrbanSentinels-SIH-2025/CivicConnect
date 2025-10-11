import React, { useState, useEffect } from 'react';
import { 
  FaFlag, 
  FaCheckCircle, 
  FaUsers, 
  FaMedal, 
  FaCamera, 
  FaCheck, 
  FaTimes, 
  FaTrophy,
  FaExclamationTriangle
} from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    reportsSubmitted: 0,
    issuesResolved: 0,
    verifications: 0,
    communityRank: '#0'
  });

  useEffect(() => {
    setStats({
      reportsSubmitted: 42,
      issuesResolved: 31,
      verifications: 127,
      communityRank: '#12'
    });
  }, []);

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gradient-to-br from-[#D9F3FF] via-[#EAF9FB] to-[#CBEFF1] font-rozha text-gray-900">
      
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 font-iceberg tracking-tight">
          Citizen Dashboard
        </h1>
        <p className="text-lg text-gray-600 mt-1">Track your civic contributions and impact</p>
      </header>

      {/* Top Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Card Template */}
        {[
          {
            title: "Reports Submitted",
            icon: <FaFlag className="text-white text-2xl" />,
            color: "from-blue-600 to-blue-700",
            borderGlow: "hover:border-blue-400 hover:shadow-[0_0_20px_#3b82f6]",
            value: stats.reportsSubmitted,
            subtext: "+5 this week"
          },
          {
            title: "Issues Resolved",
            icon: <FaCheckCircle className="text-white text-2xl" />,
            color: "from-green-600 to-green-700",
            borderGlow: "hover:border-green-400 hover:shadow-[0_0_20px_#22c55e]",
            value: stats.issuesResolved,
            subtext: `${((stats.issuesResolved / stats.reportsSubmitted) * 100).toFixed(1)}% success rate`
          },
          {
            title: "Verifications",
            icon: <FaUsers className="text-white text-2xl" />,
            color: "from-purple-600 to-purple-700",
            borderGlow: "hover:border-purple-400 hover:shadow-[0_0_20px_#a855f7]",
            value: stats.verifications,
            subtext: "Community contributions"
          },
          {
            title: "Community Rank",
            icon: <FaMedal className="text-white text-2xl" />,
            color: "from-amber-500 to-amber-600",
            borderGlow: "hover:border-amber-300 hover:shadow-[0_0_20px_#fbbf24]",
            value: stats.communityRank,
            subtext: "Top contributor"
          }
        ].map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.color} rounded-2xl shadow-xl p-6 flex items-center text-white 
              transform hover:scale-105 transition-all duration-300 border border-transparent ${card.borderGlow}`}
          >
            <div className="rounded-full bg-white/30 p-4 mr-4 backdrop-blur-sm">
              {card.icon}
            </div>
            <div>
              <p className="text-sm opacity-90 font-medium font-iceberg">{card.title}</p>
              <p className="text-3xl font-bold mt-1">{card.value}</p>
              <p className="text-xs opacity-80 mt-2">{card.subtext}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/40">
            <h3 className="font-bold text-xl text-gray-800 mb-5 flex items-center font-iceberg">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { title: "Report Issue", color: "from-blue-500 to-blue-600", icon: <FaCamera /> },
                { title: "Verify Issues", color: "from-green-500 to-green-600", icon: <FaCheckCircle /> }
              ].map((action, idx) => (
                <div key={idx}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl cursor-pointer
                    bg-gradient-to-br ${action.color} text-white hover:from-${action.color.split(' ')[0]} 
                    hover:to-${action.color.split(' ')[1]} transition-all duration-300 
                    hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]`}
                >
                  <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center mb-3 shadow-lg backdrop-blur-sm">
                    {action.icon}
                  </div>
                  <span className="text-lg font-semibold">{action.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/40">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-gray-800 flex items-center font-iceberg">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
                Your Recent Reports
              </h3>
              <button className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition px-4 py-2 rounded-lg hover:bg-blue-50">
                View All →
              </button>
            </div>

            <div className="space-y-4">
              {/* In Progress */}
              <div className="flex items-center justify-between p-5 border-l-4 border-amber-500 bg-gradient-to-r from-amber-50 to-white rounded-xl hover:shadow-lg transition-all duration-200 hover:translate-x-1">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mr-4 shadow-sm">
                    <FaExclamationTriangle className="text-amber-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-base font-iceberg">Pothole on Main Road</h4>
                    <p className="text-sm text-gray-600 mt-1">Submitted 2 days ago • 1.2 km away</p>
                  </div>
                </div>
                <span className="px-4 py-2 bg-amber-100 text-amber-700 text-sm rounded-full font-semibold shadow-sm font-iceberg">
                  In Progress
                </span>
              </div>

              {/* Resolved */}
              <div className="flex items-center justify-between p-5 border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-white rounded-xl hover:shadow-lg transition-all duration-200 hover:translate-x-1">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mr-4 shadow-sm">
                    <FaCheckCircle className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-base font-iceberg">Garbage Pileup in Sector 5</h4>
                    <p className="text-sm text-gray-600 mt-1">Submitted 5 days ago • 0.8 km away</p>
                  </div>
                </div>
                <span className="px-4 py-2 bg-green-100 text-green-700 text-sm rounded-full font-semibold shadow-sm font-iceberg">
                  Resolved
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Verification Requests */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/40">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-xl text-gray-800 flex items-center font-iceberg">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
                Verification Requests
              </h3>
              <button className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition px-3 py-1 rounded-lg hover:bg-blue-50">
                View All →
              </button>
            </div>

            {[ 
              { title: "Streetlight outage", verifications: 3 },
              { title: "Park maintenance needed", verifications: 5 }
            ].map((req, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200 mb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800 font-iceberg">{req.title}</h4>
                    <p className="text-xs text-gray-600 mt-1.5">1.2 km from you • {req.verifications} verifications</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md">
                      <FaCheck className="text-white text-sm" />
                    </button>
                    <button className="w-9 h-9 rounded-lg bg-red-500 flex items-center justify-center hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md">
                      <FaTimes className="text-white text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Badges */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/40">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-xl text-gray-800 flex items-center font-iceberg">
                <span className="w-1.5 h-6 bg-amber-500 rounded-full mr-3"></span>
                Recent Badges
              </h3>
              <button className="text-sm text-amber-600 font-semibold hover:text-amber-700 transition px-3 py-1 rounded-lg hover:bg-amber-50">
                View All →
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Verifier", color: "from-blue-500 to-blue-600", icon: <FaCheckCircle /> },
                { name: "First Report", color: "from-amber-500 to-amber-600", icon: <FaMedal /> },
                { name: "Champion", color: "from-green-500 to-green-600", icon: <FaTrophy /> }
              ].map((badge, idx) => (
                <div key={idx} className={`flex flex-col items-center p-4 rounded-xl bg-gradient-to-br ${badge.color} shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200`}>
                  <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center mb-2 shadow-md backdrop-blur-sm">
                    {badge.icon}
                  </div>
                  <p className="text-xs font-semibold text-white text-center font-iceberg">{badge.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
