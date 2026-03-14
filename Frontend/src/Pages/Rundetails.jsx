import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import html2canvas from "html2canvas";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function RunDetails() {

  const { id } = useParams();
  const navigate = useNavigate();
  const pageRef = useRef(null);

  const [run, setRun] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [splits, setSplits] = useState([]);

  const handleShare = async () => {
  try {

    const canvas = document.createElement("canvas");
    const width = 420;
    const height = 520;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0,0,0,height);
    gradient.addColorStop(0,"#F97316");
    gradient.addColorStop(1,"#FB923C");

    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,width,height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("My Run", width/2,40);

    const mapX = 30;
    const mapY = 70;
    const mapW = 360;
    const mapH = 260;

    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(mapX,mapY,mapW,mapH);

    ctx.strokeStyle="#d1d5db";
    ctx.lineWidth=1;

    for(let i=0;i<mapW;i+=40){
      ctx.beginPath();
      ctx.moveTo(mapX+i,mapY);
      ctx.lineTo(mapX+i,mapY+mapH);
      ctx.stroke();
    }

    for(let i=0;i<mapH;i+=40){
      ctx.beginPath();
      ctx.moveTo(mapX,mapY+i);
      ctx.lineTo(mapX+mapW,mapY+i);
      ctx.stroke();
    }

    if(run.route && run.route.length>1){

      const lats = run.route.map(p=>p.lat);
      const lngs = run.route.map(p=>p.lng);

      const minLat=Math.min(...lats);
      const maxLat=Math.max(...lats);
      const minLng=Math.min(...lngs);
      const maxLng=Math.max(...lngs);

      ctx.beginPath();

      run.route.forEach((p,i)=>{

        const x = mapX + ((p.lng-minLng)/(maxLng-minLng||1))*mapW;
        const y = mapY + ((maxLat-p.lat)/(maxLat-minLat||1))*mapH;

        if(i===0) ctx.moveTo(x,y);
        else ctx.lineTo(x,y);

      });

      ctx.strokeStyle="#F97316";
      ctx.lineWidth=5;
      ctx.stroke();

      const start = run.route[0];
      const sx = mapX + ((start.lng-minLng)/(maxLng-minLng||1))*mapW;
      const sy = mapY + ((maxLat-start.lat)/(maxLat-minLat||1))*mapH;

      ctx.fillStyle="green";
      ctx.beginPath();
      ctx.arc(sx,sy,6,0,Math.PI*2);
      ctx.fill();

      const end = run.route[run.route.length-1];
      const ex = mapX + ((end.lng-minLng)/(maxLng-minLng||1))*mapW;
      const ey = mapY + ((maxLat-end.lat)/(maxLat-minLat||1))*mapH;

      ctx.fillStyle="red";
      ctx.beginPath();
      ctx.arc(ex,ey,6,0,Math.PI*2);
      ctx.fill();

    }

    ctx.fillStyle="#ffffff";
    ctx.font="18px Arial";
    ctx.textAlign="left";

    ctx.fillText(`Distance: ${run.distance.toFixed(2)} km`,40,370);
    ctx.fillText(`Duration: ${Math.floor(run.duration/60)} min`,40,400);
    ctx.fillText(`Pace: ${run.pace.toFixed(2)} min/km`,40,430);

    ctx.fillText(
      new Date(run.createdAt).toLocaleDateString(),
      40,
      460
    );

    const blob = await new Promise(resolve =>
      canvas.toBlob(resolve,"image/png")
    );

    const file = new File([blob],"run.png",{type:"image/png"});

    if(navigator.canShare && navigator.canShare({files:[file]})){

      await navigator.share({
        title:"My Run",
        text:"Check out my run!",
        files:[file]
      });

    } else {

      const link=document.createElement("a");
      link.download="run.png";
      link.href=URL.createObjectURL(blob);
      link.click();

    }

  } catch(err){
    console.error("Share error:",err);
  }
};

  useEffect(() => {

    const fetchRun = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:2000/api/run/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();

        setRun(data);

        generateGraph(data);
        generateSplits(data);

      } catch (err) {
        console.error(err);
      }

    };

    fetchRun();

  }, [id]);

  const generateGraph = (runData) => {

    if (!runData.route) return;

    let distance = 0;
    let totalTime = 0;

    const data = runData.route.map(() => {

      distance += runData.distance / runData.route.length;
      totalTime += runData.duration / runData.route.length;

      const pace = (totalTime / 60) / distance;

      return {
        distance: distance.toFixed(2),
        time: (totalTime / 60).toFixed(2),
        pace: pace.toFixed(2)
      };

    });

    setGraphData(data);
  };

  const generateSplits = (runData) => {

    if (!runData.distance) return;

    const totalDistance = runData.distance;
    const totalTime = runData.duration;
    const pace = totalTime / totalDistance;
    const kmCount = Math.floor(totalDistance);

    const splitData = [];

    for (let i = 1; i <= kmCount; i++) {

      splitData.push({
        km: i,
        time: (pace * i) / 60
      });

    }

    setSplits(splitData);
  };

  if (!run) return <p className="p-4 text-white">Loading run...</p>;

  const path = Array.isArray(run.route)
    ? run.route.map(p => [p.lat, p.lng])
    : [];

  return (
  <div ref={pageRef} className="min-h-screen bg-[#0F0F0F] text-white">

    <div className="bg-[#1A1A1A] px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-20">

      <button
        onClick={() => navigate(-1)}
        className="text-[#F97316] font-semibold"
      >
        ← Back
      </button>

      <h2 className="font-bold text-lg">Run Details</h2>

      <button
        onClick={handleShare}
        className="bg-[#22C55E] text-white px-3 py-1.5 rounded-lg text-sm"
      >
        Share
      </button>

    </div>

    <div className="h-[40vh] px-3 pt-3 relative z-0">

      <div className="h-full rounded-2xl overflow-hidden shadow">

        {path.length > 0 ? (

          <MapContainer
            center={path[0]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >

            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Polyline
              positions={path}
              pathOptions={{
                color: "#F97316",
                weight: 6,
                opacity: 0.9
              }}
            />

            <Marker position={path[0]} />
            <Marker position={path[path.length - 1]} />

          </MapContainer>

        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 bg-[#1A1A1A]">
            No route data
          </div>
        )}

      </div>

    </div>

    <div className="px-4 -mt-10 mb-4 relative z-20">

      <div className="bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white rounded-2xl shadow-lg p-4 grid grid-cols-3 text-center">

        <div>
          <p className="text-xs opacity-80">Distance</p>
          <p className="font-bold text-lg">{run.distance?.toFixed(2)} km</p>
        </div>

        <div>
          <p className="text-xs opacity-80">Duration</p>
          <p className="font-bold text-lg">
            {Math.floor(run.duration / 60)} min
          </p>
        </div>

        <div>
          <p className="text-xs opacity-80">Pace</p>
          <p className="font-bold text-lg">{run.pace?.toFixed(2)}</p>
        </div>

      </div>

    </div>

    <div className="px-4 pb-6">

      <div className="bg-[#1A1A1A] rounded-2xl shadow-sm p-4">

        <h3 className="font-semibold mb-3">
          Performance Graph
        </h3>

        <ResponsiveContainer width="100%" height={220}>

          <LineChart data={graphData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="distance" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="time"
              stroke="#F97316"
            />

            <Line
              type="monotone"
              dataKey="pace"
              stroke="#22C55E"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

    <div className="px-4 pb-8">

      <div className="bg-[#1A1A1A] rounded-2xl shadow-sm p-4">

        <h3 className="font-semibold mb-3">
          Kilometer Splits
        </h3>

        <div className="space-y-3">

          {splits.map((s,i)=>(

            <div key={i}>

              <div className="flex justify-between mb-1">
                <span>{s.km} km</span>
                <span>{s.time.toFixed(2)} min</span>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2">

                <div
                  className="bg-[#F97316] h-2 rounded-full"
                  style={{width:`${Math.min(100,60-s.time*10)}%`}}
                />

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  </div>
  
  );
}