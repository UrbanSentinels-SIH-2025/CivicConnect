import React from "react";

const OpenInGoogleMaps = ({ lat, lng }) => {
  const handleOpenInGoogleMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(googleMapsUrl, "_blank"); // opens in new tab
  };

  return (
    <button
      onClick={handleOpenInGoogleMaps}
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
    >
      Open in Google Maps
    </button>
  );
};

export default OpenInGoogleMaps;
