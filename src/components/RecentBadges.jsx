import React from "react";
import { FaCheckCircle, FaMedal, FaTrophy } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const RecentBadges = () => {
  const badges = [
    {
      name: "Verifier",
      gradient: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      icon: <FaCheckCircle />,
    },
    {
      name: "First Report",
      gradient: "from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700",
      icon: <FaMedal />,
    },
    {
      name: "Champion",
      gradient: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
      icon: <FaTrophy />,
    },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/40">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-xl text-gray-800 flex items-center font-iceberg">
          <span className="w-1.5 h-6 bg-amber-500 rounded-full mr-3"></span>
          Recent Badges
        </h3>

        <NavLink
          to="/user/badges"
          className="text-sm text-amber-600 font-semibold hover:text-amber-700 transition px-3 py-1 rounded-lg hover:bg-amber-50"
        >
          View All →
        </NavLink>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-3 gap-3">
        {badges.map((badge, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center p-4 rounded-xl bg-gradient-to-br ${badge.gradient} 
            shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200`}
          >
            <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center mb-2 shadow-md backdrop-blur-sm text-xl text-white">
              {badge.icon}
            </div>
            <p className="text-xs font-semibold text-white text-center font-iceberg">
              {badge.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentBadges;
