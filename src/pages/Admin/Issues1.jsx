// src/components/IssueComponent.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Tooltip,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaFilter,
  FaEye,
  FaUsers,
  FaThumbsUp
} from "react-icons/fa";

/**
 * AllIssues component using Leaflet map + a textual list.
 * - Pass `issuesProp` (array) if you have API data; otherwise sample data used.
 * - Each issue: { id, title, description, category, status, priority, lat, lng, reporter, createdAt, images, verifications, department, severity }
 */

const sampleIssues = [
  {
    id: "ISS-001",
    title: "Pothole on Main Street",
    description:
      "Large pothole near the bus stop. Road surface damaged and causing vehicle swerves.",
    category: "Road",
    status: "Pending",
    priority: "High",
    lat: 23.6109,
    lng: 85.2799,
    reporter: { name: "Ramesh Kumar", id: "USR-1001" },
    createdAt: "2025-09-16T08:23:00Z",
    images: ["https://via.placeholder.com/600x300.png?text=Pothole"],
    verifications: 3,
    department: null,
    severity: 0.87
  },
  {
    id: "ISS-002",
    title: "Water Leakage in Sector 7",
    description: "Water pipeline leakage causing wet road and minor flooding.",
    category: "Water",
    status: "In Progress",
    priority: "Medium",
    lat: 23.6125,
    lng: 85.2808,
    reporter: { name: "Sita Devi", id: "USR-1002" },
    createdAt: "2025-09-16T04:10:00Z",
    images: ["https://via.placeholder.com/600x300.png?text=Leakage"],
    verifications: 5,
    department: "Water Dept",
    severity: 0.58
  },
  {
    id: "ISS-003",
    title: "Garbage Pileup in Market Area",
    description: "Large garbage pile near market — bad odor & stray animals.",
    category: "Sanitation",
    status: "Resolved",
    priority: "Low",
    lat: 23.6090,
    lng: 85.2815,
    reporter: { name: "Nisha Patel", id: "USR-1003" },
    createdAt: "2025-09-15T20:00:00Z",
    images: ["https://via.placeholder.com/600x300.png?text=Garbage"],
    verifications: 12,
    department: "Sanitation",
    severity: 0.32
  }
];

const statusColors = {
  Pending: "#F59E0B", // yellow/orange
  "In Progress": "#3B82F6", // blue
  Resolved: "#10B981" // green
};

const priorityBadge = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700"
};

function FlyToMarker({ target, zoom = 16 }) {
  // helper component to fly map to a new center when `target` changes
  const map = useMap();
  useEffect(() => {
    if (target && map) {
      map.flyTo([target.lat, target.lng], zoom, { animate: true });
    }
  }, [target, map, zoom]);
  return null;
}

export default function Issues({ issuesProp = null }) {
  const [issues, setIssues] = useState(issuesProp || sampleIssues);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [mapTarget, setMapTarget] = useState(null);
  const mapRef = useRef(null);

  // Derive category list dynamically
  const categories = useMemo(() => {
    const setCats = new Set(issues.map((i) => i.category || "Other"));
    return ["All", ...Array.from(setCats)];
  }, [issues]);

  // filters + search
  const filteredIssues = issues.filter((it) => {
    const matchesSearch =
      !search ||
      it.title.toLowerCase().includes(search.toLowerCase()) ||
      it.description.toLowerCase().includes(search.toLowerCase()) ||
      (it.reporter?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || it.status === statusFilter;
    const matchesCategory =
      categoryFilter === "All" || it.category === categoryFilter;
    const matchesPriority =
      priorityFilter === "All" || it.priority === priorityFilter;
    return (
      matchesSearch && matchesStatus && matchesCategory && matchesPriority
    );
  });

  // Example: fly to a selected issue
  function viewOnMap(issue) {
    setMapTarget({ lat: issue.lat, lng: issue.lng });
    setSelectedIssue(issue);
  }

  // Actions: assign department / update status (these would call APIs in real app)
  function assignToDepartment(issueId, dept) {
    setIssues((prev) =>
      prev.map((it) => (it.id === issueId ? { ...it, department: dept } : it))
    );
  }
  function updateStatus(issueId, newStatus) {
    setIssues((prev) =>
      prev.map((it) =>
        it.id === issueId ? { ...it, status: newStatus } : it
      )
    );
  }

  // Pretty time
  function timeAgo(dateStr) {
    const d = new Date(dateStr);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000); // seconds
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  // default center: compute centroid or fallback
  const center = useMemo(() => {
    if (!issues || issues.length === 0) return [23.61, 85.28];
    const lat = issues.reduce((s, i) => s + i.lat, 0) / issues.length;
    const lng = issues.reduce((s, i) => s + i.lng, 0) / issues.length;
    return [lat, lng];
  }, [issues]);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-blue-50 to-blue-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Issues</h2>
        <p className="text-gray-600">
          Visualize active civic issues on the map and manage them from the
          list.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map - large */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative w-full">
                <input
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Search by title, description, reporter..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <FaSearch />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>

              <select
                className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <select
                className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option>All</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          {/* MapContainer */}
          <div style={{ height: 520 }} className="rounded-lg overflow-hidden">
            <MapContainer
              center={center}
              zoom={14}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
              whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* FlyTo helper */}
              {mapTarget && <FlyToMarker target={mapTarget} zoom={16} />}

              {/* Markers (as CircleMarker with color by status) */}
              {filteredIssues.map((issue) => {
                const color = statusColors[issue.status] || "#6B7280";
                return (
                  <CircleMarker
                    key={issue.id}
                    center={[issue.lat, issue.lng]}
                    radius={9}
                    pathOptions={{ color, fillColor: color, fillOpacity: 0.9 }}
                    eventHandlers={{
                      click: () => {
                        setSelectedIssue(issue);
                        setMapTarget({ lat: issue.lat, lng: issue.lng });
                      }
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                      <div className="text-sm font-medium">{issue.title}</div>
                      <div className="text-xs text-gray-700">{issue.category} • {issue.priority}</div>
                    </Tooltip>
                    <Popup className="min-w-[220px]">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{issue.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded ${priorityBadge[issue.priority] || "bg-gray-100 text-gray-700"}`}>
                            {issue.priority}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{issue.description}</p>
                        <div className="text-xs text-gray-500">Reported: {timeAgo(issue.createdAt)}</div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => viewOnMap(issue)}
                            className="text-sm px-2 py-1 rounded bg-blue-50 hover:bg-blue-100"
                          >
                            View
                          </button>
                          <button
                            onClick={() => { setSelectedIssue(issue); }}
                            className="text-sm px-2 py-1 rounded bg-gray-50 hover:bg-gray-100"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>
        </div>

        {/* Right column - Issue list */}
        <div className="bg-white rounded-lg shadow p-4 max-h-[700px] overflow-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">Issue List ({filteredIssues.length})</h3>
            <div className="text-sm text-gray-500">Sort: Newest</div>
          </div>

          <div className="space-y-3">
            {filteredIssues.length === 0 && (
              <div className="text-sm text-gray-500">No issues found.</div>
            )}

            {filteredIssues.map((it) => (
              <div
                key={it.id}
                className="flex items-start justify-between p-3 border-l-4 rounded bg-gray-50"
                style={{ borderColor: statusColors[it.status] }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
                    <FaMapMarkerAlt className="text-blue-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{it.title}</h4>
                      <span className="text-xs text-gray-500">#{it.id}</span>
                    </div>
                    <div className="text-xs text-gray-600">{it.category} • {timeAgo(it.createdAt)}</div>
                    <div className="text-xs text-gray-500 mt-1">{it.description.slice(0, 80)}{it.description.length > 80 ? "..." : ""}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${priorityBadge[it.priority] || "bg-gray-100 text-gray-700"}`}>
                        {it.priority}
                      </span>
                      <span className="text-xs bg-white px-2 py-0.5 rounded border text-gray-600">
                        {it.verifications} verif.
                      </span>
                      <span className="text-xs text-gray-500">Dept: {it.department || "Unassigned"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold">{it.status}</span>
                    <span className="text-xs text-gray-500">{it.reporter?.name}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => viewOnMap(it)}
                      className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-sm"
                    >
                      <FaEye className="inline mr-1" /> Map
                    </button>

                    <button
                      onClick={() => setSelectedIssue(it)}
                      className="px-2 py-1 rounded bg-gray-50 hover:bg-gray-100 text-sm"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bulk actions footer */}
          <div className="mt-4 border-t pt-3 flex items-center justify-between">
            <div className="text-sm text-gray-600">Select multiple to perform bulk actions.</div>
            <div className="flex gap-2">
              <button className="px-3 py-2 rounded-md bg-blue-50 hover:bg-blue-100 text-sm">Export CSV</button>
              <button className="px-3 py-2 rounded-md bg-green-50 hover:bg-green-100 text-sm">Assign Dept</button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSelectedIssue(null)}
          />
          <div className="ml-auto w-full lg:w-[520px] bg-white h-full p-6 overflow-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
                  <FaExclamationTriangle className="text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedIssue.title}</h3>
                  <div className="text-xs text-gray-500">#{selectedIssue.id} • {selectedIssue.category}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedIssue(null)}
                className="text-gray-600 text-sm"
              >
                Close
              </button>
            </div>

            {/* images */}
            <div className="space-y-3 mb-4">
              {selectedIssue.images?.map((src, idx) => (
                <img key={idx} src={src} alt={`img-${idx}`} className="w-full h-40 object-cover rounded" />
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-700">{selectedIssue.description}</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-sm">
                  <div className="text-xs text-gray-500">Reported By</div>
                  <div className="font-medium">{selectedIssue.reporter?.name}</div>
                  <div className="text-xs text-gray-500">{selectedIssue.reporter?.id}</div>
                </div>

                <div className="text-sm">
                  <div className="text-xs text-gray-500">Reported</div>
                  <div className="font-medium">{new Date(selectedIssue.createdAt).toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{timeAgo(selectedIssue.createdAt)}</div>
                </div>

                <div className="text-sm">
                  <div className="text-xs text-gray-500">Severity</div>
                  <div className="font-medium">{Math.round((selectedIssue.severity || 0) * 100)}%</div>
                </div>

                <div className="text-sm">
                  <div className="text-xs text-gray-500">Verifications</div>
                  <div className="font-medium">{selectedIssue.verifications}</div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => updateStatus(selectedIssue.id, "In Progress")}
                  className="px-3 py-2 rounded bg-blue-600 text-white"
                >
                  Mark In Progress
                </button>
                <button
                  onClick={() => updateStatus(selectedIssue.id, "Resolved")}
                  className="px-3 py-2 rounded bg-green-600 text-white"
                >
                  Mark Resolved
                </button>

                <button
                  onClick={() => assignToDepartment(selectedIssue.id, "Public Works")}
                  className="px-3 py-2 rounded bg-gray-100"
                >
                  Assign to Public Works
                </button>

                <button
                  onClick={() => viewOnMap(selectedIssue)}
                  className="px-3 py-2 rounded bg-blue-50"
                >
                  <FaEye className="inline mr-1" /> View on Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
