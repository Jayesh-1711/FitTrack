import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import { useNavigate } from "react-router-dom";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Profile() {

  const [runs, setRuns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchRuns = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await fetch("https://fittrack-4-mlfn.onrender.com/api/run/RunTrack", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          setRuns(data);
        } else {
          setRuns([]);
        }

      } catch (err) {
        console.log(err);
      }

    };

    fetchRuns();

  }, []);

  const totalDistance = runs.reduce((sum, r) => sum + (r.distance || 0), 0);
  const totalTime = runs.reduce((sum, r) => sum + (r.duration || 0), 0);

  const avgPace =
    totalDistance > 0
      ? (totalTime / 60 / totalDistance).toFixed(2)
      : "0.00";

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyRuns = runs.filter(r => {
    const d = new Date(r.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const monthlyDistance = monthlyRuns.reduce((s, r) => s + (r.distance || 0), 0);
  const monthlyTime = monthlyRuns.reduce((s, r) => s + (r.duration || 0), 0);

  const monthlyAvgPace =
    monthlyDistance > 0
      ? (monthlyTime / 60 / monthlyDistance).toFixed(2)
      : "0.00";
 const weeklyData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days.map((day, index) => {
      const total = runs
        .filter(r => new Date(r.createdAt).getDay() === index)
        .reduce((sum, r) => sum + (r.distance || 0), 0);

      return {
        day,
        distance: Number(total.toFixed(2))
      };
    });
  }, [runs]);

  
  const heatmapData = useMemo(() => {

    const data = [];

    for (let i = 29; i >= 0; i--) {

      const date = new Date();
      date.setHours(0,0,0,0);
      date.setDate(date.getDate() - i);

      const runsToday = runs.filter(r => {

        const runDate = new Date(r.createdAt);
        runDate.setHours(0,0,0,0);

        return runDate.getTime() === date.getTime();

      });

      data.push({
        date,
        count: runsToday.length
      });

    }

    return data;

  }, [runs]);

  
  const getHeatColor = (count) => {

    if (count === 0) return "bg-gray-200";
    if (count === 1) return "bg-green-300";
    if (count === 2) return "bg-green-500";
    return "bg-green-700";

  };
  const handleLogout = () => {
    
if (window.confirm("Are you sure you want to logout?")) {
  localStorage.removeItem("token");
  navigate("/user/log"); 
}

  

};

return (
  <div className="min-h-screen bg-black/80 text-white flex flex-col">

    
    <div className="sticky top-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-[#2A2A2A] py-4 px-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold">👤 Profile</h2>

      <button
        onClick={handleLogout}
        className="bg-orange-500 px-3 py-1 rounded-lg text-sm font-semibold shadow active:scale-95"
      >
        Logout
      </button>
    </div>

    <div className="flex-1 px-4 py-4 pb-40">

      
      <div className="grid grid-cols-2 gap-3 mb-6">

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 text-center shadow-md">
          <p className="text-gray-400 text-xs">Total Runs</p>
          <p className="font-bold text-xl">{runs.length}</p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 text-center shadow-md">
          <p className="text-gray-400 text-xs">Distance</p>
          <p className="text-orange-400 font-bold text-xl">
            {totalDistance.toFixed(2)} km
          </p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 text-center shadow-md">
          <p className="text-gray-400 text-xs">Time</p>
          <p className="text-orange-300 font-bold text-xl">
            {Math.floor(totalTime / 60)} min
          </p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 text-center shadow-md">
          <p className="text-gray-400 text-xs">Avg Pace</p>
          <p className="text-orange-400 font-bold text-xl">
            {avgPace} min/km
          </p>
        </div>

      </div>

  
      <h2 className="text-sm font-semibold mb-3 text-gray-300">
        This Month
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-6">

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 text-center">
          <p className="text-gray-400 text-xs">Runs</p>
          <p className="font-bold text-lg">{monthlyRuns.length}</p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 text-center">
          <p className="text-gray-400 text-xs">Distance</p>
          <p className="text-orange-400 font-bold text-lg">
            {monthlyDistance.toFixed(2)} km
          </p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 text-center">
          <p className="text-gray-400 text-xs">Time</p>
          <p className="text-orange-300 font-bold text-lg">
            {Math.floor(monthlyTime / 60)} min
          </p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 text-center">
          <p className="text-gray-400 text-xs">Avg Pace</p>
          <p className="text-orange-400 font-bold text-lg">
            {monthlyAvgPace} min/km
          </p>
        </div>

      </div>
      <h2 className="text-sm font-semibold mb-3 text-gray-300">Weekly Activity</h2>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 mb-6">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1A1A1A", border: "none" }} />
              <Line type="monotone" dataKey="distance" stroke="#F97316" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      
      <h2 className="text-sm font-semibold mb-3 text-gray-300">
        Last 30 Days Activity
      </h2>

      <div className="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-4 mb-6 shadow-md">

        <div className="grid grid-cols-10 gap-2">
          {heatmapData.map((d, i) => (
            <div
              key={i}
              title={`${d.date.toDateString()} - ${d.count} runs`}
              className={`h-5 w-5 rounded-md transition hover:scale-110 ${getHeatColor(d.count)}`}
            />
          ))}
        </div>

      </div>

      
      <h2 className="text-sm font-semibold mb-4 text-gray-300">
        Run History
      </h2>

      {runs.length > 0 ? (

        runs.map(run => {

          const path = Array.isArray(run.route)
            ? run.route.map(p => [p.lat, p.lng])
            : [];

          return (

            <div
              key={run._id}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl mb-4 overflow-hidden shadow-md"
            >

              <div className="h-36">
                {path.length > 0 && (
                  <MapContainer
                    center={path[0]}
                    zoom={14}
                    scrollWheelZoom={false}
                    zoomControl={false}
                    dragging={false}
                    doubleClickZoom={false}
                    className="h-full w-full"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <Polyline
                      positions={path}
                      pathOptions={{
                        color: "#F97316"
                      }}
                    />
                  </MapContainer>
                )}
              </div>

              <div className="p-4">

                <p className="text-gray-400 text-xs">
                  {new Date(run.createdAt).toLocaleDateString()}
                </p>

                <div className="flex justify-between mt-2 text-sm font-semibold">
                  <span>{run.distance?.toFixed(2)} km</span>
                  <span>{Math.floor(run.duration / 60)} min</span>
                </div>

                <p className="text-orange-400 font-semibold mt-1">
                  ⚡ {run.pace?.toFixed(2)} min/km
                </p>

                <button
                  onClick={() => navigate(`/run/${run._id}`)}
                  className="mt-3 px-3 py-1 text-xs bg-orange-500 rounded-full shadow active:scale-95"
                >
                  View Details
                </button>

              </div>

            </div>

          );

        })

      ) : (
        <p className="text-gray-400 text-sm">No runs yet.</p>
      )}

    </div>

    
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
      <button
        onClick={() => navigate("/track")}
        className="w-16 h-16 bg-orange-500 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.6)] text-3xl flex items-center justify-center active:scale-95 transition"
      >
        +
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