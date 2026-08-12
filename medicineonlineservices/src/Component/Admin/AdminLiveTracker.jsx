import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigation, StopCircle } from 'lucide-react';

export default function AdminLiveTracker({ orderId }) {
  const [isTracking, setIsTracking] = useState(false);
  const [lastCoords, setLastCoords] = useState({ lat: null, lng: null });
  const [watchId, setWatchId] = useState(null);

  const startLiveTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsTracking(true);

    // Browser ka real-time GPS watchPosition use karte hain
    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLastCoords({ lat: latitude, lng: longitude });

        try {
          // Aapka .NET Backend API Endpoint
          await axios.post(
          //  "http://localhost:5256/api/TrackingAPI/update-location",
            "https://ecommerencesite.onrender.com/api/TrackingAPI/update-location",
            
            {
            orderId: Number(orderId),
            latitude: latitude,
            longitude: longitude
          });
          console.log("Location sent successfully:", latitude, longitude);
        } catch (error) {
          console.error("Failed to send location update:", error);
        }
      },
      (error) => {
        console.error("GPS Error:", error);
        alert("GPS error: " + error.message);
      },
      { 
        enableHighAccuracy: true, 
        maximumAge: 0, 
        timeout: 5000 
      }
    );

    setWatchId(id);
  };

  const stopLiveTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
    alert("Live tracking stopped.");
  };

  // Component unmount hone par GPS tracking band kar dein
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div className="card bg-dark text-white p-4 border border-secondary rounded-4 shadow">
      <h5 className="fw-bold mb-3">Admin / Delivery Dispatch Panel</h5>
      <p className="text-muted small">Order ID: <span className="text-info fw-bold">{orderId}</span></p>

      <div className="mb-3">
        <p className="mb-1"><strong>Current Broadcast Lat:</strong> {lastCoords.lat || "N/A"}</p>
        <p className="mb-1"><strong>Current Broadcast Lng:</strong> {lastCoords.lng || "N/A"}</p>
      </div>

      {!isTracking ? (
        <button 
          className="btn btn-success w-100 rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
          onClick={startLiveTracking}
        >
          <Navigation size={18} /> Start Live GPS Tracking & Dispatch
        </button>
      ) : (
        <button 
          className="btn btn-danger w-100 rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
          onClick={stopLiveTracking}
        >
          <StopCircle size={18} /> Stop Live Tracking
        </button>
      )}
    </div>
  );
}