import React, { useState, useEffect } from 'react';
import {
  FaUserPlus,
  FaUserEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: 'Department Head',
    status: 'active'
  });

  // Sample departments - replace with your actual departments
  const departments = [
    'Public Works',
    'Sanitation',
    'Water Department',
    'Electricity',
    'Transportation',
    'Parks & Recreation',
    'Public Safety',
    'Administration'
  ];

  // Sample data - replace with API calls
  useEffect(() => {
    // Simulate API fetch
    const sampleUsers = [
      {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@publicworks.gov',
        phone: '(555) 123-4567',
        department: 'Public Works',
        position: 'Department Head',
        status: 'active',
        joinDate: '2023-01-15'
      },
      {
        id: 2,
        name: 'Maria Garcia',
        email: 'maria.garcia@sanitation.gov',
        phone: '(555) 234-5678',
        department: 'Sanitation',
        position: 'Department Head',
        status: 'active',
        joinDate: '2022-11-03'
      },
      {
        id: 3,
        name: 'Robert Johnson',
        email: 'robert.johnson@water.gov',
        phone: '(555) 345-6789',
        department: 'Water Department',
        position: 'Department Head',
        status: 'inactive',
        joinDate: '2023-03-22'
      }
    ];
    setUsers(sampleUsers);
    setFilteredUsers(sampleUsers);
  }, []);

  // Filter users based on search term and department
  useEffect(() => {
    let result = users;
    
    if (searchTerm) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterDepartment !== 'all') {
      result = result.filter(user => user.department === filterDepartment);
    }
    
    setFilteredUsers(result);
  }, [searchTerm, filterDepartment, users]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...formData, id: user.id } : user
      ));
      setEditingUser(null);
    } else {
      // Add new user
      const newUser = {
        ...formData,
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        joinDate: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
    }
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      position: 'Department Head',
      status: 'active'
    });
    setShowAddForm(false);
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      department: user.department,
      position: user.position,
      status: user.status
    });
    setEditingUser(user);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      position: 'Department Head',
      status: 'active'
    });
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-blue-50 to-blue-200">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-600">Manage department heads and administrators</p>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-4 text-white">
          <div className="flex items-center">
            <div className="rounded-full bg-white/20 p-3 mr-4">
              <FaUserTie className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm opacity-80">Total Department Heads</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-4 text-white">
          <div className="flex items-center">
            <div className="rounded-full bg-white/20 p-3 mr-4">
              <FaCheckCircle className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm opacity-80">Active Users</p>
              <p className="text-2xl font-bold">
                {users.filter(u => u.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg shadow p-4 text-black">
          <div className="flex items-center">
            <div className="rounded-full bg-black/10 p-3 mr-4">
              <FaTimesCircle className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm opacity-80">Inactive Users</p>
              <p className="text-2xl font-bold">
                {users.filter(u => u.status === 'inactive').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-4 text-white">
          <div className="flex items-center">
            <div className="rounded-full bg-white/20 p-3 mr-4">
              <FaBuilding className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm opacity-80">Departments Covered</p>
              <p className="text-2xl font-bold">
                {new Set(users.map(u => u.department)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center whitespace-nowrap"
          >
            <FaUserPlus className="mr-2" />
            Add Department Head
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingUser ? 'Edit Department Head' : 'Add New Department Head'}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={cancelForm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                {editingUser ? 'Update User' : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaUserTie className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaEnvelope className="mr-1 text-xs" />
                            {user.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaPhone className="mr-1 text-xs" />
                            {user.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.department}</div>
                      <div className="text-sm text-gray-500">{user.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FaUserEdit className="inline mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="inline mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;