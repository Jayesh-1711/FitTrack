import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import { useNavigate } from "react-router-dom";

export default function Profile() {

  const [runs, setRuns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchRuns = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:2000/api/run/RunTrack", {
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

  // HEATMAP
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

  // LIGHT HEATMAP COLORS
  const getHeatColor = (count) => {

    if (count === 0) return "bg-gray-200";
    if (count === 1) return "bg-green-300";
    if (count === 2) return "bg-green-500";
    return "bg-green-700";

  };

  return (

    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">

      {/* HEADER */}
      <div className="bg-[#1A1A1A] border-b border-[#2A2A2A] py-4 text-center text-xl font-semibold">
        Profile
      </div>

      <div className="flex-1 px-4 py-4 pb-40">

        {/* TOTAL STATS */}

        <div className="grid grid-cols-2 gap-3 mb-6">

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-center hover:border-[#F97316] transition">
            <p className="text-gray-400 text-sm">Total Runs</p>
            <p className="font-bold text-lg">📊 {runs.length}</p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-center hover:border-[#F97316] transition">
            <p className="text-gray-400 text-sm">Total Distance</p>
            <p className="text-[#F97316] font-bold text-lg">
              🏃 {totalDistance.toFixed(2)} km
            </p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-center hover:border-[#F97316] transition">
            <p className="text-gray-400 text-sm">Total Time</p>
            <p className="text-[#FB923C] font-bold text-lg">
              ⏱ {Math.floor(totalTime / 60)} min
            </p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-center hover:border-[#F97316] transition">
            <p className="text-gray-400 text-sm">Avg Pace</p>
            <p className="text-[#FB923C] font-bold text-lg">
              ⚡ {avgPace} min/km
            </p>
          </div>

        </div>
        <h2 className="text-lg font-semibold mb-3 text-[#FB923C]">
          This Month
        </h2>

        <div className="grid grid-cols-2 gap-3 mb-6">

          <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-4 text-center hover:border-[#F97316] transition">
            <p className="text-gray-400 text-sm">Runs</p>
            <p className="font-bold text-lg">{monthlyRuns.length}</p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-4 text-center hover:border-[#F97316] transition">
            <p className="text-gray-400 text-sm">Distance</p>
            <p className="text-[#F97316] font-bold text-lg">
              {monthlyDistance.toFixed(2)} km
            </p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-4 text-center hover:border-[#F97316] transition">
            <p className="text-gray-400 text-sm">Time</p>
            <p className="text-[#FB923C] font-bold text-lg">
              {Math.floor(monthlyTime / 60)} min
            </p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-4 text-center hover:border-[#F97316] transition">
            <p className="text-gray-400 text-sm">Avg Pace</p>
            <p className="text-[#FB923C] font-bold text-lg">
              {monthlyAvgPace} min/km
            </p>
          </div>

        </div>
        {/* HEATMAP */}

        <h2 className="text-lg font-semibold mb-3 text-[#FB923C]">
          Last 30 Days Activity
        </h2>

        <div className="bg-[#151515] rounded-xl border border-gray-700 p-4 mb-6">

          <div className="grid grid-cols-10 gap-2">

            {heatmapData.map((d, i) => (

              <div
                key={i}
                title={`${d.date.toDateString()} - ${d.count} runs`}
                className={`h-5 w-5 rounded border border-gray-300 hover:scale-110 transition ${getHeatColor(d.count)}`}
              />

            ))}

          </div>

        </div>

        {/* RUN HISTORY */}

        <h2 className="text-lg font-semibold mb-4 text-[#FB923C]">
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
                className="bg-[#1A1A1A] border border-[#262626] rounded-2xl mb-4 overflow-hidden hover:border-[#F97316] transition"
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
                      style={{ height: "100%", width: "100%" }}
                    >

                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                      <Polyline
                        positions={path}
                        pathOptions={{
                          color: "#F97316",
                          weight: 5,
                          opacity: 0.9
                        }}
                      />

                    </MapContainer>

                  )}

                </div>

                <div className="p-4">

                  <p className="text-gray-400 text-sm">
                    {new Date(run.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex justify-between mt-2 text-sm font-semibold">
                    <span>{run.distance?.toFixed(2)} km</span>
                    <span>{Math.floor(run.duration / 60)} min</span>
                  </div>

                  <p className="text-[#FB923C] font-semibold mt-1">
                    ⚡ {run.pace?.toFixed(2)} min/km
                  </p>

                  <button
                    onClick={() => navigate(`/run/${run._id}`)}
                    className="inline-block mt-3 px-3 py-1 text-xs bg-[#F97316] text-white rounded-full hover:bg-[#FB923C] transition"
                  >
                    View Details
                  </button>

                </div>

              </div>

            );

          })

        ) : (
          <p className="text-gray-400">No runs yet.</p>
        )}

      </div>

      {/* START RUN BUTTON */}

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">

        <button
          onClick={() => navigate("/track")}
          className="w-16 h-16 bg-[#22C55E] text-white rounded-full shadow-[0_0_20px_rgba(34,197,94,0.6)] text-3xl flex items-center justify-center active:scale-95 transition"
        >
          +
        </button>

      </div>

    </div>

  );

}