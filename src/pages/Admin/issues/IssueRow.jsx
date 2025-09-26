import { NavLink } from "react-router-dom"

const IssueRow = ({ issue, onWatchVideo }) => {
  const getStatus = (progress) => {
    if (progress.resolved?.completed) return 'Resolved'
    if (progress.inProgress?.completed) return 'In Progress'
    if (progress.reported?.completed) return 'Pending'
    return 'Unknown'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const status = getStatus(issue.progress)
  const statusColor = getStatusColor(status)

  const hasVideo = issue.videoUrl && issue.videoUrl.trim() !== ''

  const handleWatchVideo = () => {
    if (hasVideo) {
      onWatchVideo(issue.videoUrl, issue.title)
    }
  }

  const handleThumbnailClick = () => {
    if (hasVideo) {
      onWatchVideo(issue.videoUrl, issue.title)
    }
  }

  // Generate thumbnail URL
  const getThumbnailUrl = (videoUrl) => {
    return videoUrl
      .replace("/upload/", "/upload/so_1/")
      .replace(/\.(mp4|webm|mov)$/, ".jpg");
  };

  return (
    <tr className="hover:bg-gradient-to-r hover:from-blue-50/60 hover:to-cyan-50/40 transition-all duration-300 group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Enhanced Media Thumbnail */}
          {hasVideo ? (
            <div 
              className="relative group cursor-pointer flex-shrink-0 transform hover:scale-105 transition-transform duration-200"
              onClick={handleThumbnailClick}
            >
              <div className="w-16 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden flex items-center justify-center border border-gray-300 shadow-sm group-hover:shadow-md transition-shadow">
                <img 
                  src={getThumbnailUrl(issue.videoUrl)} 
                  alt="Issue thumbnail"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-all duration-300 group-hover:bg-black/20`}>
                  <div className="bg-black/60 rounded-full p-1.5 transform group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 bg-black/80 rounded px-1 py-0.5">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-16 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border border-gray-300 shadow-sm flex-shrink-0 group-hover:shadow-md transition-shadow">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
              {issue.title}
            </div>
            <div className="text-sm text-gray-600 truncate mt-0.5">{issue.description}</div>
            {hasVideo && (
              <button 
                onClick={handleWatchVideo}
                className="mt-1 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-all duration-200 font-medium transform hover:translate-x-1"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch Video Evidence
              </button>
            )}
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-semibold text-gray-800 bg-blue-50/50 px-2.5 py-1 rounded-full border border-blue-100">
            {issue.category || 'Uncategorized'}
          </span>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 group-hover:shadow-md ${statusColor}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
          {status}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {issue.createdBy?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
              {issue.createdBy?.name || 'Unknown'}
            </div>
            <div className="text-xs text-gray-500 truncate max-w-[120px] group-hover:text-gray-600 transition-colors">
              {issue.createdBy?.email}
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-right">
          <div className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
            {new Date(issue.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          <div className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
            {new Date(issue.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <NavLink 
          to={`/admin/issue-detail/${issue._id}`}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md text-xs transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Details
        </NavLink>
      </td>
    </tr>
  )
}

export default IssueRow;