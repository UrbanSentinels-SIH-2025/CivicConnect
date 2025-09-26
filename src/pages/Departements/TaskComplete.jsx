import React, { useState, useRef, useEffect } from "react";
import api from "../../api/axios";
import { useParams } from "react-router-dom";

const TaskComplete = () => {
  const { issueId } = useParams(); // Get issue ID from URL params
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [location, setLocation] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isLocationFetching, setIsLocationFetching] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobileDevice(isMobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Get user location on component mount
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setIsLocationFetching(true);
        setLocationError(null);
        await getLocation();
      } catch (error) {
        setLocationError(error.message);
      } finally {
        setIsLocationFetching(false);
      }
    };

    fetchLocation();
  }, []);

  // Get user location
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = new Error("Geolocation not supported by this browser.");
        setLocationError(error.message);
        reject(error);
        return;
      }

      setUploadStatus("Fetching your location...");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(locationData);
          setUploadStatus("Location fetched successfully!");
          setTimeout(() => setUploadStatus(""), 2000);
          resolve(locationData);
        },
        (error) => {
          let errorMessage = "Error getting location: ";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "User denied the request for Geolocation.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "The request to get location timed out.";
              break;
            default:
              errorMessage += "An unknown error occurred.";
              break;
          }
          setLocationError(errorMessage);
          setUploadStatus(errorMessage);
          reject(new Error(errorMessage));
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 60000 
        }
      );
    });
  };

  // Retry location fetch
  const retryLocationFetch = async () => {
    try {
      setIsLocationFetching(true);
      setLocationError(null);
      await getLocation();
    } catch (error) {
      setLocationError(error.message);
    } finally {
      setIsLocationFetching(false);
    }
  };

  // Start camera
  const startCamera = async () => {
    // Check if location is available before starting camera
    if (!location) {
      setUploadStatus("Please enable location access first to start camera.");
      setTimeout(() => setUploadStatus(""), 3000);
      return;
    }

    try {
      setUploadStatus("Starting camera...");

      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: isMobileDevice ? { ideal: "environment" } : "user",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      setIsCameraActive(true);
      setUploadStatus("");

      if (stream.getAudioTracks().length === 0) {
        setUploadStatus("Microphone not available. Recording without audio.");
        setTimeout(() => setUploadStatus(""), 3000);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);

      // If back camera fails on mobile, try front camera as fallback
      if (isMobileDevice && err.name === "OverconstrainedError") {
        try {
          const fallbackConstraints = {
            video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
            audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 },
          };
          const stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
          streamRef.current = stream;
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
          setIsCameraActive(true);
          setUploadStatus("Using front camera (back camera unavailable)");
          setTimeout(() => setUploadStatus(""), 3000);
          return;
        } catch (fallbackError) {
          console.error("Error accessing front camera:", fallbackError);
        }
      }

      if (err.name === "NotAllowedError") {
        setUploadStatus("Permission denied. Please allow camera and microphone access.");
      } else {
        setUploadStatus("Could not access camera. Please check permissions.");
      }
      setTimeout(() => setUploadStatus(""), 3000);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  // Start recording
  const startRecording = () => {
    if (!streamRef.current) return;
    if (!location) {
      setUploadStatus("Location required before recording. Please enable location access.");
      return;
    }

    setUploadStatus("Recording started...");
    chunksRef.current = [];
    setChunks([]);
    setRecordingTime(0);

    const options = { mimeType: "video/webm; codecs=vp9,opus" };
    const recorder = new MediaRecorder(streamRef.current, options);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
        setChunks((prev) => [...prev, e.data]);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoURL(url);
      setUploadStatus("Recording completed. Ready to submit.");
      clearInterval(timerRef.current);
      setTimeout(() => setUploadStatus(""), 2000);
    };

    timerRef.current = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    recorder.start(1000);
    setMediaRecorder(recorder);
    setRecording(true);
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder) mediaRecorder.stop();
    setRecording(false);
    stopCamera();
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Upload video and mark issue as resolved
  const uploadVideo = async () => {
    if (!chunksRef.current.length) {
      setUploadStatus("No recording found. Please record a video first.");
      setTimeout(() => setUploadStatus(""), 3000);
      return;
    }

    if (!location) {
      setUploadStatus("Location required. Please enable location access and try again.");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Uploading video and updating issue...");

    try {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const formData = new FormData();
      formData.append("video", blob, "taskRecording.webm");
      formData.append("id", issueId); 
      formData.append("progressStage", "resolved");

      if (location) {
        formData.append("lat", location.lat);
        formData.append("lng", location.lng);
      }

      const res = await api.patch(`/user-issue/department-issues/progress`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      console.log("Issue updated:", res.data);
      setUploadStatus("Issue marked as resolved and video uploaded!");
      setVideoURL(null);
      chunksRef.current = [];
      setChunks([]);
      setRecordingTime(0);

      setTimeout(() => {
        setUploadStatus("");
        setIsUploading(false);
      }, 3000);
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadStatus("Failed to upload video or update issue. Try again.");
      setTimeout(() => {
        setUploadStatus("");
        setIsUploading(false);
      }, 3000);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 py-4 rounded-xl">
        Submit the issue as complete
      </h2>
      
      {/* Location Status */}
      {isLocationFetching && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-700 font-medium">Fetching your current location...</span>
          </div>
        </div>
      )}

      {locationError && !isLocationFetching && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="text-center">
            <p className="text-red-700 font-medium mb-3">{locationError}</p>
            <button 
              onClick={retryLocationFetch}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry Location Access
            </button>
          </div>
        </div>
      )}

      {location && !isLocationFetching && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="text-center">
            <p className="text-green-700 font-medium">
              ✓ Location acquired: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left column */}
        <div>
          <div className="mb-6 relative rounded-xl overflow-hidden shadow-md">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-64 md:h-80 bg-gray-900 object-cover" />
            {!isCameraActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="text-center text-gray-300">
                  <svg className="w-16 h-16 mx-auto mb-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Camera feed will appear here</p>
                  <p className="text-xs mt-1 opacity-75">
                    {location ? "Ready to record" : "Location required to start"}
                  </p>
                </div>
              </div>
            )}
            {recording && (
              <div className="absolute top-4 right-4 flex items-center bg-red-600 text-white px-3 py-1 rounded-full">
                <div className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium">Recording {formatTime(recordingTime)}</span>
              </div>
            )}
          </div>
          
          {/* Camera & Recording Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {!isCameraActive ? (
              <button 
                onClick={startCamera} 
                disabled={!location || isLocationFetching}
                className={`flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-300 transform shadow-md ${
                  location && !isLocationFetching 
                    ? "bg-blue-600 hover:bg-blue-700 text-white hover:-translate-y-1" 
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                {isLocationFetching ? "Getting Location..." : "Start Camera"}
              </button>
            ) : (
              <button onClick={stopCamera} className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 shadow-md">
                Stop Camera
              </button>
            )}
            
            {!recording ? (
              <button 
                onClick={startRecording} 
                disabled={!isCameraActive || !location}
                className={`flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-300 transform shadow-md ${
                  isCameraActive && location 
                    ? "bg-green-600 hover:bg-green-700 text-white hover:-translate-y-1" 
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                Start Recording
              </button>
            ) : (
              <button onClick={stopRecording} className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 transform hover:-translate-y-1 shadow-md">
                Stop Recording
              </button>
            )}
          </div>
        </div>

        {/* Right column */}
        <div>
          {videoURL && (
            <div className="mt-6 p-5 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-md">
              <h3 className="font-semibold text-lg mb-3 text-gray-700">Recording Preview</h3>
              <video src={videoURL} controls className="w-full h-48 rounded-lg mb-4 shadow-inner" />
              <button 
                onClick={uploadVideo} 
                disabled={isUploading || !location}
                className={`w-full flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-300 shadow-md ${
                  isUploading 
                    ? "bg-purple-400 cursor-not-allowed" 
                    : location 
                    ? "bg-purple-600 hover:bg-purple-700 hover:-translate-y-1 text-white"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                {isUploading ? "Processing..." : "Mark Task as Complete"}
              </button>
            </div>
          )}
        </div>
      </div>

      {uploadStatus && (
        <div className={`mt-4 p-4 rounded-xl text-center transition-all duration-300 ${
          uploadStatus.includes("Failed") || uploadStatus.includes("Please") || uploadStatus.includes("denied") || uploadStatus.includes("Error") 
            ? "bg-yellow-100 text-yellow-700 border border-yellow-200" 
            : "bg-blue-100 text-blue-700 border border-blue-200"
        }`}>
          {uploadStatus}
        </div>
      )}
    </div>
  );
};

export default TaskComplete;