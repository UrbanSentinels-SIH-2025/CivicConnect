import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Get category color for map markers
const getCategoryColor = (category) => {
  switch (category) {
    case "Street":
      return "#ef4444";
    case "Water":
      return "#3b82f6";
    case "Electricity":
      return "#eab308";
    case "Sanitation":
      return "#22c55e";
    default:
      return "#6b7280";
  }
};

// Create custom markers for each category
const createCustomIcon = (category, isSelected = false) => {
  const color = getCategoryColor(category);
  const size = isSelected ? 30 : 25;

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; 
                      width: ${size}px; 
                      height: ${size}px; 
                      border-radius: 50% 50% 50% 0; 
                      transform: rotate(-45deg);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      border: 3px solid white;
                      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                      position: relative;">
            <div style="transform: rotate(45deg); 
                       color: white; 
                       font-weight: bold;
                       font-size: ${isSelected ? "12px" : "10px"};
                       text-align: center;
                       margin-top: ${isSelected ? "2px" : "1px"};
                       margin-left: ${isSelected ? "1px" : "0"}">
              ${category.charAt(0)}
            </div>
           </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
};

// Recenter Button Component
const RecenterButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-md z-[1000] hover:bg-gray-100 transition-colors"
      title="Recenter Map"
    >
      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>
  );
};

// Custom Map Component using Leaflet
const CustomMap = ({ 
  issues, 
  selectedIssue, 
  onMarkerClick, 
  onRecenter,
  defaultCenter = [19.0804, 83.8088],
  defaultZoom = 14 
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Determine status based on progress
  const getStatusFromProgress = (progress) => {
    if (!progress) return "Pending";
    if (progress.resolved && progress.resolved.completed) return "Resolved";
    if (progress.inProgress && progress.inProgress.completed) return "In Progress";
    if (progress.verified && progress.verified.completed) return "Verified";
    return "Pending";
  };

  // Calculate verification count
  const getVerificationCount = (verifications) => {
    if (!verifications) return 0;
    return verifications.real ? verifications.real.length : 0;
  };

  useEffect(() => {
    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(defaultCenter, defaultZoom);

      // Google Satellite with labels tile layer
      L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Maps'
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add markers for each issue
    issues.forEach((issue) => {
      const isSelected = selectedIssue && selectedIssue._id === issue._id;
      const marker = L.marker(
        [issue.location.latitude, issue.location.longitude],
        { icon: createCustomIcon(issue.category, isSelected) }
      ).addTo(mapInstanceRef.current);

      const status = getStatusFromProgress(issue.progress);
      const verificationCount = getVerificationCount(issue.verifications);

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold">${issue.title}</h3>
          <p>Category: ${issue.category}</p>
          <p>Status: ${status}</p>
          <p>Verifications: ${verificationCount}</p>
        </div>
      `);

      marker.on("click", () => {
        onMarkerClick(issue);
      });

      markersRef.current.push(marker);
    });

    // Adjust map view based on selected issue or all issues
    if (selectedIssue) {
      mapInstanceRef.current.setView(
        [selectedIssue.location.latitude, selectedIssue.location.longitude],
        defaultZoom
      );
    } else if (issues.length === 1) {
      mapInstanceRef.current.setView(
        [issues[0].location.latitude, issues[0].location.longitude],
        defaultZoom
      );
    } else if (issues.length > 1) {
      const group = new L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1), {
        maxZoom: defaultZoom,
      });
    }

    return () => {
      // Cleanup function to prevent memory leaks
      markersRef.current.forEach((marker) => {
        mapInstanceRef.current.removeLayer(marker);
      });
    };
  }, [issues, selectedIssue, onMarkerClick, defaultCenter, defaultZoom]);

  const handleRecenter = () => {
    if (issues.length === 0) {
      mapInstanceRef.current.setView(defaultCenter, defaultZoom);
    } else if (issues.length === 1) {
      mapInstanceRef.current.setView(
        [issues[0].location.latitude, issues[0].location.longitude],
        defaultZoom
      );
    } else {
      const group = new L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1), {
        maxZoom: defaultZoom,
      });
    }
    
    if (onRecenter) {
      onRecenter();
    }
  };

  return (
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden h-[600px]">
      <div
        ref={mapRef}
        className="w-full h-full rounded-xl"
        style={{ zIndex: 1 }}
      />
      <RecenterButton onClick={handleRecenter} />
    </div>
  );
};

export default CustomMap;