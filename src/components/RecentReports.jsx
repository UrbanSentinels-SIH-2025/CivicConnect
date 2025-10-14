import React from "react";
import { FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { NavLink } from "react-router-dom";
const RecentReports = () => {
  const reports = [
    {
      id: 1,
      title: "Pothole on Main Road",
      details: "Submitted 2 days ago • 1.2 km away",
      status: "In Progress",
      color: "amber",
      icon: <FaExclamationTriangle className="text-amber-600 text-xl" />,
    },
    {
      id: 2,
      title: "Garbage Pileup in Sector 5",
      details: "Submitted 5 days ago • 0.8 km away",
      status: "Resolved",
      color: "green",
      icon: <FaCheckCircle className="text-green-600 text-xl" />,
    },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/40">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl text-gray-800 flex items-center font-iceberg">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
          Your Recent Reports
        </h3>
        <NavLink to="/user/my-issues" className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition px-4 py-2 rounded-lg hover:bg-blue-50">
          View All →
        </NavLink>
      </div>

      {/* Report List */}
      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className={`flex items-center justify-between p-5 border-l-4 border-${report.color}-500 
              bg-gradient-to-r from-${report.color}-50 to-white rounded-xl 
              hover:shadow-lg transition-all duration-200 hover:translate-x-1`}
          >
            <div className="flex items-center">
              <div
                className={`w-12 h-12 rounded-xl bg-${report.color}-100 flex items-center justify-center mr-4 shadow-sm`}
              >
                {report.icon}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-base font-iceberg">
                  {report.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">{report.details}</p>
              </div>
            </div>
            <span
              className={`px-4 py-2 bg-${report.color}-100 text-${report.color}-700 text-sm rounded-full font-semibold shadow-sm font-iceberg`}
            >
              {report.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentReports;
