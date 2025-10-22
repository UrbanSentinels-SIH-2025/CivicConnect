import React, { useState, useEffect, useRef } from 'react';
import { 
  FaChartBar, 
  FaChartLine, 
  FaChartPie, 
  FaFilter,
  FaDownload,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaUsers,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt
} from 'react-icons/fa';
import Chart from 'chart.js/auto';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReports: 0,
    resolvedIssues: 0,
    avgResolutionTime: 0,
    userSatisfaction: 0,
    verificationRate: 0,
    departmentPerformance: 0
  });

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Sample data - replace with API calls
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setStats({
        totalReports: 2457,
        resolvedIssues: 1893,
        avgResolutionTime: 2.5,
        userSatisfaction: 4.2,
        verificationRate: 87,
        departmentPerformance: 82
      });
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  // Sample chart data
  const reportTrends = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [156, 198, 234, 287, 256, 312, 345, 378, 402, 387, 356, 245]
  };

  const categoryDistribution = [
    { name: 'Road Issues', value: 35, color: 'bg-blue-500' },
    { name: 'Water Problems', value: 25, color: 'bg-green-500' },
    { name: 'Sanitation', value: 20, color: 'bg-yellow-500' },
    { name: 'Electricity', value: 15, color: 'bg-purple-500' },
    { name: 'Other', value: 5, color: 'bg-gray-500' }
  ];

  const departmentPerformance = [
    { name: 'Public Works', value: 92, trend: 'up' },
    { name: 'Sanitation', value: 85, trend: 'up' },
    { name: 'Water Dept', value: 78, trend: 'down' },
    { name: 'Electricity', value: 65, trend: 'up' },
    { name: 'Parks & Rec', value: 88, trend: 'up' }
  ];

  const resolutionTimeline = [
    { time: '0-24 hrs', value: 35 },
    { time: '1-3 days', value: 45 },
    { time: '3-7 days', value: 15 },
    { time: '1-2 weeks', value: 4 },
    { time: '2+ weeks', value: 1 }
  ];

  const topIssues = [
    { name: 'Potholes on Main St', reports: 47, trend: 'up' },
    { name: 'Water leakage in Sector 5', reports: 32, trend: 'down' },
    { name: 'Garbage pileup in Market', reports: 28, trend: 'up' },
    { name: 'Streetlight outage', reports: 24, trend: 'up' },
    { name: 'Park maintenance', reports: 19, trend: 'stable' }
  ];

  const locationHotspots = [
    { area: 'Downtown', issues: 156, trend: 'up' },
    { area: 'Residential Sector 7', issues: 132, trend: 'down' },
    { area: 'Market Area', issues: 128, trend: 'up' },
    { area: 'Industrial Zone', issues: 97, trend: 'stable' },
    { area: 'Suburban North', issues: 84, trend: 'up' }
  ];

  // Initialize chart
  useEffect(() => {
    if (loading) return;
    
    const ctx = chartRef.current.getContext('2d');
    
    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Create gradient for bars
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
    gradient.addColorStop(1, 'rgba(37, 99, 235, 0.8)');
    
    // Create new chart instance
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: reportTrends.labels,
        datasets: [{
          label: 'Number of Reports',
          data: reportTrends.data,
          backgroundColor: gradient,
          borderColor: 'rgba(37, 99, 235, 1)',
          borderWidth: 1,
          borderRadius: 6,
          hoverBackgroundColor: 'rgba(37, 99, 235, 0.9)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1f2937',
            bodyColor: '#1f2937',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return `Reports: ${context.raw}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              color: '#6b7280'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6b7280'
            }
          }
        }
      }
    });
    
    // Cleanup function to destroy chart on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [loading, timeRange]);

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights and performance metrics</p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <div className="relative">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
            <FaDownload className="text-gray-600" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Reports */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaChartBar className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Total Reports</p>
            <p className="text-2xl font-bold">{stats.totalReports}</p>
            <div className="flex items-center text-xs opacity-80 mt-1">
              <FaArrowUp className="mr-1 text-green-300" />
              <span>12% from last period</span>
            </div>
          </div>
        </div>

        {/* Resolved Issues */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaCheckCircle className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Resolved Issues</p>
            <p className="text-2xl font-bold">{stats.resolvedIssues}</p>
            <p className="text-xs opacity-80 mt-1">
              {((stats.resolvedIssues / stats.totalReports) * 100).toFixed(1)}% resolution rate
            </p>
          </div>
        </div>

        {/* Avg. Resolution Time */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaClock className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Avg. Resolution Time</p>
            <p className="text-2xl font-bold">{stats.avgResolutionTime} days</p>
            <div className="flex items-center text-xs opacity-80 mt-1">
              <FaArrowDown className="mr-1 text-green-300" />
              <span>Improved by 0.7 days</span>
            </div>
          </div>
        </div>

        {/* User Satisfaction */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaUsers className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">User Satisfaction</p>
            <p className="text-2xl font-bold">{stats.userSatisfaction}/5</p>
            <div className="flex items-center text-xs opacity-80 mt-1">
              <FaArrowUp className="mr-1 text-green-300" />
              <span>Improved by 0.3 points</span>
            </div>
          </div>
        </div>

        {/* Verification Rate */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaChartPie className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Verification Rate</p>
            <p className="text-2xl font-bold">{stats.verificationRate}%</p>
            <div className="flex items-center text-xs opacity-80 mt-1">
              <FaArrowUp className="mr-1 text-green-300" />
              <span>+5% from last month</span>
            </div>
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaChartLine className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Dept. Performance</p>
            <p className="text-2xl font-bold">{stats.departmentPerformance}%</p>
            <div className="flex items-center text-xs opacity-80 mt-1">
              <FaArrowUp className="mr-1 text-green-300" />
              <span>+7% from last quarter</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Report Trends Chart */}
        <div className="bg-gradient-to-r from-white to-indigo-50 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg text-indigo-700">Report Trends</h3>
            <button className="text-sm text-indigo-600 font-medium hover:underline">
              View Details
            </button>
          </div>
          
          <div className="h-64">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-gradient-to-r from-white to-indigo-50 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg text-indigo-700">Issue Categories</h3>
            <button className="text-sm text-indigo-600 font-medium hover:underline">
              View Details
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            {categoryDistribution.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${category.color} mr-3`}></div>
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-semibold mr-2">{category.value}%</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${category.color}`}
                      style={{ width: `${category.value}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Department Performance */}
        <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-lg text-blue-700 mb-4">Department Performance</h3>
          
          <div className="space-y-4">
            {departmentPerformance.map((dept, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{dept.name}</span>
                <div className="flex items-center">
                  {dept.trend === 'up' ? (
                    <FaArrowUp className="text-green-500 mr-1 text-xs" />
                  ) : (
                    <FaArrowDown className="text-red-500 mr-1 text-xs" />
                  )}
                  <span className="text-sm font-semibold">{dept.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resolution Timeline */}
        <div className="bg-gradient-to-r from-white to-green-50 rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-lg text-green-700 mb-4">Resolution Timeline</h3>
          
          <div className="space-y-3">
            {resolutionTimeline.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{item.time}</span>
                  <span className="text-sm font-semibold">{item.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Issues */}
        <div className="bg-gradient-to-r from-white to-purple-50 rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-lg text-purple-700 mb-4">Top Reported Issues</h3>
          
          <div className="space-y-4">
            {topIssues.map((issue, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                    <FaExclamationTriangle className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{issue.name}</p>
                    <p className="text-xs text-gray-500">{issue.reports} reports</p>
                  </div>
                </div>
                {issue.trend === 'up' ? (
                  <FaArrowUp className="text-red-500" />
                ) : issue.trend === 'down' ? (
                  <FaArrowDown className="text-green-500" />
                ) : (
                  <div className="w-3 h-0.5 bg-gray-400"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location Hotspots */}
      <div className="bg-gradient-to-r from-white to-indigo-50 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg text-indigo-700 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-indigo-600" />
            Location Hotspots
          </h3>
          <button className="text-sm text-indigo-600 font-medium hover:underline">
            View Map
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {locationHotspots.map((location, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">{location.area}</h4>
                {location.trend === 'up' ? (
                  <FaArrowUp className="text-red-500 text-xs" />
                ) : location.trend === 'down' ? (
                  <FaArrowDown className="text-green-500 text-xs" />
                ) : (
                  <div className="w-3 h-0.5 bg-gray-400"></div>
                )}
              </div>
              <p className="text-2xl font-bold text-indigo-700">{location.issues}</p>
              <p className="text-xs text-gray-500">reported issues</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;