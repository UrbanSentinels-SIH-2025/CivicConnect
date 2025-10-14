import React from "react";
import { FaFlag, FaCheckCircle, FaUsers, FaMedal } from "react-icons/fa";
import Dashboard from "../pages/users/Dashboard";

const DashboardStats = ({ stats }) => {
  const cards = [
    {
      title: "Reports Submitted",
      icon: <FaFlag className="text-white text-2xl" />,
      color: "from-blue-600 to-blue-700",
      borderGlow: "hover:border-blue-400 hover:shadow-[0_0_20px_#3b82f6]",
      value: stats.reportsSubmitted || 0,
    
    },
    {
      title: "Issues Resolved",
      icon: <FaCheckCircle className="text-white text-2xl" />,
      color: "from-green-600 to-green-700",
      borderGlow: "hover:border-green-400 hover:shadow-[0_0_20px_#22c55e]",
      value: stats.issuesResolved || 0,
      
    },
    {
      title: "Verifications",
      icon: <FaUsers className="text-white text-2xl" />,
      color: "from-purple-600 to-purple-700",
      borderGlow: "hover:border-purple-400 hover:shadow-[0_0_20px_#a855f7]",
      value: stats.verifications || 0,

    },
    {
      title: "Community Rank",
      icon: <FaMedal className="text-white text-2xl" />,
      color: "from-amber-500 to-amber-600",
      borderGlow: "hover:border-amber-300 hover:shadow-[0_0_20px_#fbbf24]",
      value: stats.communityRank || 0,
      
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${card.color} rounded-2xl shadow-xl p-3 flex items-center text-white
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
  );
};

export default DashboardStats;
