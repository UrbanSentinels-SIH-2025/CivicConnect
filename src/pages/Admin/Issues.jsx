import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for categories with more professional appearance
const roadIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const waterIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/639/639365.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const lightIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/32/32177.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const trashIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/980/980477.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Enhanced issue data with more details
const issuesData = [
  { 
    id: 1, 
    title: "Pothole on Main Street", 
    description: "Large pothole causing traffic issues and vehicle damage",
    category: "Road", 
    status: "Pending", 
    priority: "High",
    reportedDate: "2023-05-15",
    updatedDate: "2023-05-18",
    address: "Main Street, between 5th and 6th Ave",
    reporter: "John Smith",
    lat: 19.0473, 
    lng: 83.8311,
    votes: 12,
    image: "https://images.unsplash.com/photo-1573060862417-7243a275fcc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
  },
  { 
    id: 2, 
    title: "Water Leakage in Sector 7", 
    description: "Water pipe leaking near the community park, creating wastage",
    category: "Water", 
    status: "In Progress", 
    priority: "Medium",
    reportedDate: "2023-05-20",
    updatedDate: "2023-05-22",
    address: "Sector 7, near Central Park",
    reporter: "Community Board",
    lat: 19.07, 
    lng: 72.89,
    votes: 8,
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
  },
  { 
    id: 3, 
    title: "Streetlight Not Working", 
    description: "Streetlight pole #42 not functioning, creating safety concerns",
    category: "Electricity", 
    status: "Resolved", 
    priority: "Medium",
    reportedDate: "2023-05-10",
    updatedDate: "2023-05-17",
    address: "Oak Avenue, near the library",
    reporter: "Maria Garcia",
    lat: 19.075, 
    lng: 72.876,
    votes: 5,
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
  },
  { 
    id: 4, 
    title: "Garbage Accumulation", 
    description: "Trash not collected for 5 days, attracting pests",
    category: "Sanitation", 
    status: "Pending", 
    priority: "High",
    reportedDate: "2023-05-22",
    updatedDate: "2023-05-22",
    address: "Elm Street, corner of 3rd Ave",
    reporter: "Robert Johnson",
    lat: 19.072, 
    lng: 72.879,
    votes: 15,
    image: "https://images.unsplash.com/photo-1621114957135-9ddc2c0e1c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
  },
];

// Utility to pick icon by category
const getCategoryIcon = (category) => {
  switch (category) {
    case "Road":
      return roadIcon;
    case "Water":
      return waterIcon;
    case "Electricity":
      return lightIcon;
    case "Sanitation":
      return trashIcon;
    default:
      return roadIcon;
  }
};

// Utility to get status badge color
const getStatusBadge = (status) => {
  const baseClass = "px-2 py-1 rounded text-xs font-semibold";
  if (status === "Pending") return `${baseClass} bg-red-100 text-red-700`;
  if (status === "In Progress") return `${baseClass} bg-yellow-100 text-yellow-700`;
  if (status === "Resolved") return `${baseClass} bg-green-100 text-green-700`;
  return baseClass;
};

// Utility to get priority badge
const getPriorityBadge = (priority) => {
  const baseClass = "px-2 py-1 rounded text-xs font-semibold";
  if (priority === "High") return `${baseClass} bg-red-100 text-red-700`;
  if (priority === "Medium") return `${baseClass} bg-yellow-100 text-yellow-700`;
  if (priority === "Low") return `${baseClass} bg-blue-100 text-blue-700`;
  return baseClass;
};

// Filter component
const FilterBar = ({ filters, setFilters, categories, statuses }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select 
            className="rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            className="rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="All">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select 
            className="rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={filters.sortBy}
            onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Priority</option>
            <option value="votes">Most Votes</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm"
            onClick={() => setFilters({category: "All", status: "All", sortBy: "newest"})}
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// Issue card component
const IssueCard = ({ issue }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="flex">
        <div className="w-1/3">
          <img 
            src={issue.image} 
            alt={issue.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="w-2/3 p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
            <span className={getStatusBadge(issue.status)}>{issue.status}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{issue.description}</p>
          
          <div className="flex items-center mt-3">
            <span className={getPriorityBadge(issue.priority)}>{issue.priority} Priority</span>
            <span className="ml-2 text-xs text-gray-500">Reported: {issue.reportedDate}</span>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <div className="text-sm text-gray-500">
              <span className="font-medium">{issue.votes}</span> votes
            </div>
            <div className="text-xs text-gray-500">
              By {issue.reporter}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Issues() {
  const [filters, setFilters] = useState({
    category: "All",
    status: "All",
    sortBy: "newest"
  });
  
  // Get unique categories and statuses for filters
  const categories = [...new Set(issuesData.map(issue => issue.category))];
  const statuses = [...new Set(issuesData.map(issue => issue.status))];
  
  // Filter and sort issues
  const filteredIssues = issuesData
    .filter(issue => {
      return (filters.category === "All" || issue.category === filters.category) &&
             (filters.status === "All" || issue.status === filters.status);
    })
    .sort((a, b) => {
      switch(filters.sortBy) {
        case "newest":
          return new Date(b.reportedDate) - new Date(a.reportedDate);
        case "oldest":
          return new Date(a.reportedDate) - new Date(b.reportedDate);
        case "priority":
          const priorityOrder = {High: 3, Medium: 2, Low: 1};
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "votes":
          return b.votes - a.votes;
        default:
          return 0;
      }
    });
  
  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Issues Tracker</h1>
            <p className="text-gray-600 mt-1">Reported issues and their resolution status</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
            Report New Issue
          </button>
        </div>
        
        <FilterBar 
          filters={filters} 
          setFilters={setFilters}
          categories={categories}
          statuses={statuses}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Issues List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Reported Issues ({filteredIssues.length})</h2>
              <div className="space-y-4">
                {filteredIssues.length > 0 ? (
                  filteredIssues.map(issue => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No issues match the selected filters</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="rounded-xl shadow-md overflow-hidden h-[800px]">
              <MapContainer center={[19.0804, 83.8088]} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {filteredIssues.map((issue) => (
                  <Marker
                    key={issue.id}
                    position={[issue.lat, issue.lng]}
                    icon={getCategoryIcon(issue.category)}
                  >
                    <Popup>
                      <div className="space-y-2 w-64">
                        <div className="flex justify-between items-start">
                          <h2 className="font-bold text-base">{issue.title}</h2>
                          <span className={getStatusBadge(issue.status)}>{issue.status}</span>
                        </div>
                        <img src={issue.image} alt={issue.title} className="w-full h-32 object-cover rounded" />
                        <p className="text-sm text-gray-600">{issue.description}</p>
                        <div className="flex justify-between">
                          <p className="text-sm"><span className="font-medium">Category:</span> {issue.category}</p>
                          <p className="text-sm"><span className="font-medium">Priority:</span> <span className={getPriorityBadge(issue.priority)}>{issue.priority}</span></p>
                        </div>
                        <p className="text-xs text-gray-500">Reported on: {issue.reportedDate}</p>
                        <p className="text-xs text-gray-500">By: {issue.reporter}</p>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-sm text-gray-600">{issue.votes} votes</span>
                          <button className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded">
                            View Details
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}