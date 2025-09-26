import React from "react";

const FilterResultsInfo = ({ filteredIssues, issuesData, filters }) => {
  return (
    <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-md border border-blue-100 relative z-10">
      <div className="flex items-center justify-between">
        {/* Left side indicator */}
        <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Filter Results</span>
        </div>

        {/* Right side info */}
        <div className="text-blue-600 text-sm">
          Showing <span className="font-bold">{filteredIssues.length}</span> of{" "}
          <span className="font-bold">{issuesData.length}</span> issues
          {filters.status && (
            <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
              Status: {filters.status}
            </span>
          )}
          {filters.category && (
            <span className="ml-2 bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full text-xs">
              Category: {filters.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterResultsInfo;
