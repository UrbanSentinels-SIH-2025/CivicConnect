import React from "react";

const VideoModal = ({ selectedVideo, closeVideoModal }) => {
  if (!selectedVideo) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-start justify-center z-50 p-4 pt-20"
      onClick={closeVideoModal}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[calc(100vh-6rem)] flex flex-col mt-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900 truncate max-w-[80%]">
            {selectedVideo.title}
          </h3>
          <button
            onClick={closeVideoModal}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            ×
          </button>
        </div>

        {/* Video Section */}
        <div className="p-4 flex-1 min-h-0 flex items-center justify-center">
          <div className="w-full bg-black rounded-lg overflow-hidden">
            <video
              controls
              autoPlay
              className="w-full h-full max-h-[60vh] object-contain"
              onError={(e) => {
                console.error("Video loading error");
                const errorMsg = document.createElement("div");
                errorMsg.className = "text-white p-4 text-center";
                errorMsg.innerHTML = `
                  <p>Video cannot be played.</p>
                  <a href="${selectedVideo.url}" target="_blank" class="text-blue-400 underline mt-2 inline-block">
                    Download video instead
                  </a>
                `;
                e.target.parentNode.appendChild(errorMsg);
                e.target.style.display = "none";
              }}
            >
              <source src={selectedVideo.url} type="video/mp4" />
              <source src={selectedVideo.url} type="video/webm" />
              <source src={selectedVideo.url} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between items-center">
          <a
            href={selectedVideo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Download Video
          </a>
          <button
            onClick={closeVideoModal}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
