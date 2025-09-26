import React from "react";

const MapLegend = () => {
  const categories = [
    { name: "Street", color: "#ef4444", description: "Road issues" },
    { name: "Water", color: "#3b82f6", description: "Water problems" },
    { name: "Electricity", color: "#eab308", description: "Power issues" },
    { name: "Sanitation", color: "#22c55e", description: "Cleanliness" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-2 mb-2 text-xs">
      <h3 className="text-gray-800 mb-2 text-md font-bold">Map Legend</h3>
      <div className="flex gap-4 justify-evenly">
        {categories.map((category) => (
          <div key={category.name} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color }}
            ></div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-700">{category.name}</span>
              <span className="text-gray-500">{category.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;