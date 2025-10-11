import React, { useState, useRef, useEffect } from "react";
import api from "../api/axios";

const ReportIssue = () => {
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobileDevice(isMobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Get user location
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(locationData);
          resolve(locationData);
        },
        (error) => {
          console.error("Error getting location:", error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  };

  // Start camera with appropriate camera selection
  const startCamera = async () => {
    try {
      setUploadStatus("Starting camera...");

      // Set camera constraints based on device type
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: isMobileDevice ? { exact: "environment" } : "user",
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

      // Check if we actually got audio
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        setUploadStatus("Microphone not available. Recording without audio.");
        setTimeout(() => setUploadStatus(""), 3000);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);

      // If back camera fails on mobile, try front camera as fallback
      if (
        isMobileDevice &&
        err.name === "OverconstrainedError" &&
        err.constraint === "facingMode"
      ) {
        setUploadStatus("Back camera not available. Trying front camera...");

        try {
          const fallbackConstraints = {
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: "user",
            },
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              sampleRate: 44100,
            },
          };

          const stream = await navigator.mediaDevices.getUserMedia(
            fallbackConstraints
          );
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
        setUploadStatus(
          "Permission denied. Please allow camera and microphone access."
        );
      } else {
        setUploadStatus("Could not access camera. Please check permissions.");
      }
      setTimeout(() => setUploadStatus(""), 3000);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  // Start recording
  const startRecording = () => {
    if (!streamRef.current) return;

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

    // Start recording timer
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    recorder.start(1000);
    setMediaRecorder(recorder);
    setRecording(true);
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      stopCamera();
    }
  };

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Upload video
  const uploadVideo = async () => {
    if (!chunksRef.current.length) {
      setUploadStatus("No recording found. Please record a video first.");
      setTimeout(() => setUploadStatus(""), 3000);
      return;
    }

    if (!category) {
      setUploadStatus("Please select a category first.");
      setTimeout(() => setUploadStatus(""), 3000);
      return;
    }

    setIsUploading(true);
    setUploadStatus("Capturing your location...");

    try {
      // Get location with error handling
      let locationData = location;
      if (!locationData) {
        locationData = await getLocation();
      }

      // Generate title based on category + timestamp
      const now = new Date();
      const formattedDate = now.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      const title = `${category} – ${formattedDate}`;

      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const formData = new FormData();
      formData.append("video", blob, "recorded-video.webm");
      formData.append("category", category);
      formData.append("title", title);
      formData.append("latitude", Number(locationData.lat));
      formData.append("longitude", Number(locationData.lng));

      setUploadStatus("Uploading...");

      const res = await fetch(`${api.defaults.baseURL}/report-issue`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      console.log("Upload success:", data);
      setUploadStatus("Issue reported successfully!");

      // Reset form
      setVideoURL(null);
      setCategory("");
      chunksRef.current = [];
      setChunks([]);
      setRecordingTime(0);

      setTimeout(() => {
        setUploadStatus("");
        setIsUploading(false);
      }, 3000);
    } catch (err) {
      console.error("Upload failed:", err);
      let errorMessage = "Upload failed. Please try again.";

      if (
        err.message.includes("geolocation") ||
        err.message.includes("location")
      ) {
        errorMessage =
          "Location access denied. Please enable location services to report an issue.";
      }

      setUploadStatus(errorMessage);
      setTimeout(() => {
        setUploadStatus("");
        setIsUploading(false);
      }, 3000);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#D9F3FF] via-[#EAF9FB] to-[#fafa98]   font-rozha">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700 bg-gradient-to-r from-blue-200 to-indigo-100 py-4 rounded-xl font-iceberg">
        Report an Issue
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left column - Camera and controls */}
        <div>
          <div className="mb-6 relative rounded-xl overflow-hidden shadow-md">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 md:h-80 bg-gray-900 object-cover"
            />
            {!isCameraActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="text-center text-gray-300">
                  <svg
                    className="w-16 h-16 mx-auto mb-2 opacity-70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm">Camera feed will appear here</p>
                  <p className="text-xs mt-1 opacity-75">
                    {isMobileDevice
                      ? "Using back camera"
                      : "Using front camera"}
                  </p>
                </div>
              </div>
            )}

            {recording && (
              <div className="absolute top-4 right-4 flex items-center bg-red-600 text-white px-3 py-1 rounded-full">
                <div className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium">
                  Recording {formatTime(recordingTime)}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {!isCameraActive ? (
              <button
                onClick={startCamera}
                className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 shadow-md"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Start Camera
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 shadow-md"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Stop Camera
              </button>
            )}


           {!recording ? (
  <button
    onClick={startRecording}
    disabled={!isCameraActive}
    className={`flex items-center justify-center px-5 py-3 font-iceberg rounded-2xl transition-all duration-300 transform shadow-md ${
      isCameraActive
        ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-[0_0_15px_#22c55e] hover:scale-105"
        : "bg-gray-500 text-gray-300 cursor-not-allowed opacity-70"
    }`}
  >
    <svg
      className="w-5 h-5 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
      />
    </svg>
    Start Recording
  </button>
) : (
  <button
    onClick={stopRecording}
    className="flex items-center justify-center px-5 py-3 font-iceberg rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-[0_0_15px_#ef4444] transition-all duration-300 transform hover:scale-105"
  >
    <svg
      className="w-5 h-5 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
      />
    </svg>
    Stop Recording
  </button>
)}

          </div>
        </div>

        {/* Right column - Category selection and preview */}
        <div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3 text-lg font-iceberg">
              Issue Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
             {["Road", "Water", "Electricity", "Sanitation"].map((opt) => (
  <button
    key={opt}
    type="button"
    onClick={() => setCategory(opt)}
    className={`py-3 px-6 rounded-2xl text-sm font-bold transition-all duration-300 transform ${
      category === opt
        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-2 border-blue-400 shadow-[0_0_15px_#3b82f6] scale-105"
        : "bg-black text-gray-300 border border-gray-700 hover:border-blue-500 hover:shadow-[0_0_12px_#3b82f6] hover:text-white hover:scale-105"
    }`}
  >
    {opt}
  </button>
))}

            </div>
          </div>

          {videoURL && (
            <div className="mt-6 p-5 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-md">
              <h3 className="font-semibold text-lg mb-3 text-gray-700 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Recording Preview
              </h3>
              <video
                src={videoURL}
                controls
                className="w-full h-48 rounded-lg mb-4 shadow-inner"
              />

              <div className="flex items-center mb-4 p-3 bg-white rounded-lg shadow-sm">
                <svg
                  className="w-5 h-5 mr-2 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm text-gray-600">
                  {location
                    ? `Location will be captured on submit`
                    : "Location will be captured on submit"}
                </span>
              </div>

              <button
                onClick={uploadVideo}
                disabled={isUploading}
                className={`w-full flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-300 shadow-md ${
                  isUploading
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 hover:-translate-y-1"
                }`}
              >
                {isUploading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Submit Issue Report
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {uploadStatus && (
        <div
          className={`mt-4 p-4 rounded-xl text-center transition-all duration-300 ${
            uploadStatus.includes("success")
              ? "bg-green-100 text-green-700 border border-green-200"
              : uploadStatus.includes("Failed") ||
                uploadStatus.includes("Please") ||
                uploadStatus.includes("denied")
              ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
              : "bg-blue-100 text-blue-700 border border-blue-200"
          }`}
        >
          {uploadStatus}
        </div>
      )}
    </div>
  );
};

export default ReportIssue;
