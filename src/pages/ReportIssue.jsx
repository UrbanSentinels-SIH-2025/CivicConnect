import React, { useState, useRef, useEffect } from "react";
import {
  FaFlag,
  FaCamera,
  FaCameraRetro,
  FaCheckCircle,
  FaArrowRight,
  FaTimes,
  FaMapMarkerAlt,
} from "react-icons/fa";

const ReportIssue = () => {
  const [cameraStarted, setCameraStarted] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [cameraError, setCameraError] = useState(null);
  const [stream, setStream] = useState(null);
  const [formData, setFormData] = useState({
    issueType: "",
    description: "",
    location: "",
    coordinates: null
  });
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        
        const { latitude, longitude } = position.coords;
        setFormData(prevState => ({
          ...prevState,
          coordinates: { latitude, longitude }
        }));
        
        // Reverse geocode to get address from coordinates
        reverseGeocode(latitude, longitude);
        setLocationLoading(false);
      },
      (error) => {
        setLocationLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access denied. Please enable location permissions.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError("An unknown error occurred.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Reverse geocode coordinates to get address
  const reverseGeocode = async (lat, lng) => {
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      const data = await response.json();
      
      if (data && data.display_name) {
        setFormData(prevState => ({
          ...prevState,
          location: data.display_name
        }));
      } else {
        setFormData(prevState => ({
          ...prevState,
          location: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
        }));
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      setFormData(prevState => ({
        ...prevState,
        location: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
      }));
    }
  };

  // Start the camera
  const handleStartCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // back camera on mobile
        audio: false,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play(); // 👈 Force play
      }

      setCameraStarted(true);
    } catch (err) {
      setCameraError("Could not access camera. Please check permissions.");
      console.error("Camera error:", err);
    }
  };

  // Stop the camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraStarted(false);
  };

  // Capture image from camera
  const handleCaptureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image data URL
      const imageDataUrl = canvas.toDataURL("image/png");
      console.log("Captured image data URL:", imageDataUrl);
      // Add to captured images array
      setCapturedImages([...capturedImages, imageDataUrl]);
    }
  };

  // Remove a captured image
  const removeImage = (index) => {
    const newImages = [...capturedImages];
    newImages.splice(index, 1);
    setCapturedImages(newImages);
  };

  // Clean up on component unmount
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => {
        console.error("Video play error:", err);
      });
    }
  }, [stream]);

  // Handle form submission
  const handleSubmitReport = async () => {
    // Validate form data
    if (!formData.issueType) {
      alert("Please select an issue type");
      return;
    }
    
    if (!formData.description) {
      alert("Please provide a description");
      return;
    }
    
    if (!formData.location) {
      alert("Please get your location first");
      return;
    }

    const submitData = new FormData();
    submitData.append("issueType", formData.issueType);
    submitData.append("description", formData.description);
    submitData.append("location", formData.location);
    
    // Add coordinates if available
    if (formData.coordinates) {
      submitData.append("latitude", formData.coordinates.latitude);
      submitData.append("longitude", formData.coordinates.longitude);
    }

    // Convert each base64 image to a Blob and append
    capturedImages.forEach((dataUrl, index) => {
      const arr = dataUrl.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      const blob = new Blob([u8arr], { type: mime });
      submitData.append("images", blob, `image-${index}.png`);
    });

    try {
      const response = await fetch("http://localhost:5000/report-issue", {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();
      console.log("Server response:", data);

      // Clear form and captured images on success
      setFormData({
        issueType: "",
        description: "",
        location: "",
        coordinates: null
      });
      setCapturedImages([]);
      
      alert("Report submitted successfully!");
    } catch (err) {
      console.error("Error submitting report:", err);
      alert("Error submitting report. Please try again.");
    }
  };

  return (
    <div className="p-2 md:p-3">
      <div className="md:w-[60%] mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
            <FaFlag className="text-blue-600 text-xl" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Report an Issue
          </h1>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaCamera className="text-blue-600 mr-2" />
            Capture Image
          </h2>

          <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden relative">
            {cameraStarted ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-gray-400">Camera feed will appear here</p>
            )}

            {/* Hidden canvas for capturing images */}
            <canvas ref={canvasRef} className="hidden" />

            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-80">
                <p className="text-red-600 font-medium text-center p-4">
                  {cameraError}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-center">
            {!cameraStarted ? (
              <button
                onClick={handleStartCamera}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <FaCamera className="mr-2" />
                Open Camera
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Close Camera
                </button>
                <button
                  onClick={handleCaptureImage}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center"
                >
                  <FaCameraRetro className="mr-2" />
                  Capture Picture
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Image Previews */}
        {capturedImages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Captured Images
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {capturedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Captured ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Issue Details Form */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg 
              className="w-5 h-5 text-blue-600 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" 
              />
            </svg>
            Issue Details
          </h2>
          
          <div className="gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Type
              </label>
              <select 
                name="issueType"
                value={formData.issueType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Select issue type</option>
                <option value="Damage">Damage</option>
                <option value="Malfunction">Malfunction</option>
                <option value="Safety Concern">Safety Concern</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-32"
              placeholder="Please describe the issue in detail..."
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="flex items-center">
              <input
                type="text"
                name="location"
                value={formData.location}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Click the button to get your location"
              />
              <button
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center disabled:bg-gray-400"
              >
                {locationLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Locating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    Get Location
                  </span>
                )}
              </button>
            </div>
            {locationError && (
              <p className="text-red-500 text-sm mt-1">{locationError}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmitReport}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center"
          >
            Submit Report <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;