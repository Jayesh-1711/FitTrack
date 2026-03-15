import {
  MapContainer,
  Marker,
  TileLayer,
  Polyline,
  useMap
} from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const MIN_DISTANCE = 0.005;

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

  const navigate = useNavigate();

  const watchIdRef = useRef(null);
  const timeRef = useRef(null);
  const lastPointRef = useRef(null);

  const startTracking = () => {

    if (watchIdRef.current) return;

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

        if (d < MIN_DISTANCE) return;

        setDistance(prev => prev + d);

        setPath(prev => [...prev, newPoint]);

        lastPointRef.current = newPoint;

      },

      (err) => console.error(err),

      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }

    );

  };

  const stopTracking = async () => {

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
        return;
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

    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", background:"#0F0F0F", color:"#FFFFFF" }}>

      {/* HEADER */}

      <div
        style={{
          height: "60px",
          background: "#0F0F0F",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px"
        }}
      >

        <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
          Run Tracker
        </h2>

        <button
          onClick={() => navigate("/profile")}
          style={{
            background: "#F97316",
            border: "none",
            padding: "8px 14px",
            borderRadius: "8px",
            color: "#FFFFFF",
            cursor: "pointer"
          }}
        >
          Profile
        </button>

      </div>

      {/* MAP */}

      <div style={{ flex: 1 }}>

        <MapContainer
          center={[28.6139, 77.2090]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {position && <Marker position={position} />}

          {path.length > 1 && (

            <Polyline
              positions={path}
              pathOptions={{
                color: "#F97316",
                weight: 6,
                opacity: 0.9
              }}
            />

          )}

          <Recenter position={position} />

        </MapContainer>

      </div>

      {/* CONTROLS */}

      <div
        style={{
          padding: "12px",
          background: "#1A1A1A",
          borderTop: "1px solid #2A2A2A",
          color:"#FFFFFF"
        }}
      >

        <p>{position ? position.join(", ") : "Waiting for GPS..."}</p>

        <p>
          ⏱ {Math.floor(time / 60)}:
          {String(time % 60).padStart(2, "0")}
        </p>

        <p>📏 {distance.toFixed(2)} km</p>

        <p>⚡ {pace} min/km</p>

        <div style={{ display: "flex", gap: "10px" }}>

          <button
            onClick={startTracking}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "12px",
              background: "#22C55E",
              color: "#FFFFFF",
              border: "none"
            }}
          >
            Start
          </button>

          <button
            onClick={stopTracking}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "12px",
              background: "#FB923C",
              color: "#FFFFFF",
              border: "none"
            }}
          >
            Stop
          </button>

        </div>

      </div>

    </div>

  );

}