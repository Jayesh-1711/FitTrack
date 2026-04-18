import {
  MapContainer,
  Marker,
  TileLayer,
  Polyline,
  useMap
} from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function Recenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) map.setView(position, 16);
  }, [position]);

  return null;
}

function getDistance(lat1, lon1, lat2, lon2) {

  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function RunTracker() {

  const [position, setPosition] = useState(null);
  const [path, setPath] = useState([]);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);

  
  const [isRunning, setIsRunning] = useState(false);

  const navigate = useNavigate();

  const watchIdRef = useRef(null);
  const timeRef = useRef(null);
  const lastPointRef = useRef(null);

  const startTracking = () => {

    if (watchIdRef.current) return;

    
    setIsRunning(true);

    setPath([]);
    setDistance(0);
    setTime(0);
    lastPointRef.current = null;

    timeRef.current = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);

    watchIdRef.current = navigator.geolocation.watchPosition(

      (pos) => {

        const { latitude, longitude } = pos.coords;

        const newPoint = [latitude, longitude];

        setPosition(newPoint);

        if (!lastPointRef.current) {
          lastPointRef.current = newPoint;
          setPath([newPoint]);
          return;
        }

        const d = getDistance(
          lastPointRef.current[0],
          lastPointRef.current[1],
          latitude,
          longitude
        );

        const MAX_DISTANCE = 0.2;

        if (
          lastPointRef.current[0] === latitude &&
          lastPointRef.current[1] === longitude
        ) return;

        if (d < 0.003) return;

        if (d > MAX_DISTANCE) return;

        setDistance(prev => prev + d);
        setPath(prev => [...prev, newPoint]);
        lastPointRef.current = newPoint;

      },

      (err) => console.error(err),

      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000
      }

    );

  };

  const stopTracking = async () => {

    
    setIsRunning(false);

    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    clearInterval(timeRef.current);

    if (distance === 0 || path.length < 2) {
      alert("Run too short to save");
      return;
    }

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/user/log")
      }

      const res = await fetch(
        "https://fittrack-4-mlfn.onrender.com/api/run/RunTrack",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            distance,
            duration: time,
            pace: distance > 0 ? time / 60 / distance : 0,
            route: path.map(p => ({ lat: p[0], lng: p[1] }))
          })
        }
      );

      if (!res.ok) {
        alert("Failed to save run. Please login again.");
        return;
      }

      alert("Run saved successfully 🎉");

      navigate("/profile");

    } catch (err) {

      console.error(err);
      alert("Server error while saving run");

    }

  };

  const pace =
    distance > 0 ? (time / 60 / distance).toFixed(2) : "0.00";

  return (
  <div className="h-[100dvh] w-full bg-black text-white relative overflow-hidden">

    
    <MapContainer
      center={[28.6139, 77.2090]}
      zoom={15}
      className="h-full w-full z-0"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {position && <Marker position={position} />}

      {path.length > 1 && (
        <Polyline
          positions={path}
          pathOptions={{
            color: "#22c55e",
            weight: 6,
            opacity: 0.9
          }}
        />
      )}

      <Recenter position={position} />
    </MapContainer>

    
    <div className="absolute top-0 left-0 w-full flex justify-between items-center px-4 py-3 z-[1000]">
      <h2 className="text-lg font-semibold bg-black/70 px-3 py-1 rounded-lg backdrop-blur-md">
        🏃 Run Tracker
      </h2>

      <button
        onClick={() => navigate("/profile")}
        className="bg-orange-500 px-3 py-2 rounded-lg text-sm shadow-md active:scale-95"
      >
        Profile
      </button>
    </div>

    
    <div className="absolute top-14 left-4 z-[1000]">
      <p className="text-xs bg-black/40 px-3 py-1 rounded-lg backdrop-blur-md text-gray-200">
        {position ? "📍 Tracking Active" : "📡 Waiting for GPS..."}
      </p>
    </div>

    
    <div className="absolute bottom-24 left-0 w-full z-[1000] px-4">
      <div className="bg-black/70 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/10">

        <div className="grid grid-cols-3 text-center">

          <div>
            <p className="text-gray-400 text-xs">Time</p>
            <h2 className="text-xl font-extrabold text-white tracking-wide">
              {Math.floor(time / 60)}:
              {String(time % 60).padStart(2, "0")}
            </h2>
          </div>

          <div>
            <p className="text-gray-400 text-xs">Distance</p>
            <h2 className="text-xl font-extrabold text-white tracking-wide">
              {distance.toFixed(2)} km
            </h2>
          </div>

          <div>
            <p className="text-gray-400 text-xs">Pace</p>
            <h2 className="text-xl font-extrabold text-white tracking-wide">
              {pace} /km
            </h2>
          </div>

        </div>

        {/* LIVE SPEED */}
        <div className="mt-3 text-center text-sm text-green-400 font-semibold">
          ⚡ Speed: {distance > 0 ? (distance / (time / 3600)).toFixed(2) : 0} km/h
        </div>

      </div>
    </div>

    
    <div className="absolute bottom-51 left-0 w-full flex justify-center z-[1000]">
      <button
        onClick={isRunning ? stopTracking : startTracking}   
        className={`w-20 h-20 rounded-full text-xl font-bold shadow-xl active:scale-95 transition duration-150
        ${isRunning ? "bg-orange-500" : "bg-black/70"}`}      
      >
        {isRunning ? "■" : "▶"}                               
      </button>
    </div>
<div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">

  <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl py-3 px-4 flex justify-between items-center shadow-lg">

    <button
      onClick={() => navigate("/home")}
      className="flex flex-col items-center text-gray-300 text-xs active:scale-95"
    >
      🏠
      <span>Home</span>
    </button>

    <button
      onClick={() => navigate("/track")}
      className="flex flex-col items-center text-gray-300 text-xs active:scale-95"
    >
      ▶
      <span>Track</span>
    </button>

    <button
      onClick={() => navigate("/profile")}
      className="flex flex-col items-center text-gray-300 text-xs active:scale-95"
    >
      👤
      <span>Profile</span>
    </button>

  </div>

</div>
  </div>
);

}