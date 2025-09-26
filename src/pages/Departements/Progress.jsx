import React, { useEffect, useState, useRef } from "react";
import { useParams, NavLink } from "react-router-dom";
import api from "../../api/axios";

const Progress = () => {
  const { departmentName } = useParams();
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [thumbnails, setThumbnails] = useState({});
  const [playingVideo, setPlayingVideo] = useState(null);
  const videoRefs = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `/user-issue/department-issues/${departmentName}`
        );
        const issuesData = response.data || [];
        const inProgressIssues = issuesData.filter(
          (issue) =>
            issue.progress?.inProgress?.completed &&
            !issue.progress?.resolved?.completed
        );
        setIssues(inProgressIssues);
        setFilteredIssues(inProgressIssues);
        
        generateThumbnails(inProgressIssues);
      } catch (error) {
        console.error("Error fetching department issues:", error);
      }
    };

    if (departmentName) fetchData();
  }, [departmentName]);

  const generateThumbnails = async (issuesList) => {
    const thumbnailPromises = issuesList.map(async (issue) => {
      if (!issue.videoUrl) return null;

      try {
        return new Promise((resolve) => {
          const video = document.createElement('video');
          video.crossOrigin = 'anonymous';
          video.src = issue.videoUrl;
          video.currentTime = 0.5;
          
          video.addEventListener('loadeddata', () => {
            if (video.videoWidth > 0) {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = 320;
              canvas.height = 180;
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const thumbnailUrl = canvas.toDataURL('image/jpeg');
              resolve({ id: issue._id, thumbnail: thumbnailUrl });
            } else {
              resolve({ id: issue._id, thumbnail: null });
            }
          });
          
          video.addEventListener('error', () => {
            resolve({ id: issue._id, thumbnail: null });
          });
          
          setTimeout(() => resolve({ id: issue._id, thumbnail: null }), 3000);
        });
      } catch (error) {
        return { id: issue._id, thumbnail: null };
      }
    });

    const results = await Promise.all(thumbnailPromises);
    const thumbnailMap = {};
    results.forEach(result => {
      if (result) {
        thumbnailMap[result.id] = result.thumbnail;
      }
    });
    setThumbnails(thumbnailMap);
  };

  const handleVideoClick = (id) => {
    const video = videoRefs.current[id];
    if (video) {
      if (video.paused || video.ended) {
        video.play().catch(error => {
          console.error("Error playing video:", error);
        });
        setPlayingVideo(id);
      } else {
        video.pause();
        setPlayingVideo(null);
      }
    }
  };

  const handleVideoPlay = (id) => {
    setPlayingVideo(id);
  };

  const handleVideoPause = (id) => {
    setPlayingVideo(null);
  };

  const handleVideoEnd = (id) => {
    setPlayingVideo(null);
  };

  // Improved video controls handler
  const handleVideoControls = (id) => {
    const video = videoRefs.current[id];
    if (video) {
      // Toggle play/pause when controls are clicked
      if (video.paused || video.ended) {
        video.play().catch(error => {
          console.error("Error playing video:", error);
        });
      } else {
        video.pause();
      }
    }
  };

  const getStatusColor = (progress) => {
    if (progress.resolved?.completed) return "bg-green-500";
    if (progress.inProgress?.completed) return "bg-yellow-500";
    if (progress.verified?.completed) return "bg-blue-500";
    return "bg-gray-500";
  };

  const getStatusText = (progress) => {
    if (progress.resolved?.completed) return "Resolved";
    if (progress.inProgress?.completed) return "In Progress";
    if (progress.verified?.completed) return "Verified";
    return "Reported";
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-b from-blue-50 to-blue-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {departmentName} Department
          </h1>
          <p className="text-lg md:text-xl text-gray-600">Issues Currently In Progress</p>
          <div className="mt-3 md:mt-4 bg-white inline-flex rounded-full px-3 md:px-4 py-1 md:py-2 shadow">
            <span className="font-semibold text-gray-700 text-sm md:text-base">
              Total Issues: {filteredIssues.length}
            </span>
          </div>
        </div>

        {filteredIssues.length > 0 ? (
          <div className="space-y-4 md:space-y-6">
            {filteredIssues.map((issue) => (
              <div
                key={issue._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-yellow-500"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Video Section */}
                  {issue.videoUrl && (
                    <div className="w-full lg:w-2/5 xl:w-2/5 p-3 md:p-4">
                      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                        {/* Video Player - Always show controls but manage play state */}
                        <video
                          ref={(el) => (videoRefs.current[issue._id] = el)}
                          src={issue.videoUrl}
                          className="w-full h-full object-cover cursor-pointer"
                          muted
                          loop
                          playsInline
                          controls={playingVideo === issue._id}
                          onClick={() => handleVideoClick(issue._id)}
                          onPlay={() => handleVideoPlay(issue._id)}
                          onPause={() => handleVideoPause(issue._id)}
                          onEnded={() => handleVideoEnd(issue._id)}
                          onLoadedMetadata={() => {
                            // Ensure video is ready
                            if (videoRefs.current[issue._id]) {
                              videoRefs.current[issue._id].currentTime = 0;
                            }
                          }}
                        />
                        
                        {/* Thumbnail Overlay - Show when video is not playing and no controls are visible */}
                        {thumbnails[issue._id] && playingVideo !== issue._id && (
                          <div 
                            className="absolute inset-0 cursor-pointer bg-cover bg-center"
                            style={{ backgroundImage: `url(${thumbnails[issue._id]})` }}
                            onClick={() => handleVideoClick(issue._id)}
                          >
                            <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-all duration-200"></div>
                            
                            {/* Play Button Center */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black bg-opacity-60 rounded-full p-4 md:p-5 hover:bg-opacity-70 transition-all duration-200 hover:scale-110">
                                <svg 
                                  className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white" 
                                  fill="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                            </div>
                            
                            <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                              Click to play
                            </div>
                          </div>
                        )}
                        
                        {/* Loading State */}
                        {!thumbnails[issue._id] && playingVideo !== issue._id && (
                          <div 
                            className="absolute inset-0 bg-gray-800 flex items-center justify-center cursor-pointer"
                            onClick={() => handleVideoClick(issue._id)}
                          >
                            <div className="text-white text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                              <span className="text-sm">Loading video...</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Video status indicator */}
                      <div className="mt-2 text-center">
                        <span className="text-xs text-gray-600">
                          {playingVideo === issue._id ? 'Playing - Click video to pause' : 'Click to play video'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Content Section */}
                  <div className={`flex-1 p-4 md:p-6 ${issue.videoUrl ? 'lg:w-3/5 xl:w-3/5' : 'w-full'}`}>
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 md:mb-4 gap-2 md:gap-3">
                          <div className="flex-1">
                            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-1 line-clamp-2">
                              {issue.title}
                            </h3>
                            
                          </div>
                        </div>
                        
                        <div className="mb-4 md:mb-6">
                          <h4 className="font-semibold text-gray-700 mb-2 md:mb-3 text-sm md:text-base">Progress Timeline</h4>
                          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 md:gap-4 text-xs md:text-sm">
                            <div className="flex items-center">
                              <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-2"></div>
                              <span>Reported: {new Date(issue.progress.reported.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full mr-2"></div>
                              <span>Verified: {new Date(issue.progress.verified.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full mr-2"></div>
                              <span>In Progress: {new Date(issue.progress.inProgress.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                       {issue.location && (
  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
    
    {/* Location */}
    <div className="flex-1">
      <h4 className="font-semibold text-gray-700 mb-1 text-sm md:text-base">Location</h4>
      <div className="text-xs md:text-sm">
        <span className="font-medium">Reported Location:</span>
        <p>Lat: {issue.location.latitude}, Lng: {issue.location.longitude}</p>
      </div>
    </div>

    {/* Verifications */}
    <div className="flex-1">
      <h4 className="font-semibold text-gray-700 mb-1 text-sm md:text-base">Verifications</h4>
      <div className="flex gap-4 text-xs md:text-sm">
        <span className="text-green-600 font-medium">
          Real: {issue.verifications?.real?.length || 0}
        </span>
        <span className="text-red-600 font-medium">
          Fake: {issue.verifications?.fake?.length || 0}
        </span>
      </div>
    </div>

  </div>
)}


                      
                      </div>

                      <div className="pt-3 md:pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2 md:gap-3">
                        <NavLink
                          to={`/department/${departmentName}/mark-as-complete/${issue._id}`}
                          className="flex-1 px-4 md:px-6 py-2 md:py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-300 text-center shadow-md hover:shadow-lg text-sm md:text-base"
                        >
                          Mark as Resolved
                        </NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 md:py-12 bg-white rounded-xl shadow-lg">
            <div className="text-4xl md:text-6xl mb-3 md:mb-4">✅</div>
            <p className="text-lg md:text-xl text-gray-600 mb-2">No issues currently in progress</p>
            <p className="text-gray-500 text-sm md:text-base">All issues are either pending or resolved.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;