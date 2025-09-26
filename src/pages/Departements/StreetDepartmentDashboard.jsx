import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { getStatusCount } from "../../utils/statusHelper";

const StreetDepartmentDashboard = () => {
  const { departmentName } = useParams();
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");

  // For modal
  const [showModal, setShowModal] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `/user-issue/department-issues/${departmentName}`
        );
        setIssues(response.data || []);
        setFilteredIssues(response.data || []); // keep sync
      } catch (error) {
        console.error("Error fetching department issues:", error);
      }
    };

    if (departmentName) {
      fetchData();
    }
  }, [departmentName]);

  const statusCount = getStatusCount(issues);

  const filterIssuesByStatus = (status) => {
    return issues.filter((issue) => {
      const { progress } = issue;
      if (status === "pending") {
        return (
          progress?.verified?.completed &&
          !progress?.inProgress?.completed &&
          !progress?.resolved?.completed
        );
      } else if (status === "inProgress") {
        return (
          progress?.inProgress?.completed && !progress?.resolved?.completed
        );
      } else if (status === "resolved") {
        return progress?.resolved?.completed;
      }
      return false;
    });
  };

  const handleFilterChange = (e) => {
    const status = e.target.value;
    if (status === "all") {
      setFilteredIssues(issues);
    } else {
      setFilteredIssues(filterIssuesByStatus(status));
    }
  };

  const handleSortChange = (e) => {
    const order = e.target.value;
    setSortOrder(order);
    const sorted = [...filteredIssues].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return order === "newest" ? dateB - dateA : dateA - dateB;
    });
    setFilteredIssues(sorted);
  };

  // Open confirmation modal
  const confirmStartWork = (issueId) => {
    setSelectedIssueId(issueId);
    setShowModal(true);
  };

  // Handle yes click
  const handleStartWork = async (issueId) => {
  try {
    const payload = {
      id: issueId,
      progressStage: "inProgress",
    };

    const response = await api.patch(`/user-issue/department-issues/progress`, payload);
    console.log("Progress updated:", response.data);

    // Update local state
    setIssues(prev =>
      prev.map(issue =>
        issue._id === issueId
          ? { ...issue, progress: { ...issue.progress, inProgress: { completed: true, date: new Date().toISOString() } } }
          : issue
      )
    );

    // Close modal
    setShowModal(false);
    setSelectedIssueId(null);

  } catch (error) {
    console.error("Error updating progress:", error);
  }
};



//Handle issues resolved
  const handleIssueResolved = async (issueId) => {
    try {
      const payload = {
        id: issueId,
        progressStage: "resolved",
      };
      const response = await api.patch(`/user-issue/department-issues/progress`, payload);
      console.log("Progress updated:", response.data);
      // Update local state
      setIssues(prev =>
        prev.map(issue => 
          issue._id === issueId
            ? { ...issue, progress: { ...issue.progress, resolved: { completed: true, date: new Date().toISOString() } } }
            : issue
        )
      );
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };
      
    


  // Handle no click
  const handleCancel = () => {
    setShowModal(false);
    setSelectedIssueId(null);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-blue-50 to-blue-200">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {departmentName} Department Dashboard
        </h1>
        <p className="text-gray-600">Take action on the issues and resolve them</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Total Issues</h2>
          <p className="text-3xl font-bold text-blue-600">{statusCount.totalIssues}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Pending</h2>
          <p className="text-3xl font-bold text-blue-600">{statusCount.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">In Progress</h2>
          <p className="text-3xl font-bold text-yellow-500">{statusCount.inProgress}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Resolved</h2>
          <p className="text-3xl font-bold text-green-600">{statusCount.resolved}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select onChange={handleFilterChange} className="p-2 border rounded">
          <option value="all">All Issues</option>
          <option value="pending">Pending</option>
          <option value="inProgress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <select onChange={handleSortChange} className="p-2 border rounded">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => (
            <div key={issue._id} className="bg-white p-4 rounded shadow flex gap-4 items-start">
              {issue.videoUrl && (
                <video
                  src={issue.videoUrl}
                  className="w-32 h-20 object-cover rounded"
                  muted
                  loop
                  playsInline
                  controls={false}
                />
              )}

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{issue.title}</h3>
                <p className="text-gray-600">{issue.description}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(issue.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  {issue.progress.resolved.completed
                    ? "Resolved"
                    : issue.progress.inProgress.completed
                    ? "In Progress"
                    : issue.progress.verified.completed
                    ? "Pending"
                    : "Reported"}
                </p>
                {issue.progress.resolved.completed && (
                  <p className="text-sm text-green-600">
                    Resolved on: {new Date(issue.progress.resolved.date).toLocaleDateString() }
                  </p>
                )}
                

                {!issue.progress.inProgress.completed && !issue.progress.resolved.completed && (
                  <button
                    onClick={() => confirmStartWork(issue._id)}
                    className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Start Work
                  </button>
                )}
                {issue.progress.inProgress.completed && !issue.progress.resolved.completed && (
                  <button
                    onClick={() =>  handleIssueResolved(issue._id)}
                    className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No issues found for this filter.</p>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-80">
            <h2 className="text-lg font-semibold mb-4">Confirm Start Work</h2>
            <p>Are you sure you want to start this work?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                No
              </button>
              <button
  onClick={() => handleStartWork(selectedIssueId)}
  className="px-4 py-2 bg-yellow-500 text-white rounded"
>
  Yes
</button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreetDepartmentDashboard;
