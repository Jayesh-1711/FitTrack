import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {

  const navigate = useNavigate();
  const [runs, setRuns] = useState([]);

  
  useEffect(() => {

    const fetchRuns = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://fittrack-4-mlfn.onrender.com/api/run/RunTrack",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = await res.json();
        setRuns(Array.isArray(data) ? data : []);

      } catch (err) {
        console.log(err);
      }
    };

    fetchRuns();

  }, []);

  
  const now = new Date();

  const weeklyRuns = runs.filter(r => {
    const d = new Date(r.createdAt);
    return now - d <= 7 * 24 * 60 * 60 * 1000;
  });

  const weeklyDistance = weeklyRuns.reduce(
    (sum, r) => sum + (r.distance || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#1A1A1A] text-white flex flex-col px-4 py-6">

      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🏃 FitTrack</h1>

        <button
          onClick={() => navigate("/profile")}
          className="bg-[#1A1A1A] border border-[#2A2A2A] px-3 py-1 rounded-lg text-sm active:scale-95"
        >
          Profile
        </button>
      </div>

    
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold leading-tight">
          Ready for your <br /> next run?
        </h2>
        <p className="text-gray-400 mt-2 text-sm">
          Stay consistent. Track progress. Improve daily.
        </p>
      </div>

      
      <div className="grid grid-cols-2 gap-4 mb-10">

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 text-center">
          <p className="text-gray-400 text-xs">This Week</p>
          <p className="text-xl font-bold text-orange-400">
            {weeklyDistance.toFixed(2)} km
          </p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 text-center">
          <p className="text-gray-400 text-xs">Runs</p>
          <p className="text-xl font-bold text-orange-300">
            {weeklyRuns.length}
          </p>
        </div>

      </div>

      
      <div className="flex justify-center mt-auto mb-16">
        <button
          onClick={() => navigate("/track")}
          className="w-44 h-44 rounded-full text-white text-xl font-semibold
          bg-gradient-to-br from-orange-500 via-orange-600 to-orange-500
          shadow-[0_0_40px_rgba(249,115,22,0.7)]
          flex items-center justify-center
          transition-all duration-300
          hover:scale-95 hover:shadow-[0_0_70px_rgba(249,115,22,1)]
          active:scale-90"
        >
          ▶ Start Run
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