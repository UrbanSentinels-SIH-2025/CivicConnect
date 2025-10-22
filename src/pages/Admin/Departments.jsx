import React, { useState, useEffect } from 'react';
import { 
  FaBuilding, 
  FaUsers, 
  FaChartLine, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch,
  FaFilter,
  FaEye,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDepartments: 0,
    activeDepartments: 0,
    totalStaff: 0,
    avgResolutionTime: 0
  });

  // Sample department data
  useEffect(() => {
    // Simulate API fetch
    const sampleDepartments = [
      {
        id: 1,
        name: "Public Works",
        head: "John Smith",
        staffCount: 42,
        activeIssues: 18,
        resolvedThisMonth: 156,
        performance: 92,
        status: "active",
        contactEmail: "publicworks@city.gov",
        phone: "+1 (555) 123-4567"
      },
      {
        id: 2,
        name: "Sanitation Department",
        head: "Maria Garcia",
        staffCount: 28,
        activeIssues: 12,
        resolvedThisMonth: 89,
        performance: 85,
        status: "active",
        contactEmail: "sanitation@city.gov",
        phone: "+1 (555) 234-5678"
      },
      {
        id: 3,
        name: "Water Department",
        head: "Robert Johnson",
        staffCount: 35,
        activeIssues: 24,
        resolvedThisMonth: 112,
        performance: 78,
        status: "active",
        contactEmail: "waterdept@city.gov",
        phone: "+1 (555) 345-6789"
      },
      {
        id: 4,
        name: "Electricity Board",
        head: "Sarah Williams",
        staffCount: 51,
        activeIssues: 32,
        resolvedThisMonth: 145,
        performance: 65,
        status: "active",
        contactEmail: "electricity@city.gov",
        phone: "+1 (555) 456-7890"
      },
      {
        id: 5,
        name: "Parks & Recreation",
        head: "Michael Brown",
        staffCount: 22,
        activeIssues: 8,
        resolvedThisMonth: 47,
        performance: 88,
        status: "active",
        contactEmail: "parks@city.gov",
        phone: "+1 (555) 567-8901"
      },
      {
        id: 6,
        name: "Road Maintenance",
        head: "Jennifer Davis",
        staffCount: 38,
        activeIssues: 27,
        resolvedThisMonth: 134,
        performance: 72,
        status: "under-staffed",
        contactEmail: "roads@city.gov",
        phone: "+1 (555) 678-9012"
      }
    ];

    setDepartments(sampleDepartments);
    setFilteredDepartments(sampleDepartments);
    
    // Calculate stats
    setStats({
      totalDepartments: sampleDepartments.length,
      activeDepartments: sampleDepartments.filter(dept => dept.status === "active").length,
      totalStaff: sampleDepartments.reduce((sum, dept) => sum + dept.staffCount, 0),
      avgResolutionTime: 2.5
    });
    
    setLoading(false);
  }, []);

  // Handle search
  useEffect(() => {
    let result = departments;
    
    if (searchTerm) {
      result = result.filter(dept => 
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.head.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredDepartments(result);
  }, [searchTerm, departments]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    if (sortConfig.key) {
      const sortedDepartments = [...filteredDepartments].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      setFilteredDepartments(sortedDepartments);
    }
  }, [sortConfig]);

  const getPerformanceColor = (percent) => {
    if (percent >= 90) return 'text-green-600';
    if (percent >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBgColor = (percent) => {
    if (percent >= 90) return 'bg-green-100';
    if (percent >= 75) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'under-staffed': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <FaSort className="text-gray-400 ml-1" />;
    }
    
    if (sortConfig.direction === 'ascending') {
      return <FaSortUp className="text-blue-500 ml-1" />;
    }
    
    return <FaSortDown className="text-blue-500 ml-1" />;
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen ">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Department Management</h1>
        <p className="text-gray-600">Manage and monitor all city departments</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Departments */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaBuilding className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Total Departments</p>
            <p className="text-2xl font-bold">{stats.totalDepartments}</p>
            <p className="text-xs opacity-80 mt-1">{stats.activeDepartments} active</p>
          </div>
        </div>

        {/* Total Staff */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaUsers className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Total Staff</p>
            <p className="text-2xl font-bold">{stats.totalStaff}</p>
            <p className="text-xs opacity-80 mt-1">Across all departments</p>
          </div>
        </div>

        {/* Avg. Resolution Time */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaChartLine className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Avg. Resolution Time</p>
            <p className="text-2xl font-bold">{stats.avgResolutionTime} days</p>
            <p className="text-xs opacity-80 mt-1">Target: 2.0 days</p>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaCheckCircle className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Avg. Performance</p>
            <p className="text-2xl font-bold">80%</p>
            <p className="text-xs opacity-80 mt-1">+5% from last month</p>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-gradient-to-r from-white to-indigo-50 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search departments..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="under-staffed">Under-staffed</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg flex items-center text-sm">
              <FaPlus className="mr-2" />
              New Department
            </button>
          </div>
        </div>
      </div>

      {/* Departments Table */}
      <div className="bg-gradient-to-r from-white to-indigo-50 rounded-xl shadow-lg p-6 mb-8">
        <h3 className="font-semibold text-lg text-indigo-700 mb-4">All Departments</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th 
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    <span>Department</span>
                    <SortIcon columnKey="name" />
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort('head')}
                >
                  <div className="flex items-center">
                    <span>Department Head</span>
                    <SortIcon columnKey="head" />
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort('staffCount')}
                >
                  <div className="flex items-center">
                    <span>Staff</span>
                    <SortIcon columnKey="staffCount" />
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort('activeIssues')}
                >
                  <div className="flex items-center">
                    <span>Active Issues</span>
                    <SortIcon columnKey="activeIssues" />
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort('performance')}
                >
                  <div className="flex items-center">
                    <span>Performance</span>
                    <SortIcon columnKey="performance" />
                  </div>
                </th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((dept) => (
                <tr key={dept.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-800">{dept.name}</div>
                    <div className="text-sm text-gray-500">{dept.contactEmail}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-800">{dept.head}</div>
                    <div className="text-sm text-gray-500">{dept.phone}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-800">{dept.staffCount}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-800">{dept.activeIssues}</div>
                    <div className="text-sm text-gray-500">{dept.resolvedThisMonth} resolved this month</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className={`font-bold ${getPerformanceColor(dept.performance)}`}>
                      {dept.performance}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full ${getPerformanceBgColor(dept.performance)}`}
                        style={{ width: `${dept.performance}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dept.status)}`}>
                      {dept.status === 'active' ? 'Active' : 
                       dept.status === 'under-staffed' ? 'Under-staffed' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                        <FaEye />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                        <FaEdit />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-blue-700">Department Performance</h3>
            <button className="text-sm text-blue-600 font-medium hover:underline">
              View Details
            </button>
          </div>

          <div className="space-y-4">
            {filteredDepartments.slice(0, 5).map((dept) => (
              <div key={dept.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{dept.name}</span>
                  <span className={`text-sm font-semibold ${getPerformanceColor(dept.performance)}`}>
                    {dept.performance}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getPerformanceBgColor(dept.performance)}`}
                    style={{ width: `${dept.performance}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Department Activities */}
        <div className="bg-gradient-to-r from-white to-indigo-50 rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-lg text-indigo-700 mb-4">Recent Activities</h3>

          <div className="space-y-4">
            <div className="flex items-start p-3 bg-blue-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <FaPlus className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-800">New staff assigned</h4>
                <p className="text-sm text-blue-700">5 new staff members added to Public Works</p>
                <p className="text-xs text-blue-600 mt-1">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start p-3 bg-green-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <FaCheckCircle className="text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Performance improved</h4>
                <p className="text-sm text-green-700">Water Department performance increased by 8%</p>
                <p className="text-xs text-green-600 mt-1">1 day ago</p>
              </div>
            </div>

            <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
              <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                <FaExclamationTriangle className="text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-yellow-800">Staffing alert</h4>
                <p className="text-sm text-yellow-700">Road Maintenance is under-staffed</p>
                <p className="text-xs text-yellow-600 mt-1">2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Departments;