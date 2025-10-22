import React, { useState, useEffect } from "react";

import { NavLink } from "react-router-dom";
import { useReports } from "../../hooks/tanstack/useReports";
import ActionGrid from "../../components/ActionGrid";
import RecentReports from "../../components/RecentReports";
import RecentBadges from "../../components/RecentBadges";
import DashboardStats from "../../components/DashboardStats";
const Dashboard = () => {
  const { data: reports = [], status, error } = useReports();
  console.log(reports);
  const [stats, setStats] = useState({
    reportsSubmitted: 0,
    issuesResolved: 0,
    verifications: 0,
    communityRank: "#0",
  });

  useEffect(() => {
    setStats({
      reportsSubmitted: reports.length,
      issuesResolved: 31,
      verifications: 127,
      communityRank: "#12",
    });
  }, [reports]);

  return (
    <div className="p-4 md:p-6 min-h-screen font-rozha text-gray-900">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-iceberg tracking-tight">
          Citizen Dashboard
        </h1>
        <p className=" text-gray-600 ">
          Track your civic contributions and impact
        </p>
      </header>

      {/* Top Stats Section */}
      <DashboardStats stats={stats} />

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

            <ActionGrid />
          </div>

          {/* Recent Reports */}
          <RecentReports />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Recent Badges */}
          <RecentBadges />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
