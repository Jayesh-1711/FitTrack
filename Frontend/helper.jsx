import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap
} from "react-leaflet";
import { useEffect, useRef, useState } from "react";

function Recenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 16);
  }, [position]);
  return null;
}

// 🔹 distance formula (Haversine)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
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

  const watchIdRef = useRef(null);
  const timerRef = useRef(null);
  const lastPointRef = useRef(null);

  const startTracking = () => {
    if (watchIdRef.current) return;

    // reset
    setPath([]);
    setDistance(0);
    setTime(0);
    lastPointRef.current = null;

    // timer
    timerRef.current = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPoint = [latitude, longitude];

        setPosition(newPoint);
        setPath(prev => [...prev, newPoint]);

        if (lastPointRef.current) {
          const d = getDistance(
            lastPointRef.current[0],
            lastPointRef.current[1],
            latitude,
            longitude
          );
          setDistance(prev => prev + d);
        }

        lastPointRef.current = newPoint;
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    clearInterval(timerRef.current);
  };

  const pace =
    distance > 0
      ? (time / 60 / distance).toFixed(2)
      : "0.00";

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* MAP */}
      <div style={{ flex: 1 }}>
        <MapContainer
          center={[28.6139, 77.2090]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {position && <Marker position={position} />}
          {path.length > 1 && <Polyline positions={path} />}
          <Recenter position={position} />
        </MapContainer>
      </div>

      {/* STATS + CONTROLS */}
      <div
        style={{
          padding: "12px",
          background: "#fff",
          borderTop: "1px solid #ddd"
        }}
      >
        <p>⏱ Time: {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</p>
        <p>📏 Distance: {distance.toFixed(2)} km</p>
        <p>⚡ Pace: {pace} min/km</p>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            onClick={startTracking}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "12px",
              background: "#16a34a",
              color: "#fff",
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
              background: "#ef4444",
              color: "#fff",
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
